import path from "path";
import fs from "fs";
import colors from "vuetify/es5/util/colors";

const inProduction = process.env.NODE_ENV === "production";
const apiRoot = process.env.APP_API_ROOT || "https://api.invoice.com";

export default {
  ssr: false,
  server: {
    proxy: apiRoot,
    https: inProduction
      ? false
      : {
          key: fs.readFileSync(path.resolve(__dirname, "certs/server.key")),
          cert: fs.readFileSync(path.resolve(__dirname, "certs/server.crt")),
        },
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - nuxt2-vuetify",
    title: "nuxt2-vuetify",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/auth-next"],

  axios: {
    baseURL: apiRoot,
    credentials: true,
  },

  auth: {
    redirect: {
      login: "/",
      logout: "/auth/login",
      home: "/",
    },

    strategies: {
      laravelSanctum: {
        provider: "laravel/sanctum",
        url: apiRoot,
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  publicRuntimeConfig: {
    APIRoot: apiRoot,
  },
};
