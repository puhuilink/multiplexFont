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
      { label: 'BJ1', value: 'BJ1' },
      { label: 'BJ2', value: 'BJ2' },
      { label: 'XM1', value: 'XM1' },
      { label: 'XM2', value: 'XM2' }
    ]
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
