<script setup lang="ts">
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const props = defineProps(['churnRateData'])
const churnRateData = ref(props.churnRateData)

const chartData = ref({
  labels: [''],
  datasets: [
    {
      label: '',
      data: [0],
      backgroundColor: '',
      borderColor: ''
    }
  ]
})
const chartOptions = {
  responsive: true,
  backgroundColor: '#333333',
  borderColor: '#999999',
  color: '#ffffff'
}

chartData.value = {
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
  <div class="charts"><Bar id="my-chart-id" :options="chartOptions" :data="chartData" /></div>
</template>

<style scoped></style>
