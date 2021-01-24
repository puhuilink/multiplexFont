<template>
  <a-form-item label="分组条件" required>
    <a-select
      allowClear
      class="fw"
      v-model="activeWidget.config.dataConfig.getCurrentConfig().isGroup"
      v-bind="$props"
      v-on="$listeners"
    >
      <a-select-option
        v-for="option in groupList"
        :key="option.value"
      >{{ option.label }}</a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { mapState } from 'vuex'
import { Select } from 'ant-design-vue'
import {
  SOURCE_TYPE_ALARM,
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
  extends: Select,
  computed: {
    ...mapState('screen', ['activeWidget']),
    groupList () {
      const { sourceType } = this.activeWidget.config.dataConfig
      return [
        { label: '按小时', value: GROUP_TYPE_HOUR },
        { label: '按天', value: GROUP_TYPE_DAY },
        { label: '按月', value: GROUP_TYPE_MONTH },
        ...sourceType === SOURCE_TYPE_ALARM ? [
          { label: '按设备', value: GROUP_TYPE_DEVICE }
        ] : [],
        ...sourceType === SOURCE_TYPE_OVERVIEW ? [
          { label: '按分钟', value: GROUP_TYPE_MINUTE }
        ] : []
      ]
    }
  }
}
</script>

<style lang="less">

</style>
