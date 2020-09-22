<template>
  <a-select
    class="fw"
    v-bind="$props"
    v-on="$listeners"
  >
    <a-select-option
      v-for="item in list"
      :key="item.value"
      :value="item.value"
    >{{ item.label }}</a-select-option>
  </a-select>
</template>
<script>
import { Select } from 'ant-design-vue'

export default {
  name: 'OriginSelect',
  mixins: [],
  extends: Select,
  components: {},
  props: {},
  data: () => ({
    list: [
      { label: '北京数据中心', value: 'BJ-1' },
      { label: '厦门数据中心', value: 'XM-1' }
    ]
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
