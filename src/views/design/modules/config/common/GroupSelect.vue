<template>
  <a-select
    allowClear
    v-bind="$props"
    v-on="$listeners"
  >
    <a-select-option
      v-for="option in groupList"
      :key="option.value"
    >{{ option.label }}</a-select-option>
  </a-select>
</template>

<script>
import { Select } from 'ant-design-vue'
import {
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_OVERVIEW
} from '@/model/config/dataConfig/dynamicData/types/sourceType'
import {
  GROUP_TYPE_HOUR,
  GROUP_TYPE_DAY,
  GROUP_TYPE_MONTH,
  GROUP_TYPE_DEVICE,
  GROUP_TYPE_MINUTE
} from '@/model/config/dataConfig/dynamicData/types/isGroup'

export default {
  name: 'GroupSelect',
  mixins: [],
  extends: Select,
  props: {
    type: {
      type: String,
      default: SOURCE_TYPE_REAL,
      validator: type => [SOURCE_TYPE_REAL, SOURCE_TYPE_ALARM, SOURCE_TYPE_OVERVIEW].includes(type)
    }
  },
  data: () => ({}),
  computed: {
    groupList () {
      return [
        { label: '按小时', value: GROUP_TYPE_HOUR },
        { label: '按天', value: GROUP_TYPE_DAY },
        { label: '按月', value: GROUP_TYPE_MONTH },
        ...this.type === SOURCE_TYPE_ALARM ? [
          { label: '按设备', value: GROUP_TYPE_DEVICE }
        ] : [],
        ...this.type === SOURCE_TYPE_OVERVIEW ? [
          { label: '按分钟', value: GROUP_TYPE_MINUTE }
        ] : []
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
