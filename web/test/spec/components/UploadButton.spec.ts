import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import UploadButton from "../../../src/components/UploadButton.vue";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("UploadButton", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      {
        template: "<upload-button />",
      },
      {
        props: {},
        global: {
          components: {
            UploadButton,
          },
          plugins: [vuetify],
        },
      }
    );
  });

  test("displays buttons", () => {
    expect(wrapper.text()).toContain("Upload");
  });

  test("emits test file upload click", () => {
    expect(wrapper.find("#test-file-btn").exists()).toBe(true);

    wrapper.find("#test-file-btn").trigger("click");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted("click").length).toEqual(1);
    });
  });

  test("emits file upload click", () => {
    expect(wrapper.find("#file-upload-btn").exists()).toBe(true);

    wrapper.find("#file-upload-btn").trigger("click");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted("click").length).toEqual(2);
    });
  });

  test("emits upload on input change", () => {
    expect(wrapper.find("#upload-input").exists()).toBe(true);

    wrapper.find("#upload-input").trigger("change");

    wrapper.vm.$nextTick(() => {
      expect(wrapper.emitted("change").length).toEqual(1);
    });
  });
});
