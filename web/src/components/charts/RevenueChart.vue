<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./common/BarChart.vue";

const props = defineProps(["recurringRevenueData"]);
const recurringRevenueData = ref(props.recurringRevenueData);

const chartData = {
  labels: recurringRevenueData.value.map((item: any) => item.relatesTo),
  datasets: [
    {
      label: "Recurring Revenue R$",
      data: recurringRevenueData.value.map((item: any) => item.monthlyRevenue),
      backgroundColor: "rgba(75, 192, 192, 0.8)",
      borderColor: "rgb(75, 192, 192)",
    },
  ],
};
</script>

<template>
  <BarChart :data="chartData" />
</template>

<style scoped></style>
