<template>
  <v-form
    ref="form"
    v-model="localValid"
    lazy-validation
    @submit.prevent="handleSubmit"
  >
    <!-- Common form fields -->
    <slot></slot>

    <!-- Buttons -->
    <slot name="buttons"></slot>

    <!-- Error display -->
    <v-alert v-if="errors" type="error">{{ errors }}</v-alert>
  </v-form>
</template>

<script>
export default {
  props: {
    formData: Object,
    isBusy: Boolean,
    valid: Boolean, // Rename this prop to "initialValid" if it's coming from a parent component
    errors: String,
    handleSubmit: Function,
  },
  data() {
    return {
      localValid: this.valid, // Initialize localValid with the initial value of the prop
    };
  },
  watch: {
    "formData.password"(newVal) {
      this.formData.password_confirmation = newVal;
    },
  },
};
</script>
