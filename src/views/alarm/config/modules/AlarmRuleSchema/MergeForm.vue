<template>
  <fragment>
    <h3 class="title">告警合并</h3>
    <a-form-model-item
      v-bind="formItemLayout"
      label="合并方式"
      prop="merge.type"
      :rules="[{ required: true, message: '请选择合并方式' }]"
    >
      <a-select :disabled="!isEdit && !isAdd" v-model="_formModel.merge.type">
        <a-select-option value="count">次数</a-select-option>
        <a-select-option value="time">时间</a-select-option>
      </a-select>
    </a-form-model-item>

    <!-- TODO: integer format -->
    <!-- https://github.com/ant-design/ant-design/issues/14284 -->
    <a-form-model-item
      v-bind="formItemLayout"
      :label="useTime ? '合并时间' : '最大合并次数'"
      prop="merge.number"
      :rules="[{ required: true, message: useTime ? '请输入合并时间' : '请输入最大合并次数' }]"
    >
      <a-input
        :disabled="!isEdit && !isAdd"
        :min="1"
        :suffix="useTime ? '分钟' : '次'"
        type="number"
        v-model.number="formModel.merge.number"
      />
    </a-form-model-item>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
import { CONTENT_TYPE_TIME } from './model'

export default {
  name: 'MergeForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({}),
  computed: {
    useTime () {
      return this._formModel.merge.type === CONTENT_TYPE_TIME
    }
  },
  methods: {}
}
</script>

<style lang="less">
</style>
