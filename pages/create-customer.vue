<template>
  <div @click="create">Create{{ customers }}</div>
</template>

<script>
export default {
  middleware: 'auth',
  data: () => ({
    customers: [],
    form: {
      name: 'rex',
      type: 'I',
      email: 'to@gmail.com',
      address: 'xxx',
      city: 'ph',
      state: 'rivers',
      postalCode: '222',
    },
  }),

  methods: {
    async create() {
      try {
        await this.$axios
          .$post('api/api/v1/customers', this.form)
          .then((resp) => {
            this.customers = resp
          })
          .catch((err) => {
            if ((err.response.status = 422)) {
              errors = err.response.data.errors
            }
          })
      } catch (error) {}
    },
  },
}
</script>
