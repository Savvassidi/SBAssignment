<template>
  <button class="btn btn-outline-secondary" @click="toggleTheme">
    {{ isDarkMode ? "🌞" : "🌙" }}
  </button>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "ToggleButton",
  setup() {
    // basic setup for dark mode toggle
    const isDarkMode = ref(localStorage.getItem("theme") === "dark");

    /**
     * Toggle the theme between dark and light mode.
     */
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      const theme = isDarkMode.value ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", theme);
      localStorage.setItem("theme", theme);
    };

    /**
     * Set the initial theme based on the saved preference in localStorage.
     */
    onMounted(() => {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
      isDarkMode.value = savedTheme === "dark";
    });

    return {
      isDarkMode,
      toggleTheme,
    };
  },
};
</script>

<style scoped>
.btn {
  transition: background-color 0.5s, color 0.5s, border-color 0.5s;
}

.btn:hover {
  opacity: 0.9;
}
</style>