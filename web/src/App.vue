<script setup lang="ts">
import { ref, watch } from "vue";
import { getChurnRate, getRecurringRevenue } from "./services/metrics.service";
import ChurnChart from "./components/charts/ChurnChart.vue";
import RevenueChart from "./components/charts/RevenueChart.vue";

const churnRateData = ref([]);
const recurringRevenueData = ref([]);
const fileUploaded = ref<any>(null);
const selectedYear = ref<number>(0);
const selectedPlanFilter = ref<"All" | "Monthly" | "Yearly">("All");

const chartKeys = ref(0);

const onUpload = async (e: any): Promise<void> => {
  const uploadedFile = e.target.files[0];

  churnRateData.value = await getChurnRate(uploadedFile, {});
  recurringRevenueData.value = await getRecurringRevenue(uploadedFile, {});
  fileUploaded.value = uploadedFile;
};

watch(selectedYear, async (year) => {
  const churnResponse = await getChurnRate(fileUploaded.value, {
    year,
    filterSubscriptionPlan: selectedPlanFilter.value,
  });
  const revenueResponse = await getRecurringRevenue(fileUploaded.value, {
    year,
    filterSubscriptionPlan: selectedPlanFilter.value,
  });

  churnRateData.value = churnResponse;
  recurringRevenueData.value = revenueResponse;
  chartKeys.value += 1;
});

watch(selectedPlanFilter, async (filterSubscriptionPlan) => {
  const churnResponse = await getChurnRate(fileUploaded.value, {
    year: selectedYear.value,
    filterSubscriptionPlan,
  });
  const revenueResponse = await getRecurringRevenue(fileUploaded.value, {
    year: selectedYear.value,
    filterSubscriptionPlan,
  });

  churnRateData.value = churnResponse;
  recurringRevenueData.value = revenueResponse;
  chartKeys.value += 1;
});
</script>

<template>
  <v-app class="bg-grey-darken-4">
    <v-main>
      <v-toolbar
        title="Metrics Dashboard"
        class="bg-purple-darken-4"
      ></v-toolbar>
      <h1 v-if="!fileUploaded">Welcome!</h1>
      <h3 v-if="!fileUploaded">Please, upload a CSV or XLSX file</h3>
      <h3 v-if="!fileUploaded">using the button below</h3>
      <Upload v-if="!fileUploaded" @onUpload="onUpload" />
      <v-container v-if="!!fileUploaded" class="chart-container">
        <h1>Graphs</h1>
        <v-card variant="outlined" class="options-card">
          <h2>Options</h2>
          <div class="options">
            <v-select
              v-model="selectedYear"
              label="Year"
              :items="[
                { text: 'All', value: 0 },
                { text: '2022', value: 2022 },
                { text: '2023', value: 2023 },
                { text: '2024', value: 2024 },
              ]"
              item-title="text"
              item-value="value"
              variant="outlined"
              class="options-select"
            ></v-select>
            <v-select
              v-model="selectedPlanFilter"
              label="Subscription Plan"
              :items="['All', 'Monthly', 'Yearly']"
              variant="outlined"
              class="options-select"
            ></v-select>
          </div>
        </v-card>
        <div class="charts">
          <v-card variant="tonal" class="chart-card">
            <h2>Churn Rate</h2>
            <ChurnChart :churnRateData="churnRateData" :key="chartKeys" />
          </v-card>
          <v-card variant="tonal" class="chart-card">
            <h2>Recurring Revenue</h2>
            <RevenueChart
              :recurringRevenueData="recurringRevenueData"
              :key="chartKeys"
            />
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  margin: 2rem 0;
  text-align: center;
}

.options {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.options-card {
  text-align: center;
  width: 40%;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.options-select {
  margin: 0 1rem;
}

.charts {
  width: 100%;
  margin-top: 80px;
}

.chart-card {
  margin-bottom: 80px;
}

h2 {
  text-align: center;
  margin: 1rem 0;
}
</style>
