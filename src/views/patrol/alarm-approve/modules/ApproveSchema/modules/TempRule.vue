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
      修改后仅本次生效
      保存修改
      <!-- <a-button @click="editRule" class="fl">告警审批规则</a-button> -->
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">发送</a-button>
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
                <label title="告警级别">告警级别</label>{{ `L${senderConfig.event_level}` }}
              </span>
            </a-col>

            <a-col v-bind="formItemLayout.wrapperCol">
              <a-row>
                <a-col :span="4">
                  <span class="ant-form-model-item-label">
                    <label title="通知方式">通知方式</label>
                  </span>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item
                    :prop="`senderConfig.${index}.send_type`"
                    :rules="{ required: true, message: '请至少选择一种通知方式' }"
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
              class="TemporaryApproveRule__email_subject"
              ref="emailEditor"
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
import { UserService } from '@/api-hasura'
import { filterOption } from '@/utils/util'
import { SEND_TYPE_EMAIL, SEND_TYPE_SMS, SEND_TYPE_LIST } from '@/components/Temp/model'

export default {
  name: 'TempRule',
  mixins: [Schema],
  components: {
    TempEditor
  },
  data: () => ({
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
        try {
          this.submitLoading = true
          // TODO: senderConfig 出入参都是一样的格式，可以考虑选用 form-modal 而非 form
          this.$emit('updateSenderConfig', { senderConfig: [] })
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
  &__level {
    // FIXME: 预留 form-model-item help 空间
    // .ant-form-model-item.ant-row {
    //   margin: 0;
    // }

    & > .ant-row {
      margin-bottom: 0;
    }

    .ant-divider {
      // margin: 4px 0;
      margin-top: 0;
      margin-bottom: 24px;
    }
  }

  &__modal {
    .ant-modal-body {
      // padding-top: 0;
      // padding-bottom: 0;
      height:500px;
      overflow-y: auto;
    }
  }

  &__email {
    &_subject {
      .ProseMirror {
        // TODO: 禁止换行
        height: 40px;
      }
    }
  }
}
</style>
