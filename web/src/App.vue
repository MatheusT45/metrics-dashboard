<script lang="ts">
import { getChurnRate, getRecurringRevenue } from "./services/metrics.service";
import ChurnChart from "./components/charts/ChurnChart.vue";
import RevenueChart from "./components/charts/RevenueChart.vue";

export default {
  data(): {
    churnRateData: any[]; // TODO: remove any
    recurringRevenueData: any[];
    fileUploaded: any;
    selectedYear: number;
    selectedPlanFilter: "All" | "Monthly" | "Yearly";
    tab: string;
    chartKeys: number;
  } {
    return {
      churnRateData: [],
      recurringRevenueData: [],
      fileUploaded: null,
      selectedYear: 0,
      selectedPlanFilter: "All",
      tab: "one",
      chartKeys: 0,
    };
  },
  methods: {
    async onUpload(e: any): Promise<void> {
      const uploadedFile = e.target.files[0];

      this.churnRateData = await getChurnRate({}, uploadedFile);
      this.recurringRevenueData = await getRecurringRevenue({}, uploadedFile);
      this.fileUploaded = uploadedFile;
    },
    async useTestFile() {
      this.churnRateData = await getChurnRate({});
      this.recurringRevenueData = await getRecurringRevenue({});
      this.fileUploaded = {};
    },
  },
  watch: {
    async selectedYear(year) {
      const churnResponse = await getChurnRate(
        {
          year,
          filterSubscriptionPlan: this.selectedPlanFilter,
        },
        this.fileUploaded
      );

      const revenueResponse = await getRecurringRevenue(
        {
          year,
          filterSubscriptionPlan: this.selectedPlanFilter,
        },
        this.fileUploaded
      );

      this.churnRateData = churnResponse;
      this.recurringRevenueData = revenueResponse;
      this.chartKeys += 1;
    },

    async selectedPlanFilter(filterSubscriptionPlan) {
      const churnResponse = await getChurnRate(
        {
          year: this.selectedYear,
          filterSubscriptionPlan,
        },
        this.fileUploaded
      );

      const revenueResponse = await getRecurringRevenue(
        {
          year: this.selectedYear,
          filterSubscriptionPlan,
        },
        this.fileUploaded
      );

      this.churnRateData = churnResponse;
      this.recurringRevenueData = revenueResponse;
      this.chartKeys += 1;
    },
  },
};
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
