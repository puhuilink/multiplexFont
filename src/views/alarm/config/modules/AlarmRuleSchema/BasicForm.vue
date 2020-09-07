<template>
  <fragment>
    <a-form-model-item label="规则名称" v-bind="formItemLayout" prop="title">
      <a-input v-model.trim="formModel.title" />
    </a-form-model-item>

    <ComplexSnippet v-bind="formItemLayout" v-model="_formModel" />

    <a-form-model-item label="规则类型" v-bind="formItemLayout" prop="rule_type">
      <a-select v-model="_formModel.rule_type">
        <a-select-option
          v-for="(label, value) in ruleType"
          :key="value"
          :value="value"
        >{{ label }}</a-select-option>
      </a-select>
    </a-form-model-item>
  </fragment>
</template>

<script>
import { ruleTypeMapping } from '../../typing'
import { dataDomain } from '@/components/Common'
import Mixin from './Mixin'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'

export const basicFormRules = {
  title: [
    { required: true, message: '请输入规则名称' },
    { max: 50, message: '最多输入50个字符' },
    { pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/, message: '仅支持中英文与数字' }
  ],
  host_id: [
    { required: true, message: '请选择设备名称' }
  ],
  endpoint_id: [
    { required: true, message: '请选择监控实体' }
  ],
  metric_id: [
    { required: true, message: '请选择检查项' }
  ],
  rule_type: [
    { required: true, message: '请选择规则类型' }
  ]
}

export default {
  name: 'BasicForm',
  mixins: [Mixin],
  components: {
    ComplexSnippet
  },
  props: {},
  data: () => ({
    dataDomain,
    ruleType: Object.freeze(
      Object.fromEntries(ruleTypeMapping)
    )
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
