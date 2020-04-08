/**
* 告警列表动态数据配置
* Author: dong xing
* Date: 2020/4/7
* Time: 15:42
* Email: dong.xing@outlook.com
*/

<template>
  <div class="alarm-list-data-source">
    <DataSourceTemplate>
      <template #real>
        <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
          <a-button @click="change(true)">预览</a-button>
        </a-tooltip>

        <ComboSelect
          multiple
          hasDomain
          hasAlarmType
          :hasKpi="false"
          v-model="resourceConfig"
        />

        <a-form-item
          label="刷新时间"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <a-input
            :min="0"
            :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
            suffix="分钟"
            type="number"
            v-model.number="refreshTime"
          />
        </a-form-item>

      </template>
    </DataSourceTemplate>
  </div>
</template>

<script>
import { ComboSelect } from '@/components/Common'
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'

export default {
  name: 'AlarmListDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    ComboSelect
  }
}
</script>

<style scoped lang="less">
.alarm-list-data-source {
  &__select {
     width: 100%;
   }
}
</style>
