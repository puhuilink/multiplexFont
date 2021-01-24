<template>
  <a-form-model class="ComboDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />

    <a-form-item label="数据类型">
      <a-select class="fw" v-model="comboConfig.dataType">
        <a-select-option value="1">性能数据</a-select-option>
        <a-select-option value="6">健康度</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="指标配置">
      <a-button @click="() => visible = true">{{ comboConfig.content.length }}条</a-button>
    </a-form-item>

    <TimeRange @change="change()" />

    <CalculateTypeSelect @change="change()" />

    <GroupSelect @change="change()" />

    <a-form-item label="top">
      <a-input-number
        class="fw"
        v-model.number="comboConfig.top"
        :min="0"
        :parser="parserInt"
      ></a-input-number>
    </a-form-item>

    <RefreshTime />

    <DelayTime />

    <a-modal
      :footer="null"
      title="配置详情"
      v-model="visible"
      :width="1200"
      wrapClassName="ComboDataSource__modal"
    >
      <CascaderHostEndpointMetricList :content="comboConfig.content" />
    </a-modal>
  </a-form-model>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import CascaderHostEndpointMetricList from '~~~/CascaderHostEndpointMetricList'
import { parserInt } from '@/utils/util'

export default {
  name: 'ComboDataSource',
  mixins: [DataSourceMixins],
  components: {
    CascaderHostEndpointMetricList
  },
  props: {},
  data () {
    return {
      visible: false
    }
  },
  computed: {
    comboConfig () {
      return this.config.dataConfig.dbDataConfig.comboConfig
    }
  },
  methods: {
    parserInt
  }
}
</script>

<style lang="less">
.ComboDataSource {

  &__modal {
    .ant-modal-body {
      height: 500px;
      overflow: auto;
    }
  }
}
</style>
