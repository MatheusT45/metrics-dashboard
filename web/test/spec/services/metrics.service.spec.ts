import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getChurnRate,
  getRecurringRevenue,
} from "../../../src/services/metrics.service";

const mockedFile = new File(["test"], "filename", { type: "text/html" });

describe("MetricsService", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ json: vi.fn() });
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
});
