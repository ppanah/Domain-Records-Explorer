import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Home from "../views/Home.vue";
import domainsData from "../mock/domains.json";

// Mock child components
const DomainTable = {
  template:
    "<div class=\"domain-table\" @sort=\"$emit('sort','domain')\" @select=\"$emit('select', $event)\"></div>",
};
const DomainFilters = {
  template: '<div class="domain-filters"></div>',
  props: ["status", "registrar"],
};
const DomainSearch = {
  template: '<input class="domain-search" @input="$emit(\'input\')" />',
  props: ["modelValue"],
};
const DomainDetails = {
  template:
    '<div class="domain-details"><button @click="$emit(\'close\')">Close</button></div>',
  props: ["domain"],
};

// Mock debounce to call immediately
vi.mock("../utils/debounce", () => ({
  debounce: (fn: Function) => fn,
}));

describe("Home.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        stubs: { DomainTable, DomainFilters, DomainSearch, DomainDetails },
      },
    });
  });

  it("shows loading state initially", () => {
    expect(wrapper.text()).toContain("Loading domains...");
  });

  it("loads domains and renders table after mount", async () => {
    // Wait for setTimeout in onMounted
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    expect(wrapper.find(".domain-table").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Loading domains...");
    expect(wrapper.find(".status-message")?.exists()).toBe(false);
  });

  it('renders "No domain records found" if filters remove all domains', async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    // Simulate filtering all domains out
    wrapper.vm.searchQuery = "nonexistent";
    wrapper.vm.applyFilters();
    await nextTick();

    expect(wrapper.text()).toContain("No domain records found.");
  });

  it("updates selectedDomain when DomainTable emits select", async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    const domain = domainsData[0];
    await wrapper.findComponent(DomainTable).vm.$emit("select", domain);
    await nextTick();

    expect(wrapper.vm.selectedDomain).toEqual(domain);
    expect(wrapper.findComponent(DomainDetails).exists()).toBe(true);
  });

  it("closes modal when DomainDetails emits close", async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    const domain = domainsData[0];
    wrapper.vm.selectedDomain = domain;
    await nextTick();

    await wrapper.findComponent(DomainDetails).vm.$emit("close");
    await nextTick();

    expect(wrapper.vm.selectedDomain).toBeNull();
  });

  it("changes sort direction when DomainTable emits sort", async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    expect(wrapper.vm.sortKey).toBe("domain");
    expect(wrapper.vm.sortDirection).toBe("asc");

    await wrapper.findComponent(DomainTable).vm.$emit("sort", "domain");
    await nextTick();

    expect(wrapper.vm.sortDirection).toBe("desc");
  });

  it("disables pagination buttons appropriately", async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await nextTick();

    const prevButton = wrapper.find(".pagination button:first-child");
    const nextButton = wrapper.find(".pagination button:last-child");

    // On first page, prev disabled
    expect((prevButton.element as HTMLButtonElement).disabled).toBe(true);
    expect((nextButton.element as HTMLButtonElement).disabled).toBe(false);
  });
});
