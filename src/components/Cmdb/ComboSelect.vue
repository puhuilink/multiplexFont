<template>
  <div class="ComboSelect">
    <a-form>
      <!-- / Host Type -->
      <a-form-item
        label="设备类型"
        v-bind="formItemLayout"
        required
      >
        <CmdbHostTypeSelect
          v-bind="selectProps"
          :value.sync="model.hostType"
          @select="selectHostType"
        />
      </a-form-item>

      <!-- / Host -->
      <a-form-item
        label="监控对象"
        v-bind="formItemLayout"
        required
      >
        <CmdbHostSelect
          v-bind="selectProps"
          :value.sync="model.hostId"
          :hostType="model.hostType"
          @select="selectHost"
        />
      </a-form-item>

      <!-- / Endpoint -->
      <a-form-item
        label="监控实体"
        v-if="hasKpi"
        v-bind="formItemLayout"
        required
      >
        <CmdbEndpointSelect
          v-bind="selectProps"
          :value.sync="model.endpointId"
          :hostId="model.hostId"
          @select="selectEndpoint"
        />
      </a-form-item>

      <!-- / Metric -->
      <a-form-item
        label="检查项"
        v-if="hasKpi"
        v-bind="formItemLayout"
        required
      >
        <CmdbMetricSelect
          v-bind="selectProps"
          :value.sync="model.metricId"
          :endpointId="model.endpointId"
          @select="selectMetric"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import CmdbHostTypeSelect from './CmdbHostTypeSelect'
import CmdbHostSelect from './CmdbHostSelect'
import CmdbEndpointSelect from './CmdbEndpointSelect'
import CmdbMetricSelect from './CmdbMetricSelect'
import _ from 'lodash'

// hack field name for old api
const formData = {
  model: '',
  selectedInstance: [],
  selectedKpi: []
}

export default {
  name: 'ComboSelect',
  mixins: [],
  components: {
    CmdbHostTypeSelect,
    CmdbHostSelect,
    CmdbEndpointSelect,
    CmdbMetricSelect
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
    toolTip: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    formData: null,
    formItemLayout: {
      labelCol: {
        span: 6,
        offset: 0
      },
      wrapperCol: {
        span: 15,
        offset: 2
      }
    },
    model: {
      hostId: 254716022784,
      endpointId: null,
      metricId: null
    }
  }),
  computed: {
    selectProps () {
      const { toolTip, multiple } = this
      return { toolTip, multiple }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler (v) {
        this.$emit('input', _.cloneDeep(this.formData))
      }
    }
  },
  methods: {
    resetModel () {
      this.model = Object.assign({}, this.$options.data.apply(this).model)
    },
    selectHostType (e) {
      this.resetModel()
      this.model.hostType = e
    },
    selectHost (e) {
      this.model.hostId = e
      this.model.endpointId = null
      this.model.metricId = null
    },
    selectEndpoint (e) {
      this.model.endpointId = e
      this.model.metricId = null
    },
    selectMetric (e) {
      this.model.metricId = e
    }
  },
  created () {
    this.formData = _.isEmpty(this.value) ? _.cloneDeep(formData) : _.cloneDeep(this.value)
  }
}
</script>

<style lang="less">

</style>
