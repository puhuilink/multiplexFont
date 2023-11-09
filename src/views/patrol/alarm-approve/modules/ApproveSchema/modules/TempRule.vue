<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="720"
    wrapClassName="TemporaryApproveRule__modal"
    @cancel="cancel"
    :afterClose="reset"
    @ok="submit"
  >
    <a-spin :spinning="spinning">
      <a-form-model :model="formModel" ref="formModel" :label-col="{ span: 5 }" :wrapper-col="{ span: 24 }" >
        <div
          v-for="(sender, index) in formModel.senderContent.sender"
          :key="index"
          style="background-color:rgba(246,246,246,0.9);">
          <a-row type="flex">
            <a-col :span="4" :offset="3" style="margin-top: 1.5%">
              <label >告警等级</label>{{ `L${sender.severity}` }}
              <a-tooltip style="margin-left: 2px">
                <span slot="title">L1(紧急告警)L2(主要告警)L3(次要告警)L4(一般告警)L5(告警)</span>
                <a-icon type="info-circle" class="TemporaryApproveRule__icon_info" />
              </a-tooltip>
            </a-col>
            <a-col :span="16" >
              <a-form-model-item
                label="通知方式"
                :rules="{ required: true, message: '请至少选择一种通知方式' }"
                v-bind="formItemLayout"
              >
                <a-checkbox-group
                  :options="plainOptions"
                  @change="e => sendChange(e, index)"
                  :default-value="sender.sendType | sendSwitchType"
                  style="margin-left: 2%"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-model-item
              :prop="`senderContent.sender[${index}].contact`"
              :rules="[{ required: true, message: '请选择通知用户' }]"
              v-bind="formItemLayout"
              label="通知用户"
            >
              <a-select
                style="width: 70%"
                mode="tags"
                placeholder="选择通知用户"
                :defaultValue="sender.contact"
                @change="e => contactChange(e, index)">
                <a-select-option
                  v-for="{value, label} in userList"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </a-select-option>
              </a-select>
              <a-checkbox style="margin-left: 2%" :defaultChecked="sender.auto" @change="e => autoChange(e, index)">自动发送</a-checkbox>
            </a-form-model-item>
          </a-row>
        </div>
        <a-row>
          <a-form-model-item
            label="邮件标题"
            v-bind="formItemLayout"
          >
            <a-input v-model.trim="formModel.senderContent.subject" />
          </a-form-model-item>
          <a-form-model-item
            label="邮件通知模板"
            v-bind="formItemLayout"
          >
            <TempEditor ref="editor" v-model="formModel.senderContent.emailMessage" :mapping="mapping"/>
          </a-form-model-item>
        </a-row>
        <a-row>
          <a-form-model-item
            label="短信通知模板"
            v-bind="formItemLayout"
            :prop="`senderContent.smsMessage`"
          >
            <TempEditor ref="editor" v-model="formModel.senderContent.smsMessage" :mapping="mapping"/>
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-spin>
    <template slot="footer">

      <span>生效方式：</span>
      <a-radio-group v-model="formModel.saveFlag" >
        <a-radio :value="ENABLED_TYPE_TEMPORARY">仅本次生效</a-radio>
        <a-tooltip>
          <span slot="title">修改模板规则仅本次生效，下次使用依然使用默认模板</span>
          <a-icon type="info-circle" class="TemporaryApproveRule__icon_info" />
        </a-tooltip>
        <a-radio :value="ENABLED_TYPE_PERSISTENT">永久生效</a-radio>
        <a-tooltip>
          <span slot="title">提交本次修改为默认模板永久生效</span>
          <a-icon type="info-circle" class="TemporaryApproveRule__icon_info" />
        </a-tooltip>
      </a-radio-group>

      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">提交</a-button>

    </template>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempEditor from '@/components/Temp/TempEditor'
import { SEND_TYPE_EMAIL, SEND_TYPE_SMS, SEND_TYPE_LIST, TEMP_PATROL_MAPPING } from '@/tables/alarm_temp/types'
import _ from 'lodash'
import { UserService, PatrolSenderService } from '@/api'
import { encrypt } from '@/utils/aes'
import { xungeng } from '@/utils/request'
const ENABLED_TYPE_TEMPORARY = 'ONCE'
const ENABLED_TYPE_PERSISTENT = 'EVER'
const EMAIL_METHOD = 'email'
const SMS_METHOD = 'sms'
const AUTO_SENDER = 'false'
const checkedList = ['邮箱', '短信']
const plainOptions = [
  { label: '邮箱', value: 'EMAIL' },
  { label: '短信', value: 'SMS' }
]

export default {
  name: 'TempRule',
  mixins: [Schema],
  components: {
    TempEditor
  },
  filters: {
    sendSwitchType: value => {
      switch (value) {
        case 'SMS': {
          return ['SMS']
        }
        case 'EMAIL': {
          return ['EMAIL']
        }
        case 'SMS/EMAIL': {
          return ['SMS', 'EMAIL']
        }
        default: return []
      }
    }
  },
  data: () => ({
    plainOptions,
    checkedList,
    AUTO_SENDER,
    SMS_METHOD,
    EMAIL_METHOD,
    ENABLED_TYPE_TEMPORARY,
    ENABLED_TYPE_PERSISTENT,
    SEND_TYPE_EMAIL,
    SEND_TYPE_SMS,
    SEND_TYPE_LIST,
    mapping: TEMP_PATROL_MAPPING,
    formItemLayout: {
      // TODO: responsive
      labelCol: {
        span: 4,
        push: 1
      },
      wrapperCol: {
        offset: 1,
        span: 17
      }
    },
    enabledType: ENABLED_TYPE_TEMPORARY,
    formModel: {
      saveFlag: ENABLED_TYPE_TEMPORARY,
      senderContent: {}
    },
    // L2, L3, L4, L5
    senderConfig: [{}, {}, {}, {}],
    tempConfig: [],
    spinning: false,
    submitLoading: false,
    userList: [],
    recive_msg: [],
    test: {}
  }),
  methods: {
    async open ({ senderConfig = [] }, eventsIds) {
      // 处理上个页面传递过来的数据，以告警等级聚合信息
      const [taskId, events] = senderConfig
      this.formModel.taskId = taskId
      this.formModel.eventIds = eventsIds
      this.recive_msg = _.sortBy(_.unionBy(events, 'severity'), item => item.severity)
      this.recive_msg = this.recive_msg.filter(el => {
        // _.includes(el, 'tempSmsId', 'tempEmailId')
        return 'tempSmsId' in el || 'tempEmailId' in el
      })
      this.recive_msg = await Promise.all(this.recive_msg.map(
        async (item) => {
          const { data: { data } } = await PatrolSenderService.find({
            where: {
              ...item.contact ? { contact: item.contact } : {}
            },
            fields: ['sendId: id'],
            alias: 'data'
          })
          item.id = _.first(data).sendId
          return item
        }
      ))
      this.formModel.senderContent.sender = this.recive_msg.map(el => {
        let sendType = ''
        if (el.tempSmsId) {
          sendType += 'SMS'
          if (el.tempEmailId) {
            sendType += '/EMAIL'
          }
        } else if (el.tempEmailId) {
          sendType += 'EMAIL'
        }
        return { contact: _.split(el.contact, '/'), id: el.id, auto: !!el.auto, sendType: sendType, severity: el.severity }
      })
      // 填充加载用户列表
      const { data } = await UserService.find({
        fields: [
          'label: staff_name',
          'value: user_id'
        ],
        data: 'userList'
      })
      this.userList = data.t_user
      this.show('巡更组审批模板')
      this.submit = this.save
    },
    autoChange (e, index) {
      const { auto, ...rest } = this.formModel.senderContent.sender[index]
      this.formModel.senderContent.sender.splice(index, 1, {
        ...rest,
        auto: e.target.checked
      })
    },
    sendChange (e, index) {
      const { sendType, ...rest } = this.formModel.senderContent.sender[index]
      const arr = this.formModel.senderContent.sender
      arr.splice(index, 1, {
        ...rest,
        sendType: _.join(e, '/')
      })
      this.formModel.senderContent.sender = arr
      this.$set(this.formModel.senderContent, 'sender', arr)
      this.$forceUpdate()
    },
    contactChange (e, item) {
      this.formModel.senderContent.sender[item].contact = _.join(e, '/')
    },
    save () {
      this.$refs.formModel.validate(async isValid => {
        if (!isValid) return
        // TODO: validator and scroll
        try {
          this.submitLoading = true
          const model = this.formModel
          model.senderContent.sender
            .map(el => {
              el.contact = encrypt(el.contact)
              return el
            }
            )
          const { code } = await xungeng.post('/approval/sendMessage', model)
          if (code === 200) {
            this.$notification.success({ message: '系统提示', description: '审批成功' })
            this.cancel()
            this.$emit('submit')
          }
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
  // computed: {
  //   useEmail () {
  //     console.log(123)
  //     return this.formModel.senderContent.sender
  //   },
  //   useSMS () {
  //     return this.formModel.senderContent.sender
  //       .map(el => this.$options.filters['sendSwitchType'](el.sendType))
  //       .flat()
  //       .includes('SMS')
  //   },
  //   testCom () {
  //     console.log('test发生改变')
  //     return this.test + '12'
  //   }
  // }
}
</script>

<style lang="less">
.TemporaryApproveRule {
  &__icon {
    &_info {
      margin-right: 8px;
      margin-left: -4px;
    }
  }

  &__level {
    & > .ant-row {
      margin-bottom: 0;
    }

    .ant-divider {
      margin-top: 0;
      margin-bottom: 24px;
    }
  }

  &__modal {
    .ant-modal-body {
      height:500px;
      overflow-y: auto;
    }
  }

}
</style>
