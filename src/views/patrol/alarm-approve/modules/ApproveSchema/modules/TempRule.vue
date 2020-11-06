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
    <template slot="footer">

      <span>生效方式：</span>
      <a-radio-group v-model="enabledType">
        <a-radio :value="ENABLED_TYPE_TEMPORARY">仅本次生效</a-radio>
        <a-tooltip>
          <span slot="title">修改模板规则仅本次生效，下次使用依然使用默认模板</span>
          <a-icon type="info-circle" class="TemporaryApproveRule__icon_info" />
        </a-tooltip>
        <a-radio :value="ENABLED_TYPE_PERSISTENT">永久生效</a-radio>
        <a-tooltip>
          <span slot="title">保存本次修改为默认模板永久生效</span>
          <a-icon type="info-circle" class="TemporaryApproveRule__icon_info" />
        </a-tooltip>
      </a-radio-group>

      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">保存</a-button>

    </template>

    <a-spin :spinning="spinning">
      <a-form-model :model="formModel" ref="ruleForm" layout="vertical">
        <div
          class="TemporaryApproveRule__level"
          v-for="(senderConfig, index) in formModel.senderConfig"
          :key="index"
        >
          <a-row class="ant-form-model-item">

            <a-col v-bind="formItemLayout.labelCol">
              <span class="ant-form-model-item-label">
                <label title="告警级别">告警级别 </label>{{ `L${senderConfig.event_level}` }}
              </span>
            </a-col>

            <a-col v-bind="formItemLayout.wrapperCol">
              <a-row>
                <a-col :span="16">
                  <a-form-model-item
                    label="通知方式"
                    :prop="`senderConfig.${index}.send_type`"
                    :rules="{ required: true, message: '请至少选择一种通知方式' }"
                    :labelCol="{ span: 6 }"
                  >
                    <a-checkbox-group v-model="senderConfig.send_type">
                      <a-checkbox
                        v-for="[value, label] in SEND_TYPE_LIST"
                        :key="value"
                        :value="value"
                      >{{ label }}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-model-item>
                </a-col>

              </a-row>
            </a-col>

          </a-row>

          <a-row class="ant-form-model-item">

            <a-col v-bind="formItemLayout.labelCol">
              <span class="ant-form-model-item-label">
                <label title="通知用户">通知用户</label>
              </span>
            </a-col>

            <a-col v-bind="formItemLayout.wrapperCol">
              <a-row>
                <a-col :span="16">
                  <a-form-model-item
                    class="fw"
                    :prop="`senderConfig.${index}.userList`"
                    v-bind="{ labelCol: { span: 1 }, wrapperCol: { offset:1, span: 22 } }"
                  >
                    <a-select
                      allowClear
                      class="fw"
                      :filterOption="filterOption"
                      mode="tags"
                      showSearch
                      v-model="senderConfig.userList"
                    >
                      <a-select-option
                        v-for="user in userList"
                        :key="user.user_id"
                        :value="user.user_id"
                      >{{ user.staff_name }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="8">
                  <a-form-model-item
                    label="自动发送"
                    :prop="`senderConfig.${index}.auto_send`"
                    v-bind="{ labelCol: { span: 10 }, wrapperCol: { offset:1, span: 4 } }"
                  >
                    <a-checkbox v-model="senderConfig.auto_send" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>

          </a-row>

          <a-divider dashed />

        </div>

        <template v-if="useEmail">
          <a-form-model-item
            label="邮箱主题"
            :prop="`emailTemp.subject`"
            :rules="{ required: true, message: '请填写邮箱主题' }"
            v-bind="formItemLayout"
          >
            <TempEditor
              ref="emailEditor"
              singleLine
              v-model="formModel.emailTemp.subject"
            />
          </a-form-model-item>

          <a-form-model-item
            label="邮箱通知模板"
            :prop="`emailTemp.subject`"
            :rules="{ required: true, message: '请填写邮箱通知模板' }"
            v-bind="formItemLayout"
          >
            <TempEditor ref="emailEditor" v-model="formModel.emailTemp.message" />
          </a-form-model-item>
        </template>

        <template v-if="useSms">
          <a-form-model-item
            label="短信通知模板"
            :prop="`smsTemp.message`"
            :rules="{ required: true, message: '请填写短信通知模板' }"
            v-bind="formItemLayout"
          >
            <TempEditor ref="smsEditor" v-model="formModel.smsTemp.message" />
          </a-form-model-item>
        </template>

      </a-form-model>
    </a-spin>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempEditor from '@/components/Temp/TempEditor'
import { UserService } from '@/api'
import { filterOption } from '@/utils/util'
import { SEND_TYPE_EMAIL, SEND_TYPE_SMS, SEND_TYPE_LIST } from '@/composables/alarm-temp/types'

const ENABLED_TYPE_TEMPORARY = 'temporary'
const ENABLED_TYPE_PERSISTENT = 'persistent'

export default {
  name: 'TempRule',
  mixins: [Schema],
  components: {
    TempEditor
  },
  data: () => ({
    ENABLED_TYPE_TEMPORARY,
    ENABLED_TYPE_PERSISTENT,
    SEND_TYPE_EMAIL,
    SEND_TYPE_SMS,
    SEND_TYPE_LIST,
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
    formModel: {},
    // L2, L3, L4, L5
    senderConfig: [{}, {}, {}, {}],
    tempConfig: [],
    spinning: false,
    submitLoading: false,
    userList: []
  }),
  computed: {
    useEmail () {
      const { senderConfig = [] } = this.formModel
      return senderConfig
        .map(({ send_type }) => send_type)
        .flat()
        .includes(SEND_TYPE_EMAIL)
    },
    useSms () {
      const { senderConfig = [] } = this.formModel
      return senderConfig
        .map(({ send_type }) => send_type)
        .flat()
        .includes(SEND_TYPE_SMS)
    }
  },
  methods: {
    filterOption,
    async fetchUserList () {
      try {
        // TODO: 仅查询当前巡更组下的用户
        const { data: { userList } } = await UserService.find({
          fields: ['staff_name', 'user_id'],
          alias: 'userList'
        })
        this.userList = userList
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    async open ({ senderConfig = [], tempConfig = [] }) {
      this.show('告警审批规则')
      this.submit = this.save
      try {
        this.spinning = true
        this.senderConfig = senderConfig.map(({ userList, ...rest }) => ({
          userList: userList.map(({ user_id }) => user_id),
          ...rest
        }))
        const emailTemp = tempConfig.find(({ mode }) => mode === SEND_TYPE_EMAIL) || {}
        const smsTemp = tempConfig.find(({ mode }) => mode === SEND_TYPE_SMS) || {}
        this.formModel = {
          senderConfig: this.senderConfig,
          emailTemp,
          smsTemp
        }
        await this.fetchUserList()
      } catch (e) {
        throw e
      } finally {
        this.spinning = false
      }
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      this.$refs.emailEditor.resetContent()
      this.$refs.smsEditor.resetContent()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    save () {
      this.$refs.ruleForm.validate(async isValid => {
        if (!isValid) return
        // TODO: validator and scroll
        try {
          this.submitLoading = true
          if (this.enabledType === ENABLED_TYPE_PERSISTENT) {
            // TODO: service api
            // this.$emit('update', {})
          } else {
            this.$emit('update', { senderConfig: [] })
          }
        } catch (e) {
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
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
