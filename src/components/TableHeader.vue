<template>
  <tr>
    <!-- New header cell for the checkbox column -->
    <th>Include</th>
    <th v-for="(header, index) in headers" :key="index">
      {{ header }}
    </th>
  </tr>
</template>

<script>
export default {
  props: {
    headers: Array,
  },
};
</script>

<style scoped>
th  {
  text-align: center;
  vertical-align: middle !important;
}
</style>