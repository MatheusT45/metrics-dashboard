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

const props = defineProps(['recurringRevenueData'])
const recurringRevenueData = ref(props.recurringRevenueData)

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
  labels: recurringRevenueData.value.map((item: any) => item.relatesTo),
  datasets: [
    {
      label: 'Recurring Revenue',
      data: recurringRevenueData.value.map((item: any) => item.monthlyRevenue),
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
      borderColor: 'rgb(75, 192, 192)'
    }
  ]
}
</script>

<template>
  <div class="charts"><Bar id="my-chart-id" :options="chartOptions" :data="chartData" /></div>
</template>

<style scoped></style>
