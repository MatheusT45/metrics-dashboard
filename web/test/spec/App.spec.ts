import { beforeEach, describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import App from "../../src/App.vue";
import { mount } from "@vue/test-utils";
import {
  getChurnRate,
  getRecurringRevenue,
  getLifetimeValue,
} from "../../src/services/metrics.service";

vi.mock("../../src/services/metrics.service", () => ({
  getChurnRate: vi.fn(() => [{ relatesTo: "01-2020", churnRate: 0.1 }]),
  getRecurringRevenue: vi.fn(() => [
    { relatesTo: "01-2020", recurringRevenue: 0.1 },
  ]),
  getLifetimeValue: vi.fn(() => ({
    data: [{ relatesTo: "01-2020", recurringRevenue: 0.1 }],
    total: { relatesTo: "01-2020", recurringRevenue: 0.1 },
  })),
}));

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("App", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(App, {
      props: {},
      global: {
        plugins: [vuetify],
      },
    });

    vi.clearAllMocks();
  });

  test("displays app name", () => {
    expect(wrapper.text()).toContain("Metrics Dashboard");
  });

  test("should call service requests when onUpload is called", async () => {
    await wrapper.vm.onUpload({ target: { files: [{ name: "test.csv" }] } });
    wrapper.vm.$nextTick(() => {
      expect(getChurnRate).toHaveBeenCalledWith({}, { name: "test.csv" });
      expect(getRecurringRevenue).toHaveBeenCalledWith(
        {},
        { name: "test.csv" }
      );
      expect(getLifetimeValue).toHaveBeenCalledWith({}, { name: "test.csv" });
    });
  });

  test("should call service requests when useTestFile is called", async () => {
    await wrapper.vm.useTestFile();
    wrapper.vm.$nextTick(() => {
      expect(getChurnRate).toHaveBeenCalledWith({});
      expect(getRecurringRevenue).toHaveBeenCalledWith({});
      expect(getLifetimeValue).toHaveBeenCalledWith({});
    });
  });

  test("should call service requests when selectedYear is changed", () => {
    wrapper.vm.selectedYear = 2020;

    wrapper.vm.$nextTick(() => {
      expect(getChurnRate).toHaveBeenCalledWith(
        {
          year: 2020,
          filterSubscriptionPlan: "All",
        },
        undefined
      );
      expect(getRecurringRevenue).toHaveBeenCalledWith(
        {
          year: 2020,
          filterSubscriptionPlan: "All",
        },
        undefined
      );
    });
  });

  test("should call service requests when filterSubscriptionPlan is changed", () => {
    wrapper.vm.selectedPlanFilter = "Monthly";

    wrapper.vm.$nextTick(() => {
      expect(getChurnRate).toHaveBeenCalledWith(
        {
          year: 0,
          filterSubscriptionPlan: "Monthly",
        },
        undefined
      );
      expect(getRecurringRevenue).toHaveBeenCalledWith(
        {
          year: 0,
          filterSubscriptionPlan: "Monthly",
        },
        undefined
      );
    });
  });

  test("should trigger snackbar on error", async () => {
    (getChurnRate as any).mockResolvedValue(undefined);
    (getRecurringRevenue as any).mockResolvedValue(undefined);
    (getLifetimeValue as any).mockResolvedValue(undefined);
    await wrapper.vm.onUpload({ target: { files: [{ name: "test.csv" }] } });

    expect(wrapper.vm.snackbar).toBeTruthy();
  });
});
