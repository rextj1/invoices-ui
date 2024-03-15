<!-- Register.vue -->
<template>
  <v-app>
    <v-main>
      <v-card class="centered-frame">
        <auth-auth-form
          :formData="form"
          :isBusy="isBusy"
          :valid="valid"
          :errors="errors"
          :handleSubmit="register"
        >
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.email"
            @input="checkEmailAvailability"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <div
            v-if="emailAvailabilityStatus !== null"
            class="availability-status"
            :class="{
              'success-text': emailAvailabilityStatus === 'Email is available',
            }"
          >
            {{ emailAvailabilityStatus }}
          </div>

          <v-text-field
            v-model.trim="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
            :rules="passwordRules"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <template v-slot:buttons>
            <v-btn
              :disabled="!valid || isBusy || !isFormValid"
              color="success"
              class="mr-4"
              type="submit"
              rounded
            >
              Register
              <v-progress-circular
                v-if="isBusy"
                indeterminate
                size="20"
                color="primary"
              ></v-progress-circular>
            </v-btn>
            <v-btn color="error" rounded class="mr-4" @click="reset"
              >Reset Form</v-btn
            >
          </template>
        </auth-auth-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import AuthAuthForm from "@/components/Auth/AuthForm.vue";
import { emailRules, registerPasswordRules } from "~/scripts/validationRules";

export default {
  components: { AuthAuthForm },
  data() {
    return {
      valid: true,
      isBusy: false,
      form: {
        name: "",
        email: "",
        password: null,
      },
      emailAvailabilityStatus: null,
      showPassword: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      emailRules,
      passwordRules: registerPasswordRules,
      errors: null,
    };
  },
  computed: {
    isFormValid() {
      return Object.values(this.form).every(
        (value) => value !== null && value !== ""
      );
    },
  },
  methods: {
    async register() {
      this.isBusy = true;
      try {
        // Make an HTTP POST request to your Laravel Sanctum backend's login endpoint
        await this.$axios.$get("/sanctum/csrf-cookie");
        await this.$axios.$post("/register", this.form);
        await this.$auth.loginWith("laravelSanctum", { data: this.form });

        // Reset form and errors
        // this.resetForm();
        // this.errors = null;
        this.isBusy = false;

        // Redirect the user to the dashboard or another page
        // Example: this.$router.push('/dashboard');
      } catch (error) {
        this.handleError(error); // Handle authentication error
      } finally {
        this.isBusy = false; // Set isBusy to false regardless of the outcome
      }
    },

    reset() {
      this.$refs.form.reset();
    },
    async checkEmailAvailability() {
      if (!this.valid) {
        this.emailAvailabilityStatus = null;
        return;
      }

      try {
        const response = await this.$axios.$get(
          `/check-email?email=${this.form.email}`
        );
        if (response.available) {
          this.emailAvailabilityStatus = "Email is available";
        } else {
          this.emailAvailabilityStatus = "Email is already taken";
        }
      } catch (error) {
        console.error("Error checking email availability:", error);
      }
    },

    handleError(error) {
      if (error.response && error.response.status === 422) {
        this.handleValidationErrors(error.response.data.errors);
      } else {
        this.errors = "An error occurred. Please try again later.";
      }
      this.isBusy = false;
    },

    // the error response from the backend
    handleValidationErrors(errors) {
      this.errors = Object.values(errors).flat().join(" ");
    },
  },
};
</script>

<style lang="scss">
.centered-frame {
  width: 35%;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .success-text {
    color: green;
  }
  .availability-status {
    margin-top: 8px;
    font-size: 0.8rem;
  }
}
</style>
