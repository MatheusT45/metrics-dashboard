<script setup lang="ts">
const tab = defineModel<string>("one");
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="deep-purple-accent-4" align-tabs="center">
      <v-tab value="one">Churn Rate</v-tab>
      <v-tab value="two">Recurring Revenue</v-tab>
      <v-tab value="three">Lifetime Value</v-tab>
    </v-tabs>
    <v-card-text class="chart-card">
      <v-window v-model="tab">
        <v-window-item value="one">
          <slot name="churn-chart"></slot>
        </v-window-item>
        <v-window-item value="two">
          <slot name="revenue-chart"></slot>
        </v-window-item>
        <v-window-item value="three">
          <slot name="lifetime-chart"></slot>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-card {
  background-color: #424242;
}
</style>
