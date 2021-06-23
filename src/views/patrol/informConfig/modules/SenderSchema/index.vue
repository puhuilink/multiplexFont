<template>
  <a-modal
    centered
    :title="title"
    :width="500"
    wrapClassName="SenderSchema__modal"
    v-model="visible"
    :afterClose="reset"
    @cancel="cancel"
    @ok="submit"
  >
    <a-form-model
      class="SendForm"
      :model="send"
      ref="form"
    >
      <a-form-model-item
        label="告警等级"
        v-bind="formItemLayout"
        prop="severity"
        :rules="[
          { required: true, message: '请选择通知等级' },
        ]">
        <a-select
          class="SendForm__Select"
          v-model="send.severity"
          type="text"
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
        label="计划组"
        v-bind="formItemLayout"
        prop="groupId"
        :rules="[{ required: true, message: '请选择计划组' }]"
      >
        <a-select
          allowClear
          mode="default"
          showSearch
          class="item2"
          v-model="send.groupId"
          type="text"
        >
          <a-select-option
            v-for="{ groupId, group_name } in groupList"
            :key="groupId"
            :value="groupId">{{ group_name }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        label="通知人"
        prop="contact"
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
            type="String"
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
              <a-form-model-item label="短信模板" prop="tempSmsId" v-bind="nestedFormItemLayout">
                <a-select
                  class="item1"
                  allowClear
                  :disabled="!send.hasEnabledSMS"
                  type="String"
                  v-model="send.tempSmsId"
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
              <a-form-model-item label="邮箱模板" prop="tempEmailId" v-bind="nestedFormItemLayout">
                <a-select
                  class="item1"
                  allowClear
                  :disabled="!send.hasEnabledEmail"
                  type="String"
                  v-model="send.tempEmailId"
                >
                  <a-select-option v-for="{ id, title } in emailTempList" :key="id" :value="id">{{ title }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!-- / 底部按钮 -->
      <template slot="footer" >
        <a-form-model-item
          v-bind="formItemLayout"
          label="自动"
          class="footer"
        >
          <a-select v-model="send.auto" class="enabled" >
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-button @click="cancel">取消</a-button>
        <a-button @click="submit" :loading="btnLoading" type="primary">提交</a-button>
      </template>
    </a-form-model>
  </a-modal>
</template>

<script>
import {
  UserGroupService,
  GroupService,
  UserService,
  PatrolSenderService,
  PatrolTemplateService
} from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import { SEND_TYPE_EMAIL, SEND_TYPE_SMS } from '@/tables/alarm_temp/types'
import _ from 'lodash'
export default {
  name: 'SenderSchema',
  components: {},
  mixins: [ Schema ],
  data: () => ({
    TempList: [],
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
      groupId: '',
      severity: '',
      auto: true,
      hasEnabledSMS: false,
      hasEnabledEmail: false,
      tempEmailId: '',
      tempSmsId: '',
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
      if (e === false) {
        this.send.tempSmsId = ''
      }
    },
    toggleEmail (e) {
      this.send.hasEnabledEmail = e
      if (e === false) {
        this.send.tempEmailId = ''
      }
    },
    async getGroup () {
      const { data: { GroupList } } = await GroupService.find({
        where: {
          is_patrol: { _eq: true }
        },
        fields: [
          'groupId: group_id',
          'group_name'
        ],
        alias: 'GroupList'
      })
      this.groupList = GroupList
    },
    fetchFix () {
      // 巡更组
      this.getGroup()
      // 用户
      this.fetchUserList()
      // 巡更模板
      this.fetchPatrolTempList()
    },
    add () {
      this.show('新建巡更通知配置')
      this.fetchFix()
      this.submit = this.insert
    },
    async insert () {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        try {
          this.btnLoading = true
          // 新增用户
          const { msg, code } = await PatrolSenderService.insert(this.send)
          if (code === 200) {
            this.$emit('addSuccess')
            this.$notifyAddSuccess()
          }
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.btnLoading = false
          this.cancel()
        }
      })
    },
    edit (id) {
      this.fetchFix()
      this.fetch(id)
      this.show('编辑告警规则')
      this.submit = this.update
    },

    async fetch (id) {
      try {
        const { data: { model } } = await PatrolSenderService.find({
          where: { id: { _in: id } },
          fields: [ 'id', 'contact', 'groupId: group_id', 'severity', 'send_type', 'tempSmsId: temp_sms_id', 'tempEmailId: temp_email_id', 'auto' ],
          alias: 'model'
        })
        this.serializeModel(model[0])
      } catch (e) {
        this.$notifyError(e)
        throw e
      }
    },
    serializeModel (model) {
      this.send = {
        id: model.id,
        groupId: model.groupId,
        contact: _.split(model.contact, '/'),
        severity: model.severity,
        auto: model.auto,
        hasEnabledEmail: !_.includes(_.words(model.send_type, '/'), 'EMAIL'),
        hasEnabledSMS: !_.includes(_.words(model.send_type, '/'), 'SMS'),
        tempEmailId: model.tempEmailId,
        tempSmsId: model.tempSmsId
      }
    },
    async update () {
      try {
        this.btnLoading = true
        const { code, msg } = await PatrolSenderService.update(this.send)
        if (code === 200) {
          this.$emit('addSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } else {
          this.$notifyError(msg)
        }
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
        const groupCondition = this.send.groupId === '' ? {} : { group_id: { _eq: this.send.groupId } }
        const { data: { userList } } = await UserService.find({
          where: {
            flag: { _eq: 1 },
            ...groupCondition
          },
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
    async fetchPatrolTempList () {
      try {
        this.forwardTempListLoading = true
        const { data: { TempList } } = await PatrolTemplateService.find({
          where: {
            enabled: true
          },
          fields: ['id', 'title', 'message', 'type'],
          alias: 'TempList'
        })
        this.TempList = TempList
      } catch (e) {
        this.TempList = []
        throw e
      } finally {
        this.forwardTempListLoading = false
      }
    }
  },
  computed: {
    emailTempList () {
      return this.TempList.filter(({ type }) => type === SEND_TYPE_EMAIL)
    },
    smsTempList () {
      return this.TempList.filter(({ type }) => type === SEND_TYPE_SMS)
    }
  },
  watch: {
    'send.groupId': {
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
