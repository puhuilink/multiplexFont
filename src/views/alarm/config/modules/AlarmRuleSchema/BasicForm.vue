<template>
  <fragment>
    <a-form-model-item
      v-bind="formItemLayout"
      label="规则名称"
      prop="title"
      :rules="[
        { required: true, message: '请输入规则名称' },
        { max: 50, message: '最多输入50个字符' },
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
      <a-checkbox-group v-bind="editAbleProps" v-model="_formModel.ruleType">
        <a-checkbox
          v-for="item in ruleType"
          :key="item"
          :value="item"
        >{{ ruleTypeMapping.get(item) }}</a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'
import { ruleTypeMapping } from '@/tables/alarm_rule/columns'

export default {
  name: 'BasicForm',
  mixins: [Mixin],
  components: {
    ComplexSnippet
  },
  provide () {
    return {
      ctx: this
    }
  },
  props: {
    ruleType: {
      type: Array,
      default: () => ['merge', 'upgrade', 'recover', 'forward']
    }
  },
  data: () => ({
    ruleTypeMapping
  }),
  computed: {
    editAbleProps () {
      return {
        disabled: !!this.isEdit
      }
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
