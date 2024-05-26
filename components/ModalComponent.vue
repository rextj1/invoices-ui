<!-- ModalComponent.vue -->
<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header">Default Header</slot>
      </div>
      <div class="modal-body">
        <slot>Default Body</slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button @click="closeModal">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  methods: {
    closeModal() {
      // Logic to close the modal
    }
  }
};
</script>

<style scoped>
/* Styles for the modal component */
</style>
