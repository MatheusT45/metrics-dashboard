<script setup lang="ts">
import { computed } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";

const selectedYear = defineModel<number>("selectedYear");
const selectedPlanFilter = defineModel<"All" | "Monthly" | "Yearly">(
  "selectedPlanFilter"
);

const props = defineProps(["availableYears"]);
const availableYears = ref(props.availableYears);

const filteredYears = ref<{ text: string; value: number }[]>([
  { text: "All", value: 0 },
]);

availableYears.value.forEach((year: { text: string; value: number }) => {
  if (filteredYears.value.find((y) => y.value === year.value)) {
    return;
  }
  filteredYears.value.push(year);
});

const firstYear = computed(() => filteredYears.value[1].value);

onMounted(() => {
  selectedYear.value = firstYear.value;
});
</script>

<template>
  <h2>Options</h2>
  <div class="options">
    <v-select
      v-model="selectedYear"
      label="Year"
      :items="filteredYears"
      item-title="text"
      item-value="value"
      variant="outlined"
      class="options-select"
      ref="year-select"
    ></v-select>
    <v-select
      v-model="selectedPlanFilter"
      label="Subscription Plan"
      :items="['All', 'Monthly', 'Yearly']"
      variant="outlined"
      class="options-select"
      ref="plan-select"
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
