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
const tab = ref<string>("one");

const chartKeys = ref(0);

const onUpload = async (e: any): Promise<void> => {
  const uploadedFile = e.target.files[0];

  churnRateData.value = await getChurnRate({}, uploadedFile);
  recurringRevenueData.value = await getRecurringRevenue({}, uploadedFile);
  fileUploaded.value = uploadedFile;
};

const useTestFile = async () => {
  churnRateData.value = await getChurnRate({});
  recurringRevenueData.value = await getRecurringRevenue({});
  fileUploaded.value = {};
};

watch(selectedYear, async (year) => {
  const churnResponse = await getChurnRate(
    {
      year,
      filterSubscriptionPlan: selectedPlanFilter.value,
    },
    fileUploaded.value
  );
  const revenueResponse = await getRecurringRevenue(
    {
      year,
      filterSubscriptionPlan: selectedPlanFilter.value,
    },
    fileUploaded.value
  );

  churnRateData.value = churnResponse;
  recurringRevenueData.value = revenueResponse;
  chartKeys.value += 1;
});

watch(selectedPlanFilter, async (filterSubscriptionPlan) => {
  const churnResponse = await getChurnRate(
    {
      year: selectedYear.value,
      filterSubscriptionPlan,
    },
    fileUploaded.value
  );
  const revenueResponse = await getRecurringRevenue(
    {
      year: selectedYear.value,
      filterSubscriptionPlan,
    },
    fileUploaded.value
  );

  churnRateData.value = churnResponse;
  recurringRevenueData.value = revenueResponse;
  chartKeys.value += 1;
});
</script>

<template>
  <v-app class="bg-grey-darken-4">
    <v-main>
      <v-toolbar title="📈 Metrics Dashboard" class="bg-purple-darken-4" />
      <v-container v-if="!fileUploaded">
        <welcome-message />
        <upload-button @onUpload="onUpload" @onTestFileClick="useTestFile" />
      </v-container>
      <v-container v-else class="chart-container">
        <h1>Graphs</h1>
        <v-card variant="outlined" class="options-card">
          <chart-options
            v-model:selectedYear="selectedYear"
            v-model:selectedPlanFilter="selectedPlanFilter"
          />
        </v-card>
        <div class="charts">
          <chart-tabs v-model:tab="tab">
            <template v-slot:churn-chart>
              <ChurnChart :churnRateData="churnRateData" :key="chartKeys" />
            </template>
            <template v-slot:revenue-chart>
              <RevenueChart
                :recurringRevenueData="recurringRevenueData"
                :key="chartKeys"
              />
            </template>
          </chart-tabs>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
h1 {
  margin: 2rem 0;
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

.charts {
  width: 100%;
  margin-top: 80px;
}
</style>
