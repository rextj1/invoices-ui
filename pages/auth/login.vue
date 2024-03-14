<template>
  <v-app>
    <v-main>
      <v-card class="centered-frame">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="login"
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
          <div v-if="form.password && strongPassword" class="success-text">
            Strong Password
          </div>

          <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="stay login?"
            required
          ></v-checkbox>

          <v-btn
            :disabled="!valid || isBusy || !isFormValid"
            color="success"
            class="mr-4"
            type="submit"
            rounded
          >
            Submit
            <v-progress-circular
              v-if="isBusy"
              indeterminate
              size="20"
              color="primary"
            ></v-progress-circular>
          </v-btn>

          <v-btn color="error" class="mr-4" rounded @click="reset">
            Reset Form
          </v-btn>
        </v-form>

        <v-alert v-if="errors" type="error">
          {{ errors }}
        </v-alert>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: "auth",
  data() {
    return {
      valid: true,
      isBusy: false,
      form: {
        email: "",
        password: null,
        password_confirmation: null,
      },
      status: null,
      showPassword: false,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "Password must be at least 8 characters long",
      ],

      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      errors: null,
      checkbox: false,
    };
  },
  computed: {
    isFormValid() {
      return Object.values(this.form).every(
        (value) => value !== null && value !== ""
      );
    },
    strongPassword() {
      return;
      // return this.form.password && this.passwordRules[3](this.form.password);
    },
  },
  methods: {
    async login() {
      this.isBusy = true;
      try {
        await this.$auth.loginWith("laravelSanctum", { data: this.form });
        if (this.checkbox) {
          // Set cookie to keep the user logged in
          // document.cookie = "loggedIn=true; max-age=86400; path=/"; // expires in 1 day
          this.setCookie("loggedIn", "true");
        }
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

    // the error response from the backend
    handleValidationErrors(errors) {
      this.errors = Object.values(errors).flat().join(" ");
    },
    setCookie(name, value) {
      const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
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

  & .success-text {
    color: green;
  }
}
</style>
