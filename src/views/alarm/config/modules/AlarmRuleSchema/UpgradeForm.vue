<template>
  <fragment>
    <h3 class="title">告警升级</h3>
    <a-form-model-item label="升级方式" v-bind="formItemLayout" prop="type">
      <a-select v-model="_formModel.content.type">
        <a-select-option value="count">次数</a-select-option>
        <a-select-option value="time">时间</a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item :label="useTime ? '升级时间时间' : '升级周期'" v-bind="formItemLayout" prop="number">
      <a-input
        :min="1"
        :suffix="useTime ? '次' : '分钟'"
        type="number"
        v-model.number="_formModel.content.number"
      />
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
import { mergeFormRules } from './MergeForm'

export const upgradeFormRules = {
  ...mergeFormRules,
  type: [
    { required: true, message: '请选择升级方式' }
  ]
}

export default {
  name: 'UpgradeForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
