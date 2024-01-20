<script setup lang="ts">
import { ref, watch } from 'vue'
import UploadCard from '../components/UploadCard.vue'
import { getChurnRate, getRecurringRevenue } from '../services/metrics.service'
import ChurnChart from '../components/charts/ChurnChart.vue'
import RevenueChart from '../components/charts/RevenueChart.vue'

const churnRateData = ref([])
const recurringRevenueData = ref([])
const fileUploaded = ref<any>(null)
const selectedYear = ref<number>(0)
const selectedPlanFilter = ref<'All' | 'Monthly' | 'Yearly'>('All')

const chartKeys = ref(0)

const onUpload = async (e: any): Promise<void> => {
  const uploadedFile = e.target.files[0]

  churnRateData.value = await getChurnRate(uploadedFile, {})
  recurringRevenueData.value = await getRecurringRevenue(uploadedFile, {})
  fileUploaded.value = uploadedFile
}

watch(selectedYear, async (year) => {
  const churnResponse = await getChurnRate(fileUploaded.value, {
    year,
    filterSubscriptionPlan: selectedPlanFilter.value
  })
  const revenueResponse = await getRecurringRevenue(fileUploaded.value, {
    year,
    filterSubscriptionPlan: selectedPlanFilter.value
  })

  churnRateData.value = churnResponse
  recurringRevenueData.value = revenueResponse
  chartKeys.value += 1
})

watch(selectedPlanFilter, async (filterSubscriptionPlan) => {
  const churnResponse = await getChurnRate(fileUploaded.value, {
    year: selectedYear.value,
    filterSubscriptionPlan
  })
  const revenueResponse = await getRecurringRevenue(fileUploaded.value, {
    year: selectedYear.value,
    filterSubscriptionPlan
  })

  churnRateData.value = churnResponse
  recurringRevenueData.value = revenueResponse
  chartKeys.value += 1
})
</script>

<template>
  <main>
    <UploadCard v-if="!fileUploaded" @onUpload="onUpload" class="upload-card" />
    <div v-if="!!fileUploaded">
      <h1>Graphs</h1>
      <div>
        <h2>Options</h2>
        <div class="options">
          <label class="options-select">
            Year
            <select v-model="selectedYear">
              <option selected :value="0">All</option>
              <option :value="2022">2022</option>
              <option :value="2023">2023</option>
              <option :value="2024">2024</option>
            </select>
          </label>
          <label class="options-select">
            Plan
            <select v-model="selectedPlanFilter">
              <option selected value="All">All</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </label>
        </div>
      </div>
      <div>
        <h2>Churn Rate</h2>
        <ChurnChart :churnRateData="churnRateData" :key="chartKeys" />
        <h2>Recurring Revenue</h2>
        <RevenueChart :recurringRevenueData="recurringRevenueData" :key="chartKeys" />
      </div>
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
  text-align: center;
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
