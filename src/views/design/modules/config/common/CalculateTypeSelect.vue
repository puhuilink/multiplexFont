<template>
  <a-select
    allowClear
    v-bind="$props"
    v-on="$listeners"
  >
    <a-select-option
      v-for="option in calculateTypeList"
      :key="option.value"
    >{{ option.label }}</a-select-option>
  </a-select>
</template>

<script>
import { Select } from 'ant-design-vue'
import {
  CALCULATE_TYPE_SUM,
  CALCULATE_TYPE_MAX,
  CALCULATE_TYPE_AVG
} from '@/model/config/dataConfig/dynamicData/types/calculate'

export default {
  name: 'CalculateTypeSelect',
  mixins: [],
  extends: Select,
  props: {},
  data: () => ({
    calculateTypeList: [
      { label: '求和', value: CALCULATE_TYPE_SUM },
      { label: '最大值', value: CALCULATE_TYPE_MAX },
      { label: '均值', value: CALCULATE_TYPE_AVG }
    ]
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
