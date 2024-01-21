<script setup lang="ts">
const selectedYear = defineModel<number>("selectedYear");
const selectedPlanFilter = defineModel<"All" | "Monthly" | "Yearly">(
  "selectedPlanFilter"
);
</script>

<template>
  <h2>Options</h2>
  <div class="options">
    <v-select
      v-model="selectedYear"
      label="Year"
      :items="[
        { text: 'All', value: 0 },
        { text: '2022', value: 2022 },
        { text: '2023', value: 2023 },
        { text: '2024', value: 2024 },
      ]"
      item-title="text"
      item-value="value"
      variant="outlined"
      class="options-select"
    ></v-select>
    <v-select
      v-model="selectedPlanFilter"
      label="Subscription Plan"
      :items="['All', 'Monthly', 'Yearly']"
      variant="outlined"
      class="options-select"
    ></v-select>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin: 1rem 0;
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.options-select {
  margin: 0 1rem;
}
</style>
