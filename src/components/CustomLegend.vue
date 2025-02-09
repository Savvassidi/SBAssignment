<template>
  <div class="legend-container">
    <span
      v-for="(legendValue, index) in legendValues"
      :key="`legend-badge-${index}`"
    >
      <span
        :style="{ 'background-color': legendValue.color }"
        class="badge"
      ></span>
      <span>{{ legendValue.label }}</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    legendValues: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.legend-container {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
  justify-content: center;
}
.badge {
  border-radius: 10rem;
  padding: 0;
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right:   3px;
}
.badge:empty {
  display: inline-block !important;
}
</style>