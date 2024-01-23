<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./common/BarChart.vue";
import { LifetimeValue } from "@/models/metrics.model";

const props = defineProps(["lifetimeValueData"]);
const lifetimeValueData = ref(props.lifetimeValueData);

const chartData = {
  labels: lifetimeValueData.value.map((item: LifetimeValue) => item.relatesTo),
  datasets: [
    {
      label: "Lifetime Value R$",
      data: lifetimeValueData.value.map(
        (item: LifetimeValue) => item.lifetimeValue
      ),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgb(54, 162, 235)",
    },
    {
      label: "Average ticket value R$",
      data: lifetimeValueData.value.map(
        (item: LifetimeValue) => item.averageTicketValue
      ),
      backgroundColor: "rgba(255, 159, 64, 0.6)",
      borderColor: "rgb(255, 159, 64)",
    },
  ],
};
const retentionData = {
  labels: lifetimeValueData.value.map((item: LifetimeValue) => item.relatesTo),
  datasets: [
    {
      label: "Retention time in months",
      data: lifetimeValueData.value.map(
        (item: LifetimeValue) => item.averageRetentionTime
      ),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgb(75, 192, 192)",
    },
  ],
};
</script>

<template>
  <BarChart :data="chartData" />
  <BarChart :data="retentionData" />
</template>
