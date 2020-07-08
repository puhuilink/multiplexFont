<template>
  <fragment>
    <h3 class="title">告警合并</h3>
    <a-form-model-item label="合并方式" v-bind="formItemLayout" prop="type">
      <a-select v-model="_formModel.content.type">
        <a-select-option value="count">次数</a-select-option>
        <a-select-option value="time">时间</a-select-option>
      </a-select>
    </a-form-model-item>

    <!-- TODO: integer format -->
    <!-- https://github.com/ant-design/ant-design/issues/14284 -->
    <a-form-model-item :label="useTime ? '合并时间' : '最大合并次数'" v-bind="formItemLayout" prop="number">
      <a-input
        :min="1"
        :suffix="useTime ? '分钟' : '次'"
        type="number"
        v-model.number="formModel.content.number"
      />
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from './Mixin'

export const mergeFormRules = {
  type: [
    { required: true, message: '请选择合并方式' }
  ],
  number: [
    { required: true, message: '请输入合并时间' }
  ],
  count: [
    { required: true, message: '请输入最大合并时间' }
  ]
}

export default {
  name: 'MergeForm',
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
