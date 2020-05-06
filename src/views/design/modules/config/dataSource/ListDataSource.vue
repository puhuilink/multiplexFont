<template>
  <DataSourceTemplate>
    <template #real>
      <!-- <a-tooltip placement="top" title="加载假数据" arrowPointAtCenter>
        <a-button>模拟</a-button>
      </a-tooltip> -->
      <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
        <a-button :disabled="!available" @click="change(true)">预览</a-button>
      </a-tooltip>

      <a-form-item
        label="时间"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-select style="width: 100%" v-model="timeRangeStart">
          <a-select-option
            v-for="(option, idx) in timeRangeSelectOptions"
            :key="idx"
            :value="option.value"
          >
            {{ option.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <ComboSelect :multiple="true" v-model="resourceConfig" />

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

      <a-form-item
        label="外部CI可用"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-checkbox
          :checked="!!externalCi"
          @input="externalCi = $event"
        />
      </a-form-item>
    </template>
  </DataSourceTemplate>
</template>

<script>
import { ComboSelect } from '@/components/Common'
import DataSourceTemplate from './index'
import DataSourceMixins from '../dataSourceMixins'

export default {
  name: 'ListDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate,
    ComboSelect
  }
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
