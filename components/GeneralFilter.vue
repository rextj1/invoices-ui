<template>
  <v-text-field
    v-model="search"
    label="Search..."
    append-icon="mdi-magnify"
    single-line
    hide-details
    class="mx-4"
  ></v-text-field>
</template>

<script>
export default {
    props: {
        search: {
            type: Boolean,
            required: false
        }
    }
}
</script>