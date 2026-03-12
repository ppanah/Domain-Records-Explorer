import { mount } from "@vue/test-utils";
import DomainModal from "../components/DomainDetails.vue";
import * as displayUtils from "../utils/display";
import * as dateUtils from "../utils/date";
import { describe, it, expect, beforeEach, vi } from "vitest";

const domain = {
  domain: "example.com",
  registrar: "GoDaddy",
  status: "active" as const,
  created_at: "2023-01-01",
  expires_at: "2024-01-01",
  updated_at: "2023-06-01",
  nameservers: ["ns1.example.com", "ns2.example.com"],
};

// Mock utility functions
vi.spyOn(displayUtils, "displayValue").mockImplementation(
  (value: string | null | undefined, fallback?: string) =>
    value ?? fallback ?? "Unknown",
);
vi.spyOn(dateUtils, "formatDate").mockImplementation(
  (val: string) => `formatted-${val}`,
);

describe("DomainModal.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(DomainModal, { props: { domain } });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders domain details correctly", () => {
    expect(wrapper.text()).toContain(domain.domain);
    expect(wrapper.text()).toContain(`Registrar: ${domain.registrar}`);
    expect(wrapper.text()).toContain(`Status: ${domain.status}`);
    expect(wrapper.text()).toContain(`Created: formatted-${domain.created_at}`);
    expect(wrapper.text()).toContain(`Expires: formatted-${domain.expires_at}`);
    expect(wrapper.text()).toContain(`Updated: formatted-${domain.updated_at}`);
  });

  it("renders nameservers when available", () => {
    const nsItems = wrapper.findAll("ul li");
    expect(nsItems).toHaveLength(domain.nameservers!.length);
    expect(nsItems[0].text()).toBe(domain.nameservers![0]);
    expect(nsItems[1].text()).toBe(domain.nameservers![1]);
  });

  it('shows "N/A" when no nameservers', async () => {
    await wrapper.setProps({ domain: { ...domain, nameservers: [] } });
    expect(wrapper.text()).toContain("N/A");
  });

  it("emits close when overlay is clicked", async () => {
    await wrapper.find(".overlay").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("does not emit close when modal content is clicked", async () => {
    await wrapper.find(".modal").trigger("click");
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  it("emits close when close button is clicked", async () => {
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close when Escape key is pressed", async () => {
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    window.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("removes keydown listener on unmount", async () => {
    const spyRemove = vi.spyOn(window, "removeEventListener");
    wrapper.unmount();
    expect(spyRemove).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
