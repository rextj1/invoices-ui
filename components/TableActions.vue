<template>
    <div>
      <v-icon small class="mr-2" @click="$emit('viewItem', item)">mdi-eye</v-icon>
      <v-icon small class="mr-2" @click="$emit('editItem', item)">mdi-pencil</v-icon>
      <v-icon small @click="$emit('deleteItem', item)">mdi-delete</v-icon>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object,
    },
  };
  </script>
  