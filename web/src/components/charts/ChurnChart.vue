<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./common/BarChart.vue";
import { ChurnRate } from "@/models/metrics.model";

const props = defineProps(["churnRateData"]);
const churnRateData = ref(props.churnRateData);

const churnData = {
  labels: churnRateData.value.map((item: ChurnRate) => item.relatesTo),
  datasets: [
    {
      label: "Churn Rate %",
      data: churnRateData.value.map((item: ChurnRate) => item.churnRate),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgb(255, 99, 132)",
    },
  ],
};

const chartData = {
  labels: churnRateData.value.map((item: ChurnRate) => item.relatesTo),
  datasets: [
    {
      label: "Lost Subscriptions",
      data: churnRateData.value.map(
        (item: ChurnRate) => item.lostSubscriptions
      ),
      backgroundColor: "rgba(255, 159, 64, 0.6)",
      borderColor: "rgb(255, 159, 64)",
    },
    {
      label: "New Subscriptions",
      data: churnRateData.value.map((item: ChurnRate) => item.newSubscriptions),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgb(75, 192, 192)",
    },
    {
      label: "Subscriptions",
      data: churnRateData.value.map((item: ChurnRate) => item.subscriptions),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgb(54, 162, 235)",
    },
  ],
};
</script>

<template>
  <h1>Churn Rate Chart</h1>
  <BarChart :data="churnData" />
  <h1>Subscriptions Chart</h1>
  <BarChart :data="chartData" />
</template>
<style scoped>
h1 {
  text-align: center;
  margin: 1rem 0;
  color: white;
}
</style>
