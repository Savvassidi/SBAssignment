<template>
  <div class="card p-3 shadow-sm mb-4">
    <h5 class="fw-bold text-center fs-6">📌 Select Data Series</h5>
    <div class="d-flex justify-content-center gap-3">
      <div v-for="(series, index) in seriesOptions" :key="index" class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          :id="'series-' + index"
          v-model="selectedSeriesLocal"
          :value="index"
        />
        <label class="form-check-label" :for="'series-' + index">
          {{ series.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    selectedSeries: Array, 
    seriesOptions: Array,
  },
  emits: ["update:selectedSeries"],
  setup(props, { emit }) {
    // Local state initialized from prop, cause v-model doesn't work with external props
    const selectedSeriesLocal = ref([...props.selectedSeries]);

    // Watch for changes in the prop and update the local state accordingly
    watch(
      () => props.selectedSeries,
      (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(selectedSeriesLocal.value)) {
          selectedSeriesLocal.value = [...newVal];
        }
      },
      { deep: true }
    );
    
    // Watch for local changes and emit only if different
    watch(
      selectedSeriesLocal,
      (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(props.selectedSeries)) {
          emit("update:selectedSeries", newVal);
        }
      },
      { deep: true }
    );

    return {
      selectedSeriesLocal,
    };
  },
};
</script>

<style scoped>
/* Style for the checkbox input */
input[type="checkbox"] {
  transform: scale(1.5);
}

/* Style for the labels */
label {
  font-size: calc(0.3rem + 0.8vw);
}
</style>