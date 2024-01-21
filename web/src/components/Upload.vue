<script setup lang="ts">
import { ref } from "vue";

const isSelecting = ref(false);
const uploader = ref<any>(null);

const handleFileImport = () => {
  isSelecting.value = true;

  window.addEventListener(
    "focus",
    () => {
      isSelecting.value = false;
    },
    { once: true }
  );

  uploader.value.click();
};
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <input
            ref="uploader"
            @change="$emit('onUpload', $event)"
            type="file"
            id="upload-btn"
            hidden
          />
          <label class="upload-card" for="upload-btn">
            <v-btn
              color="purple-darken-4"
              min-width="228"
              size="x-large"
              variant="flat"
              @click="handleFileImport"
            >
              <v-icon icon="mdi-upload" size="large" start />
              Upload File
            </v-btn>
          </label>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
