<template>
  <div class="ComboSelect">
    <a-form>
      <!-- / Host -->
      <a-form-item
        label="Host"
        v-bind="formItemLayout"
        required
      >
        <CmdbHostSelect
          v-bind="selectProps"
        />
      </a-form-item>

      <!-- / Endpoint -->
      <a-form-item
        label="Endpoint"
        v-if="hasKpi"
        v-bind="formItemLayout"
        required
      >
        <CmdbEndpointSelect
          v-bind="selectProps"
        />
      </a-form-item>

      <!-- / Metric -->
      <a-form-item
        label="Metric"
        v-if="hasKpi"
        v-bind="formItemLayout"
        required
      >
        <CmdbMetricSelect
          v-bind="selectProps"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
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
  methods: {},
  created () {
    this.formData = _.isEmpty(this.value) ? _.cloneDeep(formData) : _.cloneDeep(this.value)
  }
}
</script>

<style lang="less">

</style>
