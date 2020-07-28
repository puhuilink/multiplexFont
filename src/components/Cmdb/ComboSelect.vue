<template>
  <div class="ComboSelect">
    <a-form>
      <a-form-item
        label="Host"
        v-bind="formItemLayout"
        required
      >
        <CmdbHostSelect
          v-bind="selectProps"
          :value="formData.selectedInstance"
        />
      </a-form-item>
      <!-- <a-form-item
        label="Metric"
        v-if="hasKpi"
        v-bind="formItemLayout"
        required
      >
        <KpiSelect
          :toolTip="toolTip"
          :multiple="multiple"
          v-model="formData.selectedKpi"
          :nodeType="formData.model"
          placeholder
        />
      </a-form-item> -->
    </a-form>
  </div>
</template>

<script>
import CmdbHostSelect from './CmdbHostSelect'
import _ from 'lodash'

// hack field name for old api
const formData = {
  selectedInstance: [],
  selectedKpi: [],
  alarmType: []
}

export default {
  name: 'ComboSelect',
  mixins: [],
  components: {
    CmdbHostSelect
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
