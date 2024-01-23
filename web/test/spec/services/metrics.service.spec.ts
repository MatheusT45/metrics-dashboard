import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getChurnRate,
  getLifetimeValue,
  getRecurringRevenue,
} from "../../../src/services/metrics.service";

const mockedFile = new File(["test"], "filename", { type: "text/html" });

describe("MetricsService", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => ({
        data: [],
      }),
    });
    vi.spyOn(FormData.prototype, "append");
  });

  describe("getChurnRate", () => {
    test("calls fetch without files", () => {
      getChurnRate({});

      expect(global.fetch).toHaveBeenCalled();
    });

    test("calls fetch with files", () => {
      getChurnRate({}, mockedFile);

      expect(FormData.prototype.append).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("getRecurringRevenue", () => {
    test("calls fetch without files", () => {
      getRecurringRevenue({});

      expect(global.fetch).toHaveBeenCalled();
    });

    test("calls fetch with files", () => {
      getRecurringRevenue({}, mockedFile);

      expect(FormData.prototype.append).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("getLifetimeValue", () => {
    test("calls fetch without files", () => {
      getLifetimeValue({});

      expect(global.fetch).toHaveBeenCalled();
    });

    test("calls fetch with files", () => {
      getLifetimeValue({}, mockedFile);

      expect(FormData.prototype.append).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
