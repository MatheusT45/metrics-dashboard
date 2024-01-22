<script setup lang="ts">
import { ref } from "vue";

const uploader = ref<HTMLElement | null>(null);

const handleFileImport = () => {
  uploader?.value?.click();
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
            id="upload-input"
            hidden
          />
          <label class="upload-card" for="upload-btn">
            <v-btn
              color="purple-darken-4"
              min-width="228"
              size="x-large"
              variant="flat"
              id="file-upload-btn"
              @click="handleFileImport"
            >
              <v-icon icon="mdi-upload" size="large" start />
              Upload File
            </v-btn>
            <p>OR</p>
            <v-btn
              color="secondary"
              min-width="228"
              size="x-large"
              variant="flat"
              id="test-file-btn"
              @click="$emit('onTestFileClick', $event)"
            >
              <v-icon icon="mdi-file-document" size="large" start />
              Use test file
            </v-btn>
          </label>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped>
.upload-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
button {
  margin: 1rem;
}
</style>
