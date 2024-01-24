import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ChartTabs from "../../../src/components/ChartTabs.vue";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

test("displays message", () => {
  const wrapper = mount(
    {
      template: "<chart-tabs />",
    },
    {
      props: {},
      global: {
        components: {
          ChartTabs,
        },
        plugins: [vuetify],
      },
    }
  );

  expect(wrapper.text()).toContain("Churn RateRecurring Revenue");
});
