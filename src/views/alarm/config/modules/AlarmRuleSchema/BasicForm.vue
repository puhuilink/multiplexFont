<template>
  <fragment>
    <a-form-model-item label="规则名称" v-bind="formItemLayout" prop="title">
      <a-input v-model.trim="formModel.title" />
    </a-form-model-item>

    <a-form-model-item label="数据域" v-bind="formItemLayout">
      <a-select>
        <a-select-opt-group
          v-for="domain in dataDomain"
          :key="domain.name"
          :label="domain.name"
        >
          <a-select-option
            v-for="{ name, value } in domain.children"
            :key="value"
            :value="value"
          >{{ name }}</a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="设备名称" v-bind="formItemLayout" prop="host_id">
      <a-select v-model="_formModel.host_id"></a-select>
    </a-form-model-item>

    <a-form-model-item label="监控实体" v-bind="formItemLayout" prop="endpoint_id">
      <a-select v-model="_formModel.endpoint_id"></a-select>
    </a-form-model-item>

    <a-form-model-item label="检查项" v-bind="formItemLayout" prop="metric_id">
      <a-select v-model="_formModel.metric_id"></a-select>
    </a-form-model-item>

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
  components: {},
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
