<template>
  <div class="resource-model">
    <!-- {{ $apollo.queries.attributes.loading }} -->
    <!-- {{ attributes }} -->
    <a-tree
      v-if="treeData"
      :treeData="treeData"
      defaultExpandAll
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { buildTree } from './utils'

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
    treeData: null,
    attributes: null
  }),
  methods: {
    async fetch () {
      try {
        const res = await this.$apollo.query({
          query: gql`query MyQuery {
            ngecc_model {
              title: label_s
              key: name_s
              parentKey: parentname_s
            }
          }`
        })
        const collection = res.data.ngecc_model
        const root = collection.find(el => el.key === 'Ci')
        this.treeData = buildTree(root, collection)
      } catch (e) {
        this.treeData = null
        throw e
      }
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style scoped>
</style>
