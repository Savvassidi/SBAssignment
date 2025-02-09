<template>
  <div class="container mt-5">

    <!-- Responsive Dark Mode Toggle -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
      <h1 class="main-header mb-3 mb-md-0">📊 Timeseries Data Analysis</h1>
      <div class="mb-3">
        <DarkModeToggle />
      </div>
    </div>
    
    <!-- Date Picker Section -->
    <div class="card p-3 shadow-sm mb-4">
      <DatePicker v-model="dateRange" :timeseriesData="timeseriesData" />
    </div>

    <!-- Checkbox Controls for Series Filtering -->
    <Filters 
      :selectedSeries="selectedSeries" 
      @update:selectedSeries="selectedSeries = $event" 
      :seriesOptions="seriesOptions" 
    />

    <div class="row">
      <!-- Data Table Section -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card p-3 shadow-sm">
          <h4 class="text-center mb-3">📅 Price Data Table</h4>
          <DataTable 
            :dateRange="dateRange" 
            :selectedSeries="selectedSeries"
            v-model:timeseriesData="timeseriesData"
            :headers="tableHeaders"  
            :fields="tableFields"    
          />
        </div>
      </div>

      <!-- Chart Section -->
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card p-3 shadow-sm">
          <h4 class="text-center mb-3">📈 Market Price Trends</h4>
          <LineChart 
            :dateRange="dateRange" 
            :selectedSeries="selectedSeries" 
            :timeseriesData="timeseriesData" 
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { defineAsyncComponent } from "vue";

// in general, the Home.vue component is the parent component that holds the state and passes it down to its children components
const DataTable = defineAsyncComponent(() => import("@/components/DataTable.vue"));
const LineChart = defineAsyncComponent(() => import("@/components/LineChart.vue"));
const DatePicker = defineAsyncComponent(() => import("@/components/DatePicker.vue"));
const Filters = defineAsyncComponent(() => import("@/components/Filters.vue"));
const DarkModeToggle = defineAsyncComponent(() => import("@/components/DarkModeToggle.vue"));
import timeseriesData from "@/assets/timeseries.json";

export default {
  components: {
    DataTable,
    LineChart,
    DatePicker,
    Filters,
    DarkModeToggle,
  },
  data() {
    return {
      dateRange: [
        timeseriesData[0]?.DateTime.split("T")[0] || "",
        timeseriesData[timeseriesData.length - 1]?.DateTime.split("T")[0] || "",
      ],
      timeseriesData: JSON.parse(JSON.stringify(timeseriesData)), // Clone original data
      selectedSeries: [0, 1, 2],
      seriesOptions: [
        { label: "ENTSOE DE DAM" },
        { label: "ENTSOE GR DAM" },
        { label: "ENTSOE FR DAM" },
      ],
      tableHeaders: ["Date&Time", "DE DAM", "GR DAM", "FR DAM"],
      tableFields: ["DateTime", "ENTSOE_DE_DAM_Price", "ENTSOE_GR_DAM_Price", "ENTSOE_FR_DAM_Price"],
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: calc(1rem + 1.1vw);
}

.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
    padding: 22px;
    transition: transform 0.3s ease-in-out;
}

.shadow-sm {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
