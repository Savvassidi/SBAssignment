<template>
  <div class="container table-container mt-3">
    
    <div class="text-center mb-3 d-flex justify-content-center gap-3">
       <!-- Toggle Table shown -->
      <button class="btn btn-secondary" @click="toggleTable">
        {{ showTable ? "Hide Table" : "Show Table" }}
      </button>
      
      <!-- Export CSV Button -->
      <button class="btn btn-secondary" @click="exportToCSV">
        📥 Export CSV
      </button>

      <!-- Save changes button -->
      <button v-if="hasChanges" class="btn btn-success" @click="saveChanges">
          💾 Save Changes
      </button>
    </div>

     <!-- Collapsible Table -->
      <div v-show="showTable" class="table-wrapper">
        <table class="table table-striped ">
      <thead>
        <TableHeader :headers="filteredHeaders" />
      </thead>
      <tbody>
        <TableRow
          v-for="(data, index) in filteredData"
          :key="index"
          :rowData="data"
          :fields="filteredFields"  
          :validateInput="validateInput"
          :formatDate="formatDate"
        />
      </tbody>
    </table>

    </div>

    <!-- Custom Modal -->
    <AlertModal ref="modalRef" />
  </div>
</template>

<script>
import { computed, ref, watch, defineAsyncComponent } from "vue";

// Lazy-load components
const AlertModal = defineAsyncComponent(() => import("@/components/AlertModal.vue"));
const TableRow = defineAsyncComponent(() => import("@/components/TableRow.vue"));
const TableHeader = defineAsyncComponent(() => import("@/components/TableHeader.vue"));

export default {
  components: {
    AlertModal,
    TableRow,
    TableHeader,
  },
  props: {
    dateRange: Array,
    selectedSeries: Array,
    timeseriesData: Array,
    headers: Array,  
    fields: Array,   
  },
  setup(props, { emit }) {
    const modalRef = ref(null); 
    const showTable = ref(true); 

    /**
     * Format date to a readable string
     * @param {string} dateTime - The date and time string to format
     * @returns {string} - The formatted date string
     */
    const formatDate = (dateTime) => new Date(dateTime).toLocaleString();

    /**
     * Check if there are any changes in the timeseries data
     * @returns {boolean} - True if there are changes, false otherwise
     */
    const hasChanges = computed(() => {
      return props.timeseriesData.some((item) => {
        const original = originalValues.value[item.DateTime];
        if (!original) return false; // No original value stored, no changes therefore false(hiding the button)
        return (
          item.ENTSOE_DE_DAM_Price !== original.ENTSOE_DE_DAM_Price ||
          item.ENTSOE_GR_DAM_Price !== original.ENTSOE_GR_DAM_Price ||
          item.ENTSOE_FR_DAM_Price !== original.ENTSOE_FR_DAM_Price
        );
      });
    });
    
    /**
     * Compute the filtered data based on the date range
     * @returns {Array} - The filtered timeseries data
     */
    const filteredData = computed(() => {
      if (!props.dateRange || props.dateRange.length !== 2) {
        return { labels: [], datasets: [] };
      }

      return props.timeseriesData.filter((entry) => {
        const entryDate = entry.DateTime.split("T")[0];
        return entryDate >= props.dateRange[0] && entryDate <= props.dateRange[1];
      });
    });

    /**
     * Compute the fields to show in the table
     * @returns {Array} - The filtered fields
     */
    const filteredFields = computed(() => {
      const result = [props.fields[0]]; 
      if (props.selectedSeries.includes(0)) result.push(props.fields[1]);
      if (props.selectedSeries.includes(1)) result.push(props.fields[2]);
      if (props.selectedSeries.includes(2)) result.push(props.fields[3]);
      return result;
    });

    /**
     * Compute the headers to show in the table
     * @returns {Array} - The filtered headers
     */
    const filteredHeaders = computed(() => {
      const result = [props.headers[0]]; 
      if (props.selectedSeries.includes(0)) result.push(props.headers[1]);
      if (props.selectedSeries.includes(1)) result.push(props.headers[2]);
      if (props.selectedSeries.includes(2)) result.push(props.headers[3]);
      return result;
    });

    /**
     * Export the timeseries data to a CSV file :)
     */
    const exportToCSV = () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += props.headers.join(",") + "\n";
      
      props.timeseriesData.forEach(row => {
        const rowData = props.fields.map(field => row[field] || "").join(",");
        csvContent += rowData + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "timeseries_data.csv");
      document.body.appendChild(link);
      link.click();
    };

    const originalValues = ref({});
    // Store original values for restoring invalid input AND mechanism to show/hide the button save changes
    watch(
      () => props.timeseriesData,
      (newData) => {
        newData.forEach((item) => {
          // Store a snapshot of the original values if not already stored
          if (!originalValues.value[item.DateTime]) {
            originalValues.value[item.DateTime] = { ...item };
          }
          // initialising checkboxes for each row of table, setting to true(show) by default
          if (item.includeInChart === undefined) {
            item.includeInChart = true;
          }
        });
      },
      { deep: true, immediate: true }
    );

    /**
     * Validate input and restore original value if invalid
     * @param {Object} row - The row data
     * @param {string} field - The field to validate
     */
    const validateInput = (row, field) => {
      const value = row[field];
      const originalValue = originalValues.value[row.DateTime]?.[field];

      if (!/^[-]?\d+(\.\d+)?$/.test(value) || value < -2000 || value > 2000) {
        if (modalRef.value) {
          modalRef.value.showModal("Invalid Input ⚠️", "Please enter a numeric value between -2000 and 2000.");
        } else {
          console.error("modalRef is not properly initialized", modalRef.value);
        }

        row[field] = originalValue;
      }

      emit("update:timeseriesData", props.timeseriesData);
    };

    /**
     * Toggle the visibility of the table
     */
    const toggleTable = () => {
      showTable.value = !showTable.value;
    };

    /**
     * Save changes to the timeseries data
     */
    const saveChanges = async () => {
      
      // this whole step 1 and 2 is to show a modal to the user for 2 seconds
      // to make the UX kind of "better", since in a local environment whatever change of data in a file
      // will lead to a page reload (if the websocket is live of course), 
      // so the user won't be able to see the "Saved!" modal for more than a few ms
      // making it a bad User experience. :)
      
      // Step 1: Show "Saving..." modal immediately
      modalRef.value.showModal("⏳ Please Wait", "Saving changes...", false);

      try {
        const response = await fetch("http://localhost:3000/save-timeseries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(props.timeseriesData), // Send data to "backend"
        });

        const result = await response.json();

        // Step 2: Close "Saving..." modal and show the result modal
        modalRef.value.closeModal(); // Hide the first modal after response
        if (response.ok) {
          modalRef.value.showModal("✅ Success", "Your data has been saved successfully!");
        } else {
          modalRef.value.showModal("❌ Error", "Error saving data: " + result.message);
        }
      } catch (error) {
        console.error("Save Error:", error);
        modalRef.value.closeModal(); // Hide "Saving..." modal
        modalRef.value.showModal("❌ Error", "Failed to save changes.");
      }
    };

    return {
      modalRef,
      showTable, 
      hasChanges,
      formatDate,
      filteredData,
      filteredFields,
      filteredHeaders,
      validateInput,
      toggleTable,
      saveChanges,
      exportToCSV,
    };
  },
};
</script>

<style scoped>
.table-wrapper {
  max-height: calc(10rem + 10vw); 
  overflow: auto;
}

.table-wrapper::-webkit-scrollbar {
  width: calc(0.35rem + 0.25vw); 
}
.table-wrapper::-webkit-scrollbar:horizontal {
  height: calc(0.35rem + 0.25vw);  
}

/* Light theme styling for scrollbar */
[data-bs-theme="light"] .table-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd; 
  border-radius: 4px;
}
[data-bs-theme="light"] .table-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
/* Dark theme styling for scrollbar */
[data-bs-theme="dark"] .table-wrapper::-webkit-scrollbar-thumb {
  background-color: #444; 
  border-radius: 4px;
}
[data-bs-theme="dark"] .table-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}

.table {
  font-size: calc(0.35rem + 0.35vw);
  display: table;
}
.table-container {
  height: auto;
  background: rgba(32, 32, 32, 0.05); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 22px;
  transition: transform 0.3s ease-in-out;
}
.table-container:hover {
  transform: translateY(-5px);
}
</style>