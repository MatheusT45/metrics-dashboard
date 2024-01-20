<script setup lang="ts">
import { ref } from 'vue'
import BarChart from '../charts/BarChart.vue'

const props = defineProps(['churnRateData'])
const churnRateData = ref(props.churnRateData)

const chartData = {
  labels: churnRateData.value.map((item: any) => item.relatesTo),
  datasets: [
    {
      label: 'Churn Rate',
      data: churnRateData.value.map((item: any) => item.churnRate),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgb(255, 99, 132)'
    },
    {
      label: 'Subscriptions',
      data: churnRateData.value.map((item: any) => item.subscriptions),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)'
    },
    {
      label: 'Lost Subscriptions',
      data: churnRateData.value.map((item: any) => item.lostSubscriptions),
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgb(255, 159, 64)'
    },
    {
      label: 'New Subscriptions',
      data: churnRateData.value.map((item: any) => item.newSubscriptions),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgb(75, 192, 192)'
    }
  ]
}
</script>

<template>
  <BarChart :data="chartData" />
</template>

<style scoped></style>
