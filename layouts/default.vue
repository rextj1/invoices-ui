<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <!-- <v-icon>mdi-minus</v-icon> -->
      </v-btn>
      <v-toolbar-title> </v-toolbar-title>
      <v-spacer />
      <v-btn v-show="$auth.loggedIn" icon @click.stop="logout"> logout </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  // head: {
  //   link: [
  //     { rel: "preload", href: "/_nuxt/app.hot-update.js", as: "script" }
  //   ]
  // },
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Customers",
          to: "/",
        },
        {
          icon: "mdi-apps",
          title: "Invoices",
          to: "/invoices",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Media",
          to: "/media",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Upload",
          to: "/upload",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    };
  },

  methods: {
    async logout() {
      this.$nuxt.$loading.start();
      await this.$auth.logout();
    },
  },
};
</script>
