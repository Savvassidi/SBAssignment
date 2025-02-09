<template>
  <div class="chart-container">
    <div v-if="filteredChartData.labels.length > 0">
      <Line :chart-data="filteredChartData" :chart-options="chartOptions" />
      <!-- Render the custom legend below the chart cause of preference -->
      <CustomLegend :legend-values="customLegendValues" />
    </div>
    <div v-else class="chart-fallback">
      <p>No data available. Please select a valid date range and ensure some rows are checked.</p>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, defineAsyncComponent } from "vue";
import { Line } from "vue-chartjs";
const CustomLegend = defineAsyncComponent(() => import("@/components/CustomLegend.vue"));

// Chart.js modules
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

export default defineComponent({
  name: "LineChart",
  components: { Line, CustomLegend },
  props: {
    dateRange: Array,
    selectedSeries: Array,
    timeseriesData: Array,
  },
  setup(props) {
    /**
     * Compute the filtered chart data based on the date range and selected series.
     * @returns {Object} The filtered chart data.
     */
    const filteredChartData = computed(() => {
      if (!props.dateRange || props.dateRange.length !== 2) {
        return { labels: [], datasets: [] };
      }

      // Filter data by date range and custom include flag
      const filteredData = props.timeseriesData.filter((entry) => {
        const entryDate = entry.DateTime.split("T")[0];
        return entry.includeInChart &&
               entryDate >= props.dateRange[0] &&
               entryDate <= props.dateRange[1];
      });

      return {
        labels: filteredData.map((entry) =>
          new Date(entry.DateTime).toLocaleString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          })
        ),
        datasets: [
          props.selectedSeries.includes(0) && {
            label: 'ENTSOE DE DAM Price',
            data: filteredData.map((entry) => parseFloat(entry.ENTSOE_DE_DAM_Price)),
            borderColor: '#00bcd4',
            fill: true,
            tension: 0.4,
            pointStyle: 'circle',
            pointRadius: 3,
            pointHoverRadius: 7,
          },
          props.selectedSeries.includes(1) && {
            label: 'ENTSOE GR DAM Price',
            data: filteredData.map((entry) => parseFloat(entry.ENTSOE_GR_DAM_Price)),
            borderColor: '#ff9800',
            fill: true,
            tension: 0.4,
            pointStyle: 'circle',
            pointRadius: 3,
            pointHoverRadius: 7,
          },
          props.selectedSeries.includes(2) && {
            label: 'ENTSOE FR DAM Price',
            data: filteredData.map((entry) => parseFloat(entry.ENTSOE_FR_DAM_Price)),
            borderColor: '#ff4081',
            fill: true,
            tension: 0.4,
            pointStyle: 'circle',
            pointRadius: 3,
            pointHoverRadius: 7,
          },
        ].filter(Boolean),
      };
    });

    /**
     * Compute the chart options.
     * @returns {Object} The chart options.
     */
    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: "#1f1f1f", // Darker tooltip background
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          bodyColor: "#e0e0e0",
          borderColor: "#444",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date and Time',
            font: { size: 14 },
          },
          ticks: {
            color: "#b0b0b0",
          },
          grid: {
            color: "#333",
            borderDash: [5, 5],
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (€)',
            font: { size: 14 },
          },
          ticks: {
            color: "#b0b0b0",
          },
          grid: {
            color: "#333",
            borderDash: [5, 5],
          },
        },
      },
    }));

    /**
     * Compute custom legend values from the datasets.
     * @returns {Array} The custom legend values.
     */
    const customLegendValues = computed(() => {
      return filteredChartData.value.datasets.map(ds => ({
        label: ds.label,
        color: ds.borderColor
      }));
    });

    return {
      filteredChartData,
      chartOptions,
      customLegendValues,
    };
  },
});
</script>

<style scoped>
.chart-container {
  height: auto;
  background: rgba(32, 32, 32, 0.05); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 22px;
  transition: transform 0.3s ease-in-out;
}

.chart-container:hover {
  transform: translateY(-5px);
}
.chart-fallback {
  text-align: center;
  font-style: italic;
  margin-top: 1rem;
}
</style>