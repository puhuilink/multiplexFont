<template>
  <fragment>
    <h3 class="title">告警升级</h3>
    <a-form-model-item
      v-bind="formItemLayout"
      label="升级方式"
      prop="upgrade.type"
      :rules="[
        { required: true, message: '请选择升级方式' }
      ]"
    >
      <a-select v-model="_formModel.upgrade.type">
        <a-select-option value="count">次数</a-select-option>
        <a-select-option value="time">时间</a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item
      v-bind="formItemLayout"
      :label="useTime ? '升级时间' : '升级次数'"
      prop="upgrade.number"
      :rules="[
        { required: true, message: useTime ? '请输入升级时间' : '请输入升级次数' }
      ]"
    >
      <a-input
        :min="1"
        :suffix="useTime ? '分钟' : '次'"
        type="number"
        v-model.number="_formModel.upgrade.number"
      />
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
import { CONTENT_TYPE_TIME } from './model'

export default {
  name: 'UpgradeForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {
    useTime () {
      return this._formModel.upgrade.type === CONTENT_TYPE_TIME
    }
  },
  methods: {}
}
</script>

<style lang="less">

</style>
