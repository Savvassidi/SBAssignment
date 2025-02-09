<template>
  <tr>
    <!-- New column: Checkbox to include/exclude row from chart -->
    <td>
      <input type="checkbox" v-model="rowData.includeInChart" />
    </td>
    
    <!-- Existing columns for each field -->
    <td v-for="(field, index) in fields" :key="index">
      <!-- If the field is DateTime, format it -->
      <span v-if="field === 'DateTime'">{{ formatDate(rowData[field]) }}</span>
      <!-- Otherwise, allow editing -->
      <input
        v-else
        v-model="rowData[field]"
        @input="validateInput(rowData, field)"
      />
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    rowData: Object,  
    fields: Array,    
    validateInput: Function,
    formatDate: Function,
  },
};
</script>

<style scoped>
input[type="checkbox"] {
  transform: scale(1.3);
}
input[type="text"],
input:not([type="checkbox"]) {
  width: calc(3rem + 2vw);
  border: 1px solid #ccc;
  padding: 4px;
  text-align: center;
  border-radius: 8px;
}
input:focus {
  background: rgba(66, 165, 245, 0.1);
  outline: none;
  border-color: #42a5f5;
}
input:hover {
  background: rgba(66, 164, 245, 0.2);
  outline: none;
  border-color: #42a4f544;
}
[data-bs-theme="dark"] input:hover,
[data-bs-theme="dark"] input:focus {
  color: white; 
  background-color: #333; 
  outline: none; 
  border: 1px solid #555; 
}
td {
  text-align: center;
  vertical-align: middle !important;
}
</style>
