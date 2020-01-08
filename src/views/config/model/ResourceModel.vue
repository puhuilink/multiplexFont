<template>
  <div class="resource-model">
    {{ $apollo.queries.attributes.loading }}
    {{ attributes }}
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'ResourceModel',
  apollo: {
    attributes: {
      query: gql`query MyQuery {
        ngecc_model_attributes(limit: 10) {
          did
        }
      }`,
      update: data => data.ngecc_model_attributes
    }
  },
  data: () => ({
    attributes: null
  })
}
</script>

<style scoped>
</style>
