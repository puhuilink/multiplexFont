<template>
  <a-modal
    centered
    :title="title"
    :width="720"
    v-model="visible"
    :afterClose="reset"
    class="NoticeSchema__modal"
  >
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select v-model="formModel.enabled" class="enabled" style="margin-left: 20px; width: 80px">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="handleSubmit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">
      <a-form-model-item
        label="巡更通知模板名称"
        v-bind="formItemLayout"
        prop="title"
      >
        <a-input v-model.trim="formModel.title" />
      </a-form-model-item>
      <a-form-model-item label="通知方式" v-bind="formItemLayout" prop="type" :disabled="disabled">
        <a-select v-model="formModel.type" class="fw">
          <a-select-option v-for="(label, value) in allMode" :key="value" :value="value">{{ label }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="邮件标题" v-if="formModel.type==='EMAIL'" v-bind="formItemLayout" prop="subject">
        <a-input v-model.trim="formModel.subject" />
      </a-form-model-item>
      <a-form-model-item label="模板内容" v-bind="formItemLayout" prop="message">
        <TempEditor ref="editor" v-model="formModel.message" :mapping="mapping"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { GroupService } from '@/api'
import Schema from '~~~/Mixins/Modal/Schema'
import TempEditor from '@/components/Temp/TempEditor'
import { SEND_TYPE_MAPPING, TEMP_PATROL_MAPPING } from '@/tables/alarm_temp/types'
import { Editor } from 'tiptap'
import { Mention } from 'tiptap-extensions'
import { MessageModel } from '~~~/Temp/model'
import { PatrolTemplateService } from '@/api/service/PatrolTemplateService'
import { PatrolModel } from '../module/model'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export default {
  name: 'NoticeSchema',
  components: {
    TempEditor
  },
  mixins: [Schema],
  props: {},
  data: (vm) => ({
    allMode: Object.freeze(Object.fromEntries(SEND_TYPE_MAPPING)),
    disabled: false,
    title: '新增巡更通知模板',
    tempKeywordList: Object.freeze(
      Object.fromEntries(TEMP_PATROL_MAPPING)
    ),
    mapping: TEMP_PATROL_MAPPING,
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    editor: new Editor({
      extensions: [
        new Mention({
          // TODO: label @ 符号
          items: () => [...TEMP_PATROL_MAPPING].map(([id, name]) => ({ id, name }))
        })
      ],
      content: '',
      onUpdate: ({ getJSON }) => {
        vm.$emit('input', MessageModel.serialize(getJSON()), vm.singleLine)
        // TODO: trigger input event and validator
        // TODO: singleLine 禁止换行
      }
    }),
    formModel: { enabled: 1 },
    spinning: false,
    submitLoading: false
  }),
  methods: {
    add () {
      this.show('新建巡更规则模板')
      this.disabled = false
      this.submit = this.insert
    },
    edit (id) {
      this.show('编辑巡更规则模板')
      this.disabled = true
      this.fetch(id)
      this.submit = this.update
    },
    async fetch (id) {
      try {
        this.spinning = true
        const { data: { data } } = await PatrolTemplateService.find({
          where: {
            ...generateQuery({ id: id }, true)
          },
          fields: [ 'id', 'title', 'type', 'subject', 'message', 'enabled ' ],
          alias: 'data'
        })
        this.formModel = PatrolModel.deSerialize(_.first(data))
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async update () {
      try {
        this.submitLoading = true
        this.spinning = true
        const { code, msg } = await PatrolTemplateService.update(PatrolModel.serialize(this.formModel))
        if (Number(code) === 200) {
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.submitLoading = false
        this.spinning = true
      }
    },
    async insert () {
      try {
        this.spinning = true
        const { msg, code } = await PatrolTemplateService.insert(PatrolModel.serialize(this.formModel))
        if (Number(code) === 200) {
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } else {
          this.$notifyError(msg)
        }
      } catch (e) {
        this.$notifyError()
      } finally {
        this.spinning = false
      }
    },
    handleSubmit () {
      this.$refs.ruleForm.validate((passValidate) => passValidate && this.submit())
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    toggleSMS (e) {
      this.send.hasEnabledSMS = e
    },
    toggleEmail (e) {
      this.send.hasEnabledEmail = e
    },
    async getGroup () {
      const { data: { GroupList } } = await GroupService.find({
        where: {
          is_patrol: { _eq: true }
        },
        fields: [
          'is_patrol',
          'group_id',
          'group_name'
        ],
        alias: 'GroupList'
      })
      this.groupList = GroupList
    }
  },
  computed: {
    formRules () {
      const subject = this.formModel.type === 'EMAIL' ? {} : { subject: [
        { required: true, message: '请输入模板名称' },
        { max: 100, message: '最多输入100个字符' },
        { pattern: /^[\\Sa-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '仅支持中英文、数字与下划线' }
      ] }
      return {
        title: [
          { required: true, message: '请输入模板名称' },
          { max: 50, message: '最多输入50个字符' },
          { pattern: /^[\\Sa-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '仅支持中英文、数字与下划线' }
        ],
        event_level: [{ required: true, message: '请选择事件等级' }],
        message: [
          { required: true, message: '请输入模板内容' },
          { max: 255, message: '最多输入255个字符' }
        ],
        type: [{ required: true, message: '请选择通知方式' }],
        ...subject
      }
    }
  }
}
</script>

<style scoped>
.NoticeSchema__modal {
  .content {
    margin-top: 24px;
  }

  .enabled {
    margin-left: 20px;
    width: 80px;
  }

  .p {
    text-align: center;
  }
}
</style>
