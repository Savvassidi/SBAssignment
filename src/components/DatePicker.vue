<template>
  <div class="picker-container d-flex flex-column align-items-center">
    <label class="fw-bold mb-2 fs-6">📅 Select Date Range</label>
    <el-date-picker
      v-model="dateRangeLocal"
      type="daterange"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :disabled-date="pickerOptions.disabledDate"
      start-placeholder="Start Date"
      end-placeholder="End Date"
      :clearable="false"
      class="w-100"
      popper-class="custom-date-picker-popper"
      @change="updateDateRange"
    />
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { ElDatePicker } from "element-plus";
import "element-plus/dist/index.css";

export default {
  name: "DatePicker",
  components: { ElDatePicker },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    timeseriesData: {
      type: Array,
      required: true
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const dateRangeLocal = ref(props.modelValue);

    /**
     * Format a date to a local date string (YYYY-MM-DD).
     * @param {Date} time - The date to format.
     * @returns {string} - The formatted date string.
     */
    const formatLocalDate = (time) =>
      new Date(time).toISOString().split("T")[0];

    /**
     * Compute day labels from the timeseriesData prop.
     * @returns {Array<string>} - The sorted unique day labels.
     */
    const dayLabels = computed(() => {
      return Array.from(
        new Set(props.timeseriesData.map((entry) => formatLocalDate(entry.DateTime)))
      ).sort();
    });

    /**
     * Compute the picker options for the date picker.
     * @returns {Object} - The picker options.
     */
    const pickerOptions = computed(() => ({
      disabledDate(date) {
        return !dayLabels.value.includes(formatLocalDate(date));
      },
    }));

    /**
     * Update the date range and emit the update event.
     */
    const updateDateRange = () => {
      emit("update:modelValue", dateRangeLocal.value);
    };

    // Watch for changes in the modelValue prop and update the local state accordingly
    watch(
      () => props.modelValue,
      (newVal) => {
        dateRangeLocal.value = newVal;
      }
    );

    return {
      dateRangeLocal,
      pickerOptions,
      updateDateRange,
    };
  },
};
</script>

<style scoped>
.picker-container {
  width: 100%;
}
</style>