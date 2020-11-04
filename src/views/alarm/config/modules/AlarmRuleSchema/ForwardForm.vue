<template>
  <div class="ForwardForm">
    <h3 class="title">告警通知</h3>
    <div class="ForwardForm__content" ref="content">
      <a-card v-for="(send, index) in formModel.forward.sendList" :key="index">
        <a-icon class="ForwardForm__btn_remove" type="close-circle" @click="removeItem(index)" v-show="!onlyOneSendConfig" />

        <a-form-model-item
          label="通知等级"
          v-bind="formItemLayout"
          :rules="[
            { required: true, message: '请选择通知等级' },
          ]">
          <a-select
            v-model="send.level"
          >
            <a-select-option
              v-for="[value, label] in levelList"
              :key="value"
              :value="value"
              :disabled="!!formModel.forward.sendList.find(({ level }) => level === value)"
            >
              {{ label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          label="通知用户"
          v-bind="formItemLayout"
          :rules="[
            { required: true, message: '请选择通知用户' },
          ]">
          <a-select
            allowClear
            :filterOption="filterOption"
            mode="multiple"
            :notFoundContent="userListLoading ? '加载中...' : '暂无数据'"
            showSearch
            v-model="send.contact"
          >
            <a-select-option
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
                  <a-checkbox :checked="send.hasEnabledSMS" @change="send.toggleSMS()" />
                </a-form-model-item>
              </a-col>
              <a-col :span="16">
                <a-form-model-item label="短信模板" v-bind="nestedFormItemLayout">
                  <a-select
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
                  <a-checkbox :checked="send.hasEnabledEmail" @change="send.toggleEmail()" />
                </a-form-model-item>
              </a-col>
              <a-col :span="16">
                <a-form-model-item label="邮箱模板" v-bind="nestedFormItemLayout">
                  <a-select
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

        <!-- <a-form-model-item label="启用" v-bind="formItemLayout">
          <a-select>
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-model-item> -->
      </a-card>
    </div>

    <a-button
      class="ForwardForm__btn_add"
      :disabled="formModel.forward.sendList.length >= 5"
      type="primary"
      @click="addItem">添加+</a-button>
  </div>
</template>

<script>
import Mixin from './Mixin'
import { AlarmTempService, UserService } from '@/api-hasura'
import { filterOption, scrollTo } from '@/utils/util'
import {
  SEND_TYPE_EMAIL,
  SEND_TYPE_SMS,
  SendModel
} from './model'
import _ from 'lodash'

export const forwardFormRules = {}

export default {
  name: 'ForwardForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
    SEND_TYPE_EMAIL,
    SEND_TYPE_SMS,
    levelList: [
      [1, '一级（紧急通知）'],
      [2, '二级（主要通知）'],
      [3, '三级（次要通知）'],
      [4, '四级（一般通知）'],
      [5, '五级（警告通知）']
    ],
    forwardTempList: [],
    forwardTempListLoading: false,
    nestedFormItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 16, offset: 1 }
    },
    userList: [],
    userListLoading: false
  }),
  computed: {
    cmdbConfig () {
      return _.pick(this.formModel, ['host_id', 'endpoint_id', 'metric_id'])
    },
    emailTempList () {
      return this.forwardTempList.filter(({ mode }) => mode === SEND_TYPE_EMAIL)
    },
    smsTempList () {
      return this.forwardTempList.filter(({ mode }) => mode === SEND_TYPE_SMS)
    },
    onlyOneSendConfig () {
      return this.formModel.forward.sendList.length <= 1
    }
  },
  methods: {
    async addItem () {
      this.formModel.forward.sendList.push(
        new SendModel(this.cmdbConfig)
      )
      await this.$nextTick()
      scrollTo(this.$refs.content.scrollHeight, { getContainer: () => this.$refs.content })
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
        this.forwardTempLis = []
        throw e
      } finally {
        this.forwardTempListLoading = false
      }
    },
    filterOption,
    removeItem (index) {
      this.formModel.forward.sendList.splice(index, 1)
    }
  },
  created () {
    this.fetchUserList()
    this.fetchForwardTempList()

    // if (_.isEmpty(this.formModel.forward.sendList)) {
    //   this.addItem()
    // }
  }
}
</script>

<style lang="less">
.ForwardForm {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-items: center;
  align-items: center;

  &__content {
    width: 100%;
    height: 340px;
    overflow-y: scroll;

    .ant-card {
      margin-bottom: 4px;

      .ant-card-body {
        & > .ant-form-item {
          width: calc(100% - 20px);
        }
      }

    }
  }

  &__btn {
    &_remove {
      float: right;
    }

    &_add {
      transform: translateY(10px);
    }
  }
}
</style>
