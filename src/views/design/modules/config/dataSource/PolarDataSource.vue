/**
* 极坐标数据资源
* Date: 2020/5/19
* Time: 12:15 下午
*/
<template>
  <DataSourceTemplate>
    <template #real v-if="false">
      <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
        <a-button :loading="btnLoading" :disabled="!available" @click="change(true)">预览</a-button>
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

      <ComboSelect
        multiple
        hasDetailInstance
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
import DataSourceMixins from '../dataSourceMixins'
import DataSourceTemplate from './index'

export default {
  name: 'PolarDataSource',
  mixins: [DataSourceMixins],
  components: {
    DataSourceTemplate
  }
}
</script>

<style scoped>

</style>
