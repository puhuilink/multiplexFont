<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    @ok="$emit('ok',$event)"
    @cancel="$emit('cancel',$event)"
    @close="$emit('cancel',$event)"
  >

    <a-form :form="editForm">
      <a-form-item label="阈值对象">
        <a-input :disabled="true" v-model="alias"></a-input>
      </a-form-item>
      <a-form-item label="阈值类型">
        <a-select v-model="editForm.condition">
          <a-select-option :value="'eq'">等于</a-select-option>
          <a-select-option :value="'ne'">不等于</a-select-option>
          <a-select-option :value="'gt'">大于</a-select-option>
          <a-select-option :value="'lt'">小于</a-select-option>
          <a-select-option :value="'out'">超过</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="阈值数值">
        <a-input
          v-if="editForm.condition !== 'gt'"
          v-model="editForm.lower_threshold">
        </a-input>
        <a-input
          v-if="editForm.condition === 'gt' || editForm.condition === 'out'"
          v-model="editForm.upper_threshold">
        </a-input>
      </a-form-item>
      <a-form-item label="告警等级">
        <a-select v-model="editForm.severity">
          <a-select-option :value="1">L1</a-select-option>
          <a-select-option :value="2">L2</a-select-option>
          <a-select-option :value="3">L3</a-select-option>
          <a-select-option :value="4">L4</a-select-option>
          <a-select-option :value="5">L5</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

export default {
  name: 'ThresholdSchema',
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    editForm: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data () {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return {
      formItemLayout,
      modalTitle: '编辑阈值规则',
      alias: ''
    }
  },
  computed: {},
  watch: {
    editForm: {
      handler (oldValue, newValue) {
        this.appendAlias()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {},
  methods: {
    appendAlias () {
      console.log(this.alias)
      this.alias = ''
      this.alias += this.editForm.host_alias + '/'
      this.alias += this.editForm.endpoint_alias !== 'NULL' ? this.editForm.endpoint_alias : '虚拟实体' + '/'
      this.alias += this.editForm.metric_alias
    }
  }
}
</script>

<style scoped lang="less">

</style>
