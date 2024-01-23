<script setup lang="ts">
import { ref } from "vue";
import BarChart from "./common/BarChart.vue";
import { LifetimeValue } from "@/models/metrics.model";

const props = defineProps(["lifetimeValueData"]);
const lifetimeValueData = ref(props.lifetimeValueData);

const retentionData = {
  labels: lifetimeValueData.value.data.map(
    (item: LifetimeValue) => item.relatesTo
  ),
  datasets: [
    {
      label: "Average ticket value R$",
      data: lifetimeValueData.value.data.map(
        (item: LifetimeValue) => item.averageTicketValue
      ),
      backgroundColor: "rgba(255, 159, 64, 0.6)",
      borderColor: "rgb(255, 159, 64)",
    },
  ],
};
</script>

<template>
  <h1>Lifetime Value Chart</h1>
  <h2>Lifetime Value: R$ {{ lifetimeValueData.total.lifetimeValue }}</h2>
  <h3>
    Average Retention Time:
    {{ lifetimeValueData.total.averageRetentionTime }} months
  </h3>
  <BarChart :data="retentionData" />
</template>
<style scoped>
h2,
h3 {
  margin: 1rem 0;
  color: white;
}
h1 {
  text-align: center;
  margin: 1rem 0;
  color: white;
}
</style>
