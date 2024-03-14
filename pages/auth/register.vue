<template>
  <v-app>
    <v-main>
      <v-card class="centered-frame">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="register"
        >
          <v-text-field
            v-model="form.name"
            :counter="10"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
            @input="checkEmailAvailability"
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
          <div v-if="form.password && strongPassword" class="my-4 success-text">
            Strong Password
          </div>

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

          <v-btn color="error" rounded class="mr-4" @click="reset">
            Reset Form
          </v-btn>
        </v-form>

        <v-card v-if="errors" color="primary" class="text-white">{{
          errors
        }}</v-card>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { passwordRules, emailRules } from "~/scripts/validationRules";
export default {
  data() {
    return {
      isBusy: false,
      valid: true,
      errors: null,
      form: {
        name: "",
        email: "",
        password: null,
        password_confirmation: null,
      },
      showPassword: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      passwordRules,
      emailRules,
      emailAvailabilityStatus: null,
      emailCheckTimeout: null,
    };
  },
  computed: {
    isFormValid() {
      return Object.values(this.form).every(
        (value) => value !== null && value !== ""
      );
    },
    strongPassword() {
      return this.form.password && this.passwordRules[3](this.form.password);
    },
  },
  methods: {
    async register() {
      this.isBusy = true;
      try {
        await this.$axios.$get("/sanctum/csrf-cookie");
        await this.$axios.$post("/register", this.form);
        await this.$auth.loginWith("laravelSanctum", { data: this.form });
        this.isBusy = false;
      } catch (error) {
        this.handleError(error);
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
    handleValidationErrors(errors) {
      this.errors = Object.values(errors).flat().join(" ");
    },
    async checkEmailAvailability() {
      clearTimeout(this.emailCheckTimeout);
      if (!this.valid) {
        this.emailAvailabilityStatus = null;
        return;
      }

      this.emailCheckTimeout = setTimeout(async () => {
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
      }, 500);
    },
  },
  watch: {
    "form.password"(newVal) {
      this.form.password_confirmation = newVal;
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
~/scripts/validationRules
