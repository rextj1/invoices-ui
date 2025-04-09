<template>
    <v-container>
      <h1>Media Upload</h1>
      <media-upload />
    </v-container>
  </template>
  
  <script>
  export default {
    components: {
      MediaUpload: () => import("~/components/MediaUpload.vue"),
    },
  };
  </script>