<template>
  <div class="CiNodeDataSource">
    <a-form-item
      label="KPI"
      v-bind="formItemLayout"
    >
      <!-- <KpiSelect class="fw" /> -->
    </a-form-item>

    <a-form-item
      label="Ci 属性"
      v-bind="formItemLayout"
    >
      <!-- <CiAttrSelect /> -->
    </a-form-item>

    <ViewListSelect />

  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
// import { CiAttrSelect, KpiSelect } from '@/components/Common'
import ViewListSelect from '../common/ViewListSelect'

export default {
  name: 'CiNodeDataSource',
  mixins: [DataSourceMixins],
  components: {
    // CiAttrSelect,
    // KpiSelect,
    ViewListSelect
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
