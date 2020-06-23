<template>
  <a-modal
    centered
    :title="title"
    :width="720"
    wrapClassName="ForwardTempSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select :value="~~formModel.enabled" class="enabled" @select="e => formModel.enabled = !!e">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="handleSubmit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">
        <a-form-model-item label="前转名称" v-bind="formItemLayout" prop="title">
          <a-input v-model.trim="formModel.title" />
        </a-form-model-item>

        <!-- <a-form-model-item label="事件等级" v-bind="formItemLayout" prop="event_level">
          <a-select v-model="formModel.event_level" class="fw">
            <a-select-option
              v-for="level in [1, 2, 3, 4, 5]"
              :key="level"
              :value="level"
            >{{ `${level}级` }}</a-select-option>
          </a-select>
        </a-form-model-item> -->

        <a-form-model-item label="前转模板" v-bind="formItemLayout" prop="message">
          <!-- TODO: 富文本编辑器 -->
          <!-- <a-textarea :autoSize="{ minRows: 2, maxRows: 6 }" v-model.trim="formModel.message" /> -->
          <Editor ref="editor" v-model="formModel.message" />
        </a-form-model-item>

        <a-form-model-item label="前转方式" v-bind="formItemLayout" prop="mode">
          <a-select v-model="formModel.mode" class="fw">
            <a-select-option
              v-for="(label, value) in allMode"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>

    </a-spin>

  </a-modal>
</template>

<script>
import { AlarmTempService } from '@/api-hasura/index'
import Schema from '@/components/Mixins/Modal/Schema'
import { modeTypeMapping, FORWARD_MODEL_EMAIL } from '../../typing'
import Editor from './Editor'

export default {
  name: 'ForwardTempSchema',
  mixins: [Schema],
  components: {
    Editor
  },
  props: {},
  data: () => ({
    allMode: Object.freeze(
      Object.fromEntries(modeTypeMapping)
    ),
    formModel: {
      enabled: 1
    },
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    spinning: false,
    submitLoading: false
  }),
  computed: {
    formRules () {
      const { mode = FORWARD_MODEL_EMAIL } = this.formModel
      const messageMax = mode === FORWARD_MODEL_EMAIL ? 255 : 128
      return {
        title: [
          { required: true, message: '请输入前转名称' },
          { max: 50, message: '最多输入50个字符' },
          { pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/, message: '仅支持中英文与数字' }
        ],
        event_level: [
          { required: true, message: '请选择事件等级' }
        ],
        message: [
          { required: true, message: '请输入模板内容' },
          { max: messageMax, message: `最多输入${messageMax}个字符` }
        ],
        mode: [
          { required: true, message: '请选择前转方式' }
        ]
      }
    }
  },
  methods: {
    add () {
      this.show('新建前转模板')
      this.submit = this.insert
    },
    edit (id) {
      this.fetch(id)
      this.show('编辑前转模板')
      this.submit = this.update
    },
    async fetch (id) {
      try {
        this.spinning = true
        this.formModel = await AlarmTempService.detail(id)
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(passValidate => passValidate && this.submit())
    },
    async insert () {
      try {
        this.submitLoading = true
        await AlarmTempService.add(this.model)
        this.$emit('addSuccess')
        this.notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.submitLoading = false
      }
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      this.$refs.editor.resetContent()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async update () {
      try {
        this.submitLoading = true
        await AlarmTempService.update(this.model)
        this.$emit('editSuccess')
        this.notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyEditSuccess(e)
        throw e
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.ForwardTempSchema__modal {
  .content {
    margin-top: 24px;
  }

  .enabled {
    width: 80px;
  }

  .p {
    text-align: center;
  }
}
</style>
