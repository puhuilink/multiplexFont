<template>
  <div class="ComboSelect">
    <a-form>
      <a-form-item
        v-if="hasDomain"
        label="Ci域"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <CiDomainSelect :form.sync="formData" />
      </a-form-item>
      <a-form-item
        label="Ci类型"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        required
      >
        <CiModelSelect :value="formData.model" @input="onModelInput" />
      </a-form-item>
      <a-form-item
        label="Ci实例"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        required
      >
        <CiInstanceSelect
          :toolTip="toolTip"
          :multiple="multiple"
          :parentName="formData.model"
          :value="formData.selectedInstance"
          @input="onInstanceInput"
        />
      </a-form-item>
      <a-form-item
        v-if="hasKpi"
        label="Kpi"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        required
      >
        <KpiSelect
          :toolTip="toolTip"
          :multiple="multiple"
          v-model="formData.selectedKpi"
          :nodeType="formData.model"
          placeholder
        />
      </a-form-item>
      <a-form-item
        v-if="hasAlarmType"
        label="告警类型"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <AlarmTypeSelect :form.sync="formData" />
      </a-form-item>
      <a-form-item
        v-if="hasDetailInstance"
        label="Instance"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-input :value="(formData.detailInstance || []).join(',')" @change="ondetailInstanceInput" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

import _ from 'lodash'
import {
  CiModelSelect,
  CiInstanceSelect,
  KpiSelect
} from '.'
import CiDomainSelect from './CiDomainSelect'
import AlarmTypeSelect from './AlarmTypeSelect'

const formItemLayout = {
  labelCol: {
    span: 6,
    offset: 0
  },
  wrapperCol: {
    span: 15,
    offset: 2
  }
}

const formData = {
  domain: '',
  model: '',
  selectedInstance: [],
  selectedKpi: [],
  alarmType: [],
  detailInstance: []
}

export default {
  name: 'ComboSelect',
  components: {
    CiModelSelect,
    CiInstanceSelect,
    KpiSelect,
    CiDomainSelect,
    AlarmTypeSelect
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => _.cloneDeep(formData)
    },
    multiple: {
      type: Boolean,
      default: false
    },
    hasKpi: {
      type: Boolean,
      default: true
    },
    hasDomain: {
      type: Boolean,
      default: false
    },
    hasAlarmType: {
      type: Boolean,
      default: false
    },
    hasDetailInstance: {
      type: Boolean,
      default: false
    },
    toolTip: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    formItemLayout,
    formData: null
  }),
  computed: {},
  watch: {
    formData: {
      deep: true,
      handler (v) {
        this.$emit('input', _.cloneDeep(this.formData))
      }
    }
  },
  methods: {
    onModelInput (v) {
      if (this.formData.model === v) {
        return
      }
      this.formData.selectedKpi = []
      this.formData.selectedInstance = []
      this.formData.model = v
    },
    onInstanceInput (arr = []) {
      this.formData.selectedInstance = Array.isArray(arr) ? arr : []
    },
    ondetailInstanceInput ({ target: { value } }) {
      this.formData.detailInstance = value.split(',').filter(v => !!v)
    }
  },
  created () {
    this.formData = _.isEmpty(this.value) ? _.cloneDeep(formData) : _.cloneDeep(this.value)
  }
}
</script>

<style lang="less">

</style>
