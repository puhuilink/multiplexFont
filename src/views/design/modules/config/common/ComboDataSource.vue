<template>
  <a-form-model class="ComboDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />

    <a-form-item label="数据类型">
      <a-select class="fw" v-model="comboConfig.dataType">
        <a-select-option value="1">性能数据</a-select-option>
        <a-select-option value="6">健康度</a-select-option>
        <a-select-option value="2">业务系统</a-select-option>
        <a-select-option value="8">Top数据</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="指标配置">
      <a-button @click="() => visible = true">{{ comboConfig.getCurrentContent().length }}条</a-button>
    </a-form-item>

    <TimeRange @change="change()" />

    <CalculateTypeSelect @change="change()" />

    <GroupSelect @change="change()" />

    <a-form-item label="top" :required="comboConfig.dataType === '8'">
      <a-input-number
        class="fw"
        v-model.number="comboConfig.top"
        :min="0"
        :parser="parserInt"
      ></a-input-number>
    </a-form-item>
    <a-form-item label="指标名称" v-if="comboConfig.dataType === '8'" :required="comboConfig.dataType === '8'">
      <a-input
        class="fw"
        v-model="comboConfig.topContent.metricAlias"
      ></a-input>
    </a-form-item>
    <a-form-item label="设备类型" v-if="comboConfig.dataType === '8'" :required="comboConfig.dataType === '8'">
      <a-select
        class="fw"
        v-model="comboConfig.topContent.hostType"
        mode="multiple"
      >
        <a-select-option v-for="(type,index) in hType" :key="index" :value="type.HostType">{{ type.HostType }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="数据来源" v-if="comboConfig.dataType === '8'" :required="comboConfig.dataType === '8'">
      <a-select
        class="fw"
        v-model="comboConfig.topContent.location"
        mode="multiple"
      >
        <a-select-option value="XM1">厦门1</a-select-option>
        <a-select-option value="XM2">厦门2</a-select-option>
        <a-select-option value="BJ1">北京1</a-select-option>
        <a-select-option value="BJ2">北京2</a-select-option>
      </a-select>
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
      <CascaderHostEndpointMetricList
        :content="comboConfig.content"
        v-show="comboConfig.dataType === '1'"
      />
      <BusinessSystemTreeHealthList
        :content="comboConfig.healthyContent"
        v-show="comboConfig.dataType === '6'"
      />
      <BusinessSystemAllList
        :content="comboConfig.businessContent"
        v-show="comboConfig.dataType === '2'"
      ></BusinessSystemAllList>
    </a-modal>
  </a-form-model>
</template>

<script>
import DataSourceMixins from '../dataSourceMixins/index'
import CascaderHostEndpointMetricList from '~~~/CascaderHostEndpointMetricList'
import BusinessSystemTreeHealthList from '~~~/BusinessSystemTreeHealthList'
import BusinessSystemAllList from '~~~/BusinessSystemAllList'
import { parserInt } from '@/utils/util'
import { CmdbService } from '@/api'

export default {
  name: 'ComboDataSource',
  mixins: [DataSourceMixins],
  components: {
    CascaderHostEndpointMetricList,
    BusinessSystemTreeHealthList,
    BusinessSystemAllList
  },
  props: {},
  data () {
    return {
      visible: false,
      hType: []
    }
  },
  computed: {
    comboConfig () {
      return this.config.dataConfig.dbDataConfig.comboConfig
    }
  },
  created () {
    this.fetchHostType()
  },
  methods: {
    parserInt,
    async fetchHostType () {
      const result = await CmdbService.hostFind({
        fields: [
          'HostType:host_type'
        ],
        distinct: 'host_type'
      })
      const { data: { t_cmdb_host } } = result
      this.hType = t_cmdb_host
      console.log(this.hType)
    }
  }
}
</script>

<style lang='less'>
.ComboDataSource {

  &__modal {
    .ant-modal-body {
      height: 500px;
      overflow: auto;
    }
  }
}
</style>
