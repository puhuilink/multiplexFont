<template>
  <div class="ComboDataSource">
    <a-form-item v-bind="formItemLayout">
      <a-button :loading="btnLoading" @click="preview">预览</a-button>
    </a-form-item>

    <a-form-item label="指标配置" v-bind="formItemLayout">
      {{ comboConfig.content.length }}条
      <a-button @click="detail">详情</a-button>
    </a-form-item>

    <TimeRange :type="SOURCE_TYPE_COMBO" />

    <a-form-item label="计算类型" v-bind="formItemLayout">
      <CalculateTypeSelect
        class="fw"
        v-model="comboConfig.calculateType"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="分组条件" v-bind="formItemLayout">
      <GroupSelect
        class="fw"
        v-model="comboConfig.isGroup"
        @change="change()"
      />
    </a-form-item>

    <a-form-item label="top" v-bind="formItemLayout">
      <a-input-number
        class="fw"
        v-model.number="comboConfig.top"
        :min="0"
        :parser="parserInt"
      ></a-input-number>
    </a-form-item>

    <a-modal
      :footer="null"
      title="20px to Top"
      v-model="visible"
      :width="1200"
      wrapClassName="ComboDataSource__modal"
    >
      <CascaderHostEndpointMetricList :content="comboConfig.content" />
    </a-modal>
  </div>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import CascaderHostEndpointMetricList from '~~~/CascaderHostEndpointMetricList'
import TimeRange from './TimeRange'
import CalculateTypeSelect from './CalculateTypeSelect'
import GroupSelect from './GroupSelect'
import { parserInt } from '@/utils/util'
import { SOURCE_TYPE_COMBO } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'ComboDataSource',
  mixins: [DataSourceMixins],
  components: {
    CascaderHostEndpointMetricList,
    TimeRange,
    CalculateTypeSelect,
    GroupSelect
  },
  props: {},
  data () {
    return {
      visible: false,
      SOURCE_TYPE_COMBO
    }
  },
  computed: {
    dbDataConfig () {
      return this.config.dataConfig.dbDataConfig
    },
    comboConfig () {
      return this.config.dataConfig.dbDataConfig.comboConfig
    }
  },
  methods: {
    parserInt,
    detail () {
      this.visible = true
    },
    async preview () {
      try {
        this.btnLoading = true
        await this.change(true)
      } finally {
        this.btnLoading = false
      }
    }
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
