<script setup lang="ts">
import UploadIcon from './icons/IconUpload.vue'
</script>

<template>
  <label class="upload-card">
    <input @change="$emit('onUpload', $event)" type="file" />
    <UploadIcon class="upload-card__icon" />
    <p>Upload</p>
  </label>
</template>

<style scoped>
.upload-card {
  cursor: pointer;
  border: 2px dashed var(--color-text);
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  padding: 4rem 8rem;
  text-align: center;
}

.upload-card:hover {
  background-color: black;
}

.upload-card__icon {
  fill: var(--color-text);
}

input[type='file'] {
  display: none;
}
</style>
