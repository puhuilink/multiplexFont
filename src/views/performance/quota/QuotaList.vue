<template>
  <div class="QuotaList">
    <ResourceInstanceList
      hiddenOperation
      :where="{
        parentName: {
          _eq: 'Kpi'
        }
      }"
    />
  </div>
</template>

<script>
import { ResourceInstanceList } from '@/components/Resource'

export default {
  name: 'QuotaList',
  components: {
    ResourceInstanceList
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">
</style>
