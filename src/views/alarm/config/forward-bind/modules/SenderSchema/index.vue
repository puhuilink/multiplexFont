<template>
  <a-modal
    centered
    :title="title"
    :width="500"
    wrapClassName="SenderSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >
    <div
      class="SendForm"
      ref="content"
    >
      <a-form-model-item
        label="通知等级"
        v-bind="formItemLayout"
        :rules="[
          { required: true, message: '请选择通知等级' },
        ]">
        <a-select
          class="SendForm__Select"
          v-model="send.level"
          :disabled="levelBtn"
        >
          <a-select-option
            v-for="[value, label] in levelList"
            :key="value"
            :value="value"
          >
            {{ label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        label="通知组"
        v-bind="formItemLayout"
        :rules="[{ required: true, message: '请选择通知组' }]"
      >
        <a-select
          allowClear
          mode="default"
          showSearch
          class="item2"
          v-model="send.group"
          :disabled="groupBtn"
        >
          <a-select-option
            v-for="{ group_id, group_name } in groupList"
            :key="group_id"
            :value="group_id">{{ group_name }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        label="通知人"
        v-bind="formItemLayout"
        :rules="[{ required: true, message: '请选择通知组' }]"
      >
        <a-select
          class="item2"
          allowClear
          mode="multiple"
          showSearch
          v-model="send.contact"
        >
          <a-select-option
            class="item2"
            v-for="{ user_id, staff_name } in userList"
            :key="user_id"
            :value="user_id">{{ staff_name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-row class="ant-form-item">
        <a-col v-bind="formItemLayout.labelCol" class="ant-form-item-label">
          <label title="通知方式">通知方式</label>
        </a-col>

        <a-col v-bind="formItemLayout.wrapperCol">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="短信" v-bind="nestedFormItemLayout">
                <a-checkbox :checked="send.hasEnabledSMS" @input="toggleSMS"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <a-form-model-item label="短信模板" v-bind="nestedFormItemLayout">
                <a-select
                  class="item1"
                  allowClear
                  :disabled="!send.hasEnabledSMS"
                  v-model="send.temp_sms_id"
                >
                  <a-select-option v-for="{ id, title } in smsTempList" :key="id" :value="id">{{ title }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="8">
              <a-form-model-item label="邮箱" v-bind="nestedFormItemLayout">
                <a-checkbox :checked="send.hasEnabledEmail" @input="toggleEmail"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="16">
              <a-form-model-item label="邮箱模板" v-bind="nestedFormItemLayout">
                <a-select
                  class="item1"
                  allowClear
                  :disabled="!send.hasEnabledEmail"
                  v-model="send.temp_email_id"
                >
                  <a-select-option v-for="{ id, title } in emailTempList" :key="id" :value="id">{{ title }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <!-- / 底部按钮 -->
    <template slot="footer" >
      <a-form-model-item
        v-bind="formItemLayout"
        label="自动"
        class="footer"
        v-if="btnVisible"
      >
        <a-select v-model="send.auto" class="enabled" >
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="btnLoading" type="primary">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  UserGroupService,
  GroupService,
  AlarmRuleService,
  UserService,
  AlarmTempService,
  AlarmSenderService
} from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import { SEND_TYPE_EMAIL, SEND_TYPE_SMS } from '@/tables/alarm_temp/types'
import _ from 'lodash'
export default {
  name: 'SenderSchema',
  components: {},
  mixins: [ Schema ],
  data: () => ({
    groupBtn: false,
    levelBtn: false,
    forwardTempList: [],
    forwardTempListLoading: false,
    formModel: [
      { auto: false }
    ],
    nestedFormItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 16, offset: 1 }
    },
    levelList: [
      [1, '一级（紧急通知）'],
      [2, '二级（主要通知）'],
      [3, '三级（次要通知）'],
      [4, '四级（一般通知）']
    ],
    btnLoading: false,
    userList: [],
    groupList: [],
    title: '新增告警绑定',
    send: {
      group: '',
      level: '',
      auto: false,
      hasEnabledSMS: false,
      hasEnabledEmail: false,
      temp_email_id: '',
      temp_sms_id: '',
      contact: []
    },
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 17, offset: 1 }
    }
  }),
  methods: {
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
          is_patrol: { _eq: false }
        },
        fields: [
          'is_patrol',
          'group_id',
          'group_name'
        ],
        alias: 'GroupList'
      })
      this.groupList = GroupList
    },
    fetchFix () {
      this.fetchUserList()
      this.fetchForwardTempList()
      this.getGroup()
    },
    add () {
      this.show('新建告警通知绑定')
      this.fetchFix()
      this.submit = this.insert
    },
    async insert () {
      try {
        this.btnLoading = true
        // 新增用户
        await AlarmRuleService.addUser(this.send)
        this.$emit('addSuccess')
        this.$notifyAddSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    edit (id) {
      this.groupBtn = true
      this.levelBtn = true
      this.fetchFix()
      this.fetch(id)
      this.show('编辑告警规则')
      this.submit = this.update
    },
    async fetch (id) {
      try {
        const model = await AlarmSenderService.findByid(id)
        this.serializeModel(model)
      } catch (e) {
        this.$notifyError(e)
        throw e
      }
    },
    serializeModel (model) {
      this.send = {
        group: model.group_id,
        contact: _.split(model.contact, '/'),
        level: model.event_level,
        auto: model.auto,
        hasEnabledEmail: !_.includes(_.words(model.send_type, '/'), 'EMAIL'),
        hasEnabledSMS: !_.includes(_.words(model.send_type, '/'), 'SMS'),
        temp_email_id: model.temp_email_id,
        temp_sms_id: model.temp_sms_id
      }
    },
    async update () {
      try {
        this.btnLoading = true
        await AlarmSenderService.update(
          { contact: this.send.contact.join(''),
            temp_sms_id: this.send.temp_sms_id,
            temp_email_id: this.send.temp_email_id,
            auto: this.send.auto
          },
          { event_level: this.send.level })
        this.$emit('addSuccess')
        this.$notifyAddSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    async fetchUserList () {
      try {
        this.userListLoading = true
        const { data: { userList } } = await UserService.find({
          where: { flag: 1 },
          fields: ['user_id', 'staff_name'],
          alias: 'userList'
        })
        this.userList = userList
      } catch (e) {
        this.userList = []
        throw e
      } finally {
        this.userListLoading = false
      }
    },
    async fetchForwardTempList () {
      try {
        this.forwardTempListLoading = true
        const { data: { forwardTempList } } = await AlarmTempService.find({
          fields: ['id', 'title', 'message', 'mode'],
          alias: 'forwardTempList'
        })
        this.forwardTempList = forwardTempList
      } catch (e) {
        this.forwardTempList = []
        throw e
      } finally {
        this.forwardTempListLoading = false
      }
    }
  },
  computed: {
    emailTempList () {
      return this.forwardTempList.filter(({ mode }) => mode === SEND_TYPE_EMAIL)
    },
    smsTempList () {
      return this.forwardTempList.filter(({ mode }) => mode === SEND_TYPE_SMS)
    },
    btnVisible () {
      const group = this.groupList.filter(el => el.group_id === this.send.group)
      return _.includes(group.map(el => el.is_patrol), true)
    }
  },
  watch: {
    'send.group': {
      immediate: true,
      async handler (group) {
        this.userList = await UserGroupService.findUserByGroup(group)
        this.send.contact = this.send.contact.filter(el => _.includes(this.userList.map(el => el.user_id), el))
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
  .SenderSchema__modal {
    .SendForm {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-items: center;
      &__Select {
        width: 60%;
      }
      .item1{
        width: 60%;
      }
      .item2 {
        width: 60%;
      }
    }

    .footer {
      float: left;
    }

    .enabled {
      width: 100px;
    }
  }

</style>
