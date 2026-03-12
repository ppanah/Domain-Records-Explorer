import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SearchInput from "../components/DomainSearch.vue";

describe("SearchInput.vue", () => {
  it("renders initial value from modelValue", () => {
    const wrapper = mount(SearchInput, {
      props: { modelValue: "example.com" },
    });
    const input = wrapper.find("input");
    expect((input.element as HTMLInputElement).value).toBe("example.com");
  });

  it("emits update:modelValue and input when user types", async () => {
    const wrapper = mount(SearchInput, { props: { modelValue: "" } });
    const input = wrapper.find("input");

    await input.setValue("test.com");

    const emitted = wrapper.emitted();
    expect(emitted["update:modelValue"]).toBeTruthy();
    expect(emitted["update:modelValue"][0]).toEqual(["test.com"]);
    expect(emitted["input"]).toBeTruthy();
    expect(emitted["input"][0]).toEqual(["test.com"]);
  });
});
