<template>
  <fragment>
    <BusinessSystemTree v-model="config.systemId" />
    <a-select
      allowClear
      placeholder="请选择健康度类型"
      :style="{ minWidth: '200px' }"
      :value="config.systemType === null ? undefined : config.systemType"
      @change="e => config.systemType = e"
    >
      <a-select-option
        v-for="{ label, value } in options"
        :key="value"
        :value="value"
      >{{ label }}</a-select-option>
    </a-select>
  </fragment>
</template>

<script>
import BusinessSystemTree from '~~~/BusinessSystemTree'

export default {
  name: 'BusinessSystemTreeHealth',
  mixins: [],
  components: {
    BusinessSystemTree
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      options: [
        { label: '操作系统', value: 'OS' },
        { label: '应用系统', value: 'APM' },
        { label: '数据库', value: 'DB' },
        { label: '中间件', value: 'MID' }
      ]
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
