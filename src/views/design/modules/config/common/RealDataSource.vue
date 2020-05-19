<template>
  <div class="'RealDataSource'">
    <a-tooltip placement="top" title="加载真实数据" arrowPointAtCenter>
      <a-button :loading="btnLoading" :disabled="!available" @click="change(true)">预览</a-button>
    </a-tooltip>

    <!-- / 查询时间 -->
    <a-form-item
      label="时间"
      v-bind="formItemLayout"
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

    <!-- / 数据源 -->
    <ComboSelect
      v-bind="{ multiple: false, hasDetailInstance: true, ...comboSelectProps }"
      v-model="resourceConfig"
      v-if="useComboSelect"
    />

    <!-- / 刷新时间 -->
    <a-form-item
      label="刷新时间"
      v-bind="formItemLayout"
      v-if="useRefreshTime"
    >
      <a-input
        :min="0"
        :parser="num => (Number(num) >= 0 ? Number(num) : 0).toFixed(0)"
        suffix="分钟"
        type="number"
        v-model.number="refreshTime"
      />
    </a-form-item>

    <!-- / 外部 Ci 可用 -->
    <a-form-item
      label="外部CI可用"
      v-bind="formItemLayout"
      v-if="useExternalCi"
    >
      <a-checkbox
        :checked="!!externalCi"
        @input="externalCi = $event"
      />
    </a-form-item>
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import { ComboSelect } from '@/components/Common'

export default {
  name: 'RealDataSource',
  mixins: [DataSourceMixins],
  components: {
    ComboSelect
  },
  props: {
    useComboSelect: {
      type: Boolean,
      default: true
    },
    comboSelectProps: {
      type: Object,
      default: () => ({})
    },
    useExternalCi: {
      type: Boolean,
      default: true
    },
    useRefreshTime: {
      type: Boolean,
      default: true
    },
    useTimeRange: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="less">
.data-source {
  &__select {
    width: 100%;
  }
}
</style>
