<!-- Login.vue -->
<template>
  <v-app>
    <v-main>
      <v-card class="centered-frame">
        <AuthAuthForm
          :formData="form"
          :isBusy="isBusy"
          :valid="valid"
          :errors="errors"
          :handleSubmit="login"
        >
          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
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
              Login
              <v-progress-circular
                v-if="isBusy"
                indeterminate
                size="20"
                color="primary"
              ></v-progress-circular>
            </v-btn>
            <v-btn color="error" class="mr-4" rounded @click="reset"
              >Reset Form</v-btn
            >
          </template>
        </AuthAuthForm>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import AuthAuthForm from "@/components/Auth/AuthForm.vue";
import { emailRules } from "~/scripts/validationRules";

export default {
  components: { AuthAuthForm },
  data() {
    return {
      valid: true,
      isBusy: false,
      form: {
        email: "",
        password: null,
      },
      showPassword: false,
      emailRules,
      passwordRules: [],
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
    async login() {
      this.isBusy = true;
      try {
        // Make an HTTP POST request to your Laravel Sanctum backend's login endpoint
        await this.$auth.loginWith("laravelSanctum", { data: this.form });
        if (this.checkbox) {
          // Set cookie to keep the user logged in
          // document.cookie = "loggedIn=true; max-age=86400; path=/"; // expires in 1 day
          this.setCookie("loggedIn", "true");
        }

        // Reset any previous errors
        this.errors = null;

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
    setCookie(name, value) {
      const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
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

  & .success-text {
    color: green;
  }
}
</style>
