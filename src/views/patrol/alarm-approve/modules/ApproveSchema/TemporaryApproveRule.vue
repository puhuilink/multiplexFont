<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="640"
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
      <a-button @click="submit" type="primary">发送</a-button>
    </template>

    <a-form-model :form="form" ref="ruleForm" layout="vertical">
      <div
        class="TemporaryApproveRule__level"
        v-for="(sender, index) in senderConfig"
        :key="index"
      >
        <a-row class="ant-form-item">

          <a-col v-bind="formItemLayout.labelCol">
            <span class="ant-form-item-label">
              <label title="告警级别">告警级别</label>{{ `L${sender.event_level}` }}
            </span>
          </a-col>

          <a-col v-bind="formItemLayout.wrapperCol">
            <a-row>
              <a-col :span="4">
                <span class="ant-form-item-label">
                  <label title="通知方式">通知方式</label>
                </span>
              </a-col>

              <a-col :span="6">
                <a-form-model-item label="邮箱" v-bind="nestedFormItemLayout">
                  <a-checkbox />
                </a-form-model-item>
              </a-col>

              <a-col :span="6">
                <a-form-model-item label="短信" v-bind="nestedFormItemLayout">
                  <a-checkbox />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>

        </a-row>

        <a-row class="ant-form-item">

          <a-col v-bind="formItemLayout.labelCol">
            <span class="ant-form-item-label">
              <label title="通知用户">通知用户</label>
            </span>
          </a-col>

          <a-col v-bind="formItemLayout.wrapperCol">
            <a-row>
              <a-col :span="14">
                <a-form-model-item v-bind="nestedFormItemLayout" class="fw">
                  <a-select class="fw">
                    <a-select-option
                      v-for="user in userList"
                      :key="user.user_id"
                      :value="user.user_id"
                    >{{ user.staff_name }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="10">
                <a-form-model-item label="自动发送" v-bind="nestedFormItemLayout">
                  <a-checkbox />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>

        </a-row>

        <a-divider dashed />

      </div>

      <template v-if="useEmail">
        <a-form-model-item label="邮箱主题" v-bind="formItemLayout" prop="message">
          <TempEditor ref="emailEditor" />
        </a-form-model-item>

        <a-form-model-item label="邮箱通知模板" v-bind="formItemLayout" prop="message">
          <TempEditor ref="emailEditor" />
        </a-form-model-item>
      </template>

      <a-form-model-item label="短信通知模板" v-bind="formItemLayout" prop="message">
        <TempEditor ref="smsEditor" />
      </a-form-model-item>
    </a-form-model>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempEditor from '@/components/Temp/TempEditor'
import { UserService } from '@/api-hasura'

export default {
  name: 'TemporaryApproveRule',
  mixins: [Schema],
  components: {
    TempEditor
  },
  props: {
    senderConfig: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    formItemLayout: {
      // TODO: responsive
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    },
    nestedFormItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 16, offset: 1 }
    },
    userList: []
  }),
  computed: {
    ruleForm () {
      return {}
    },
    useEmail () {
      return true
    }
  },
  methods: {
    async fetchUserList () {
      try {
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
    open () {
      this.show('告警审批规则')
      this.fetchUserList()
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      this.$refs.emailEditor.resetContent()
      this.$refs.smsEditor.resetContent()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
.TemporaryApproveRule {
  &__level {
    // & > .ant-form-item.ant-row {
    .ant-form-item.ant-row {
      margin: 0;
      // padding: 8px 0;
    }

    .ant-divider {
      margin: 4px 0;
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
}
</style>
