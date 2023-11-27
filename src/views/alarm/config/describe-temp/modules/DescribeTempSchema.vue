<template>
  <a-modal
    centered
    :title="title"
    :width="720"
    wrapClassName="DescribeTempSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select v-model="formModel.enabled" class="enabled">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button :loading="submitLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">
      <a-form-model>
        <a-form-model-item label="告警描述模板名称" v-bind="formItemLayout" prop="title">
          <a-input v-model.trim="formModel.title" />
        </a-form-model-item>

        <a-form-model-item label="数据域" v-bind="formItemLayout" prop="title">
          <a-input v-model.trim="formModel.title" />
        </a-form-model-item>

        <CombineSelect v-bind="formItemLayout" />

        <a-form-model-item label="触发条件" v-bind="formItemLayout" prop="title">
          <ThresholdConditionSelect />
        </a-form-model-item>

        <a-form-model-item label="告警描述模板" v-bind="formItemLayout" prop="message">
          <TempEditor ref="editor" v-model="formModel.message" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>

  </a-modal>
</template>

<script>
import TempEditor from '@/components/Temp/TempEditor'
import Schema from '@/components/Mixins/Modal/Schema'
import { CombineSelect } from '@/components/Resource'
import { ThresholdConditionSelect } from '~~~/Alarm/Threshold'

export default {
  name: 'DescribeTempSchema',
  mixins: [Schema],
  components: {
    CombineSelect,
    TempEditor,
    ThresholdConditionSelect
  },
  props: {},
  data: () => ({
    formModel: {},
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    spinning: false,
    submitLoading: false
  }),
  computed: {},
  methods: {
    add () {
      this.show('新建自定义模板')
    },
    /**
     * @param {Boolean} global 全局 / 自定义模版
     */
    edit (global) {
      this.show(`编辑${global ? '全局' : '自定义'}模板`)
    }
  }
}
</script>

<style lang="less">

</style>
