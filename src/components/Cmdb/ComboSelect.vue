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
          :value.sync="model.modelHostId"
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
          :value.sync="model.cmdbHostIdList"
          :parentId="model.modelHostId"
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
          :value.sync="model.modelEndpointId"
          :parentId="model.modelHostId"
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
          :value.sync="model.modelMetricIdList"
          :parentId="model.modelEndpointId"
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
import { MetricService } from '@/api-hasura'

// hack field name for old api
const defaultModel = {
  cmdbHostIdList: [],
  modelEndpointId: null,
  modelMetricIdList: [],
  modelHostId: null
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
      default: () => _.cloneDeep(defaultModel)
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
    model: _.cloneDeep(defaultModel)
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
    },
    'model': {
      // immediate: false,
      // deep: true,
      handler (model) {
        this.$emit('input', _.cloneDeep(model))
      }
    },
    'model.modelHostId' (modelHostId) {
      this.model.modelHostId = modelHostId
      this.model.modelEndpointId = null
      this.model.cmdbHostIdList = []
      console.log(1)
    },
    'model.modelEndpointId' (modelEndpointId) {
      this.model.modelEndpointId = modelEndpointId
      this.model.modelMetricIdList = null
      console.log(2)
    }
  },
  methods: {
    async preview () {
      const result = await MetricService.chartValue({
        resourceConfig: {
          cmdbHostIdList: [4329475],
          modelMetricIdList: [4329474],
          modelEndpointId: 4329473
        }
      })
      console.log(result)
    }
  },
  beforeCreate (vm) {
    console.log(vm)
  },
  created () {
    // hack
    const { value = {} } = this
    // FIXME: 会触发 watch 重置
    if (value.hasOwnProperty('cmdbHostIdList')) {
      console.log(_.cloneDeep(_.pick(value, Object.keys(defaultModel))))
      this.model = _.cloneDeep(_.pick(value, Object.keys(defaultModel)))
    }
  }
}
</script>

<style lang="less">

</style>
