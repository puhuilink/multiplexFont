<template>
  <div class="ComboSelect">
    <a-form>
      <!-- / Host Type -->
      <a-form-item
        label="设备类型"
        v-bind="formItemLayout"
        required
      >
        <ModelHostTypeSelect
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
        <ModelEndpointSelect
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
        <ModelMetricSelect
          v-bind="selectProps"
          :value.sync="model.modelMetricIdList"
          :parentId="model.modelEndpointId"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import ModelHostTypeSelect from './ModelHostTypeSelect'
import CmdbHostSelect from './CmdbHostSelect'
import ModelEndpointSelect from './ModelEndpointSelect'
import ModelMetricSelect from './ModelMetricSelect'
import _ from 'lodash'
import { MetricService } from '@/api-hasura'

// TODO: Adaptor
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
    ModelHostTypeSelect,
    CmdbHostSelect,
    ModelEndpointSelect,
    ModelMetricSelect
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
    model: null
  }),
  computed: {
    selectProps () {
      const { toolTip, multiple } = this
      return { toolTip, multiple }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (value) {
        if (!value || _.isEmpty(value) || !value.hasOwnProperty('cmdbHostIdList')) {
          this.model = _.cloneDeep(defaultModel)
          return
        }
        // 防止 v-model 反复触发
        if (_.isEqual(value, this.model)) {
          return
        }
        this.model = _.cloneDeep(value)
      }
    },
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
  }
}
</script>

<style lang="less">

</style>
