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
      <a-button @click="submit" type="primary">发送</a-button>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" layout="vertical">
        <div
          class="TemporaryApproveRule__level"
          v-for="level in [2, 3, 4, 5]"
          :key="level"
        >
          <a-row class="ant-form-item">

            <a-col v-bind="formItemLayout.labelCol">
              <span class="ant-form-item-label">
                <label title="告警级别">告警级别</label>{{ `L${level}` }}
              </span>
            </a-col>

            <a-col v-bind="formItemLayout.wrapperCol">
              <a-row>
                <a-col :span="4">
                  <span class="ant-form-item-label">
                    <label title="通知方式">通知方式</label>
                  </span>
                </a-col>

                <a-col :span="12">
                  <a-form-item>
                    <a-checkbox-group
                      v-decorator="[`${level}send_type`, {
                        rules: [
                          {
                            required: true,
                            message: '请至少选择一种通知方式'
                          }
                        ]
                      }]"
                    >
                      <a-checkbox
                        v-for="[value, label] in SEND_TYPE_LIST"
                        :key="value"
                        :value="value"
                      >
                        {{ label }}
                      </a-checkbox>

                    </a-checkbox-group>
                  </a-form-item>
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
                <a-col :span="16">
                  <a-form-item class="fw" v-bind="{ labelCol: { span: 1 }, wrapperCol: { offset:1, span: 22 } }">
                    <a-select
                      allowClear
                      class="fw"
                      :filterOption="filterOption"
                      mode="tags"
                      showSearch
                      v-decorator="[`${level}contact`, {
                        rules: [
                          {
                            required: true,
                            message: '请选择用户'
                          }
                        ]
                      }]"
                    >
                      <a-select-option
                        v-for="user in userList"
                        :key="user.user_id"
                        :value="user.user_id"
                      >{{ user.staff_name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="自动发送" v-bind="{ labelCol: { span: 10 }, wrapperCol: { offset:1, span: 4 } }">
                    <a-checkbox />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>

          </a-row>

          <a-divider dashed />

        </div>

        <template v-if="useEmail">
          <a-form-item label="邮箱主题" v-bind="formItemLayout" prop="message">
            <TempEditor class="TemporaryApproveRule__email_subject" ref="emailEditor" />
          </a-form-item>

          <a-form-item label="邮箱通知模板" v-bind="formItemLayout" prop="message">
            <TempEditor ref="emailEditor" />
          </a-form-item>
        </template>

        <a-form-item label="短信通知模板" v-bind="formItemLayout" prop="message">
          <TempEditor ref="smsEditor" />
        </a-form-item>
      </a-form>
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
  name: 'TemporaryApproveRule',
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
    spinning: false,
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
    filterOption,
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
    async open (senderConfig = []) {
      this.show('告警审批规则')
      try {
        this.spinning = true
        await this.fetchUserList()
        await this.$nextTick()
        senderConfig
          .filter(({ event_level }) => [2, 3, 4, 5].includes(event_level))
          .forEach(({ event_level, userList, send_type }) => {
            this.form.setFieldsValue({
              [`${event_level}contact`]: userList.map(({ user_id }) => user_id),
              [`${event_level}send_type`]: send_type
            })
          })
      } catch (e) {
        throw e
      } finally {
        // TODO: TempEditor v-decorator / form-model ?
        // console.log(this.$refs.emailEditor.$refs)
        this.spinning = false
      }
    },
    reset () {
      this.form.resetFields()
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
    // FIXME: 预留 form-item help 空间
    // .ant-form-item.ant-row {
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
