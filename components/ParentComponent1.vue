<!-- ParentComponent1.vue -->
<template>
    <div>
      <ModalComponent>
        <template v-slot:header>
          <h2>Welcome Modal</h2>
        </template>
        <p>Welcome to our application! Please log in to continue.</p>
        <template v-slot:footer>
          <button @click="login">Login</button>
          <button @click="closeModal">Close</button>
        </template>
      </ModalComponent>
    </div>
  </template>
  
  <script>
  import ModalComponent from './ModalComponent.vue';
  
  export default {
    components: {
      ModalComponent,
    },
    methods: {
      login() {
        // Logic for login
      },
      closeModal() {
        // Logic to close the modal
      }
    }
  };
  </script>
  