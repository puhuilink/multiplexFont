<template>
  <div class="ComboSelect">
    <a-form>
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
          :parentNameS="formData.model"
          :value="formData.selectedInstance"
          @input="onInstanceInput"
        />
      </a-form-item>
      <a-form-item
        label="Kpi"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        required
      >
        <KpiSelect
          v-model="formData.selectedKpi"
          :nodetypeS="formData.model"
          placeholder
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {
  CiModelSelect,
  CiInstanceSelect,
  KpiSelect
} from '.'
import _ from 'lodash'

const formItemLayout = {
  labelCol: {
    span: 6,
    offset: 0
  },
  wrapperCol: {
    span: 13,
    offset: 2
  }
}

const formData = {
  model: '',
  selectedInstance: [],
  selectedKpi: []
}

export default {
  name: 'ComboSelect',
  components: {
    CiModelSelect,
    CiInstanceSelect,
    KpiSelect
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => _.cloneDeep(formData)
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
    }
  },
  created () {
    this.formData = _.isEmpty(this.value) ? _.cloneDeep(formData) : _.cloneDeep(this.value)
  }
}
</script>

<style lang="less">

</style>
