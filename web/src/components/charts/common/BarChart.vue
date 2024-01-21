<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps(["data"]);

const chartOptions = {
  responsive: true,
  backgroundColor: "#333333",
  borderColor: "#999999",
  color: "#ffffff",
};
</script>

<template>
  <v-container class="charts"
    ><Bar :options="chartOptions" :data="props.data"
  /></v-container>
</template>

<style scoped></style>
