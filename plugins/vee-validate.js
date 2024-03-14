// plugins/vee-validate.js

import Vue from "vue";
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure,
} from "vee-validate";
import { required, email, max_value } from "vee-validate/dist/rules";

extend("required", required);
extend("email", email);
extend("max_value", max_value);

configure({
  // Configure Vee-validate as needed
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
