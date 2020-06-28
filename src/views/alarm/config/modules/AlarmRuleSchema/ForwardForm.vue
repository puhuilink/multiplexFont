<template>
  <div class="ForwardForm">
    <h3 class="title">告警通知</h3>
    <div class="ForwardForm__content" ref="content">
      <a-card v-for="(send, index) in formModel.sendList" :key="index">
        <a-icon class="ForwardForm__btn_remove" type="close-circle" @click="removeItem(index)" v-show="!onlyOneSendConfig" />
        <a-form-model-item label="通知等级" v-bind="formItemLayout">
          <a-select>
            <a-select-option v-for="level in [1, 2, 3, 4, 5]" :key="level" :value="level">{{ `${level}级` }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="通知用户" v-bind="formItemLayout">
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

        <a-form-model-item label="启用" v-bind="formItemLayout">
          <a-select>
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-card>
    </div>

    <a-button class="ForwardForm__btn_add" type="primary" @click="addItem">添加+</a-button>
  </div>
</template>

<script>
import Mixin from './Mixin'
import { AlarmTempService, UserService } from '@/api-hasura'
import { filterOption, scrollTo } from '@/utils/util'
import { SendModel } from './model'
import _ from 'lodash'

export const forwardFormRules = {}

export default {
  name: 'ForwardForm',
  mixins: [Mixin],
  components: {},
  props: {},
  data: () => ({
    forwardTempList: [],
    forwardTempListLoading: false,
    userList: [],
    userListLoading: false
  }),
  computed: {
    cmdbConfig () {
      return _.pick(this.formModel, ['host_id', 'endpoint_id', 'metric_id'])
    },
    onlyOneSendConfig () {
      const { sendList = [] } = this.formModel
      return sendList.length <= 1
    }
  },
  methods: {
    async addItem () {
      this.formModel.sendList.push(
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
          fields: ['id', 'title', 'message'],
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
      this.formModel.sendList.splice(index, 1)
    }
  },
  created () {
    this.fetchUserList()
    this.fetchForwardTempList()

    // if (_.isEmpty(this.formModel.sendList)) {
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
    height: 246px;
    overflow-y: scroll;

    .ant-card {
      margin-bottom: 4px;

      .ant-form-item {
        width: calc(100% - 20px);
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
