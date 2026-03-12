import { mount } from "@vue/test-utils";
import DomainTable from "../components/DomainTable.vue";
import * as displayUtils from "../utils/display";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("DomainTable.vue", () => {
  const domains = [
    {
      domain: "example.com",
      registrar: "GoDaddy",
      status: "active" as const,
      created_at: "2023-01-01",
      expires_at: "2024-01-01",
      updated_at: "2023-06-01",
    },
    {
      domain: "test.com",
      registrar: "Namecheap",
      status: "clientHold" as const,
      created_at: "2022-05-10",
      expires_at: "2023-05-10",
    },
  ];

  beforeEach(() => {
    // Mock displayValue to just return the value (so we don't rely on its implementation)
    vi.spyOn(displayUtils, "displayValue").mockImplementation(
      (value: string | null | undefined, fallback?: string) =>
        value ?? fallback ?? "Unknown",
    );
  });

  it("renders table headers", () => {
    const wrapper = mount(DomainTable, { props: { domains } });
    expect(wrapper.text()).toContain("Domain");
    expect(wrapper.text()).toContain("Registrar");
    expect(wrapper.text()).toContain("Status");
    expect(wrapper.text()).toContain("Created At");
    expect(wrapper.text()).toContain("Expires At");
    expect(wrapper.text()).toContain("Updated At");
  });

  it("renders all domain rows", () => {
    const wrapper = mount(DomainTable, { props: { domains } });
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(domains.length);
    expect(rows[0].text()).toContain("example.com");
    expect(rows[1].text()).toContain("test.com");
  });

  it("emits select event when row is clicked", async () => {
    const wrapper = mount(DomainTable, { props: { domains } });
    await wrapper.find("tbody tr").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")![0]).toEqual([domains[0]]);
  });

  it("emits sort event when header is clicked", async () => {
    const wrapper = mount(DomainTable, { props: { domains } });

    const domainHeader = wrapper.find("th:nth-child(1)");
    await domainHeader.trigger("click");
    expect(wrapper.emitted("sort")).toBeTruthy();
    expect(wrapper.emitted("sort")![0]).toEqual(["domain"]);

    const expiresHeader = wrapper.find("th:nth-child(5)");
    await expiresHeader.trigger("click");
    expect(wrapper.emitted("sort")![1]).toEqual(["expires_at"]);
  });

  it("applies correct status class", () => {
    const wrapper = mount(DomainTable, { props: { domains } });
    const firstStatus = wrapper.find("tbody tr:first-child td.status");
    expect(firstStatus.classes()).toContain("active");

    const secondStatus = wrapper.findAll("tbody tr td.status")[1];
    expect(secondStatus.classes()).toContain("clientHold");
  });
});
