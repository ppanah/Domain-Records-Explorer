import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import FilterComponent from "../components/DomainFilters.vue"; // update path

describe("FilterComponent.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(FilterComponent, {
      props: { status: "", registrar: "" },
    });
  });

  it("renders default select values", () => {
    const statusSelect = wrapper.find("select:nth-child(1)");
    const registrarSelect = wrapper.find("select:nth-child(2)");

    expect((statusSelect.element as HTMLSelectElement).value).toBe("");
    expect((registrarSelect.element as HTMLSelectElement).value).toBe("");
  });

  it("emits update:status and change when status changes", async () => {
    const statusSelect = wrapper.find("select:nth-child(1)");
    await statusSelect.setValue("active");

    // Emit order: first update:status, then change
    const emitted = wrapper.emitted();
    expect(emitted["update:status"]).toBeTruthy();
    expect(emitted["update:status"][0]).toEqual(["active"]);
    expect(emitted["change"]).toBeTruthy();
    expect(emitted["change"][0]).toEqual([]);
  });

  it("emits update:registrar and change when registrar changes", async () => {
    const registrarSelect = wrapper.find("select:nth-child(2)");
    await registrarSelect.setValue("GoDaddy");

    const emitted = wrapper.emitted();
    expect(emitted["update:registrar"]).toBeTruthy();
    expect(emitted["update:registrar"][0]).toEqual(["GoDaddy"]);
    expect(emitted["change"]).toBeTruthy();
    expect(emitted["change"][0]).toEqual([]);
  });

  it("emits correct events when both selects change", async () => {
    const statusSelect = wrapper.find("select:nth-child(1)");
    const registrarSelect = wrapper.find("select:nth-child(2)");

    await statusSelect.setValue("clientHold");
    await registrarSelect.setValue("Namecheap");

    const emitted = wrapper.emitted();
    expect(emitted["update:status"][0]).toEqual(["clientHold"]);
    expect(emitted["update:registrar"][0]).toEqual(["Namecheap"]);
    // Two change events, one for each watcher
    expect(emitted["change"]).toHaveLength(2);
  });
});
