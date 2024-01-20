<script setup lang="ts">
import { ref } from 'vue'
import UploadCard from '../components/UploadCard.vue'
import { getChurnRate, getRecurringRevenue } from '../services/metrics.service'
import ChurnChart from '../components/charts/ChurnChart.vue'
import RevenueChart from '../components/charts/RevenueChart.vue'

const churnRateData = ref([])
const recurringRevenueData = ref([])
const hasUploadedFile = ref(false)

const onUpload = async (e: any): Promise<void> => {
  const uploadedFile = e.target.files[0]

  if (
    uploadedFile.type !== 'text/csv' &&
    uploadedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    alert('Only sheets and csv files are allowed')
    return
  }

  if (uploadedFile.size > 10000000) {
    alert('File size must be less than 10MB')
    return
  }

  churnRateData.value = await getChurnRate(uploadedFile, {})
  recurringRevenueData.value = await getRecurringRevenue(uploadedFile, {})
  hasUploadedFile.value = true
}
</script>

<template>
  <main>
    <UploadCard v-if="!hasUploadedFile" @onUpload="onUpload" class="upload-card" />
    <h1 v-if="hasUploadedFile">Graphs</h1>
    <div v-if="hasUploadedFile">
      <h2>Churn Rate</h2>
      <ChurnChart :churnRateData="churnRateData" />
      <h2>Recurring Revenue</h2>
      <RevenueChart :recurringRevenueData="recurringRevenueData" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  margin-bottom: 2rem;
}

.upload-card {
  margin-bottom: 4rem;
}

h2 {
  text-align: center;
  margin: 1rem 0;
}

.charts {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 400px;
  animation: fadeIn 5s;
}
</style>
