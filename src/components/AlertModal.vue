<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal-container">
      <div class="modal-content">
        <h4 class="modal-title">{{ title }}</h4>
        <p>{{ message }}</p>
        <button v-if="showButton" class="btn btn-primary" @click="closeModal">OK</button>
        <!--  the show button and its functionallity exists for reusal purposes in case 
              we need a buttonless modal, like for instance when saving changes in our current setup    -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isVisible = ref(false);
    const title = ref("");
    const message = ref("");
    const showButton = ref(true); // default to true, but can be changed to false when needed

    /**
     * Show the modal with the specified title, message, and button visibility.
     * @param {string} modalTitle - The title of the modal.
     * @param {string} modalMessage - The message of the modal.
     * @param {boolean} [buttonVisible=true] - Whether to show the button.
     */
    const showModal = (modalTitle, modalMessage, buttonVisible = true) => {
      title.value = modalTitle;
      message.value = modalMessage;
      isVisible.value = true;
      showButton.value = buttonVisible; 
    };

    /**
     * Close the modal.
     */
    const closeModal = () => {
      isVisible.value = false;
    };

    return { isVisible, title, message, showButton, showModal, closeModal };
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050; 
}

.modal-container {
  background: #ffffff; 
  color: #000000;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  transition: background 0.3s, color 0.3s;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.btn-primary {
  padding: 8px 16px;
  margin-top: 10px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.btn-primary:hover {
  background-color: var(--btn-bg-hover, #0056b3);
}
</style>