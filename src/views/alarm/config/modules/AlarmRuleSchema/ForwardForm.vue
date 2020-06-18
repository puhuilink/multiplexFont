<template>
  <fragment>
    <h3 class="title">告警通知</h3>
    <a-card>
      <a-icon class="fr" type="close-circle" />
      <a-form-model-item label="通知等级" v-bind="formItemLayout">
        <a-select>
          <a-select-option value="first">一级</a-select-option>
          <a-select-option value="second">二级</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="前转用户" v-bind="formItemLayout">
        <a-select
          allowClear
          :filterOption="filterOption"
          mode="multiple"
          :notFoundContent="userListLoading ? '加载中...' : '暂无数据'"
          showSearch
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

    <a-button type="primary">添加+</a-button>
  </fragment>
</template>

<script>
import Mixin from './Mixin'
import { AlarmTempService, UserService } from '@/api-hasura'
import { filterOption } from '@/utils/util'

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
  computed: {},
  methods: {
    async fetchUserList () {
      try {
        this.userListLoading = true
        const { data: { userList } } = await UserService
          .find({
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
    filterOption
  },
  created () {
    this.fetchUserList()
    this.fetchForwardTempList()
  }
}
</script>

<style lang="less">

</style>
