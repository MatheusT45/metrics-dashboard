import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ChartOptions from "../../../src/components/ChartOptions.vue";
import { describe } from "node:test";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("ChartOptions", () => {
  test("displays message", () => {
    const wrapper = mount(
      {
        template: "<chart-options />",
      },
      {
        props: {},
        global: {
          components: {
            ChartOptions,
          },
          plugins: [vuetify],
        },
      }
    );

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain("Options");
  });

  test("change props with select input change", async () => {
    const wrapper = mount(ChartOptions, {
      props: { selectedYear: 0, selectedPlanFilter: "All" },
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.vm.selectedYear).toEqual(0);
    expect(wrapper.vm.selectedPlanFilter).toEqual("All");

    const yearSelect = wrapper.findComponent({ ref: "year-select" });
    const planSelect = wrapper.findComponent({ ref: "plan-select" });

    expect(yearSelect.exists()).toBeTruthy();
    expect(planSelect.exists()).toBeTruthy();

    yearSelect.setValue(2022);
    planSelect.setValue("Monthly");

    expect(wrapper.vm.selectedYear).toEqual(2022);
    expect(wrapper.vm.selectedPlanFilter).toEqual("Monthly");
  });
});
