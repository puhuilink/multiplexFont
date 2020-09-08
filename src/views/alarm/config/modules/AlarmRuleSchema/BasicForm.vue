<template>
  <fragment>
    <a-form-model-item
      v-bind="formItemLayout"
      label="规则名称"
      prop="title"
      :rules="[
        { required: true, message: '请输入规则名称' },
        { max: 50, message: '最多输入50个字符' },
        { pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/, message: '仅支持中英文与数字' }
      ]"
    >
      <a-input v-model.trim="formModel.title" />
    </a-form-model-item>

    <ComplexSnippet v-bind="formItemLayout" v-model="_formModel" />

    <a-form-model-item
      v-bind="formItemLayout"
      label="规则类型"
      prop="ruleType"
      :rules="[
        { required: true, message: '请选择规则类型' }
      ]"
    >
      <a-checkbox-group v-model="_formModel.ruleType">
        <a-checkbox
          v-for="(label, value) in ruleType"
          :key="value"
          :value="value"
        >{{ label }}</a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
  </fragment>
</template>

<script>
import { ruleTypeMapping } from '../../typing'
import Mixin from './Mixin'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'

export default {
  name: 'BasicForm',
  mixins: [Mixin],
  components: {
    ComplexSnippet
  },
  props: {},
  data: () => ({
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
