<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="GroupAdministratorSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    :rowKey="record => `${record.user_id}${record.user.staff_name}`"
    okText="保存"
    @ok="submit"
  >
    <a-transfer
      :dataSource="userList"
      showSearch
      :filterOption="filterOption"
      :targetKeys="targetKeys"
      @change="handleChange"
      @search="handleSearch"
      :render="item => item.user.staff_name"
    >
    </a-transfer>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

// 组管理员必须是组内成员
const currentUserList = gql`query ($groupId: String) {
  data: t_user_group (where: {group_id: { _eq: $groupId }}) {
    key: user_id
    title: user_id
    user {
      staff_name
    }
  }
}`

const currentAdmin = gql`query ($groupId: String) {
  data: t_user_group (where: {_and: {group_id: {_eq: $groupId}, user_role: {_eq: "2"}}}) {
    user_id
  }
}`

const allocateAdmin = gql`mutation ($groupId: String, $userIds: [String!]) {
  # 全部取消管理员
  disenable: update_t_user_group(where: {group_id: {_eq: $groupId}}, _set: {user_role: "1"}) {
    affected_rows
  }
  # 设定管理员
  enable: update_t_user_group(where: {_and: {group_id: {_eq: $groupId}, user_id: {_in: $userIds}}}, _set: {user_role: "2"}) {
    affected_rows
  }
}
`

export default {
  name: 'GroupAdministratorSchema',
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    loading: false,
    record: null,
    title: '',
    visible: false,
    // 所有数据
    userList: [],
    // 选中数据
    targetKeys: []
  }),
  methods: {
    async getCurrentUserListerList (groupId) {
      try {
        const { data } = await apollo.clients.alert.query({
          query: currentUserList,
          variables: {
            groupId
          }
        })
        this.userList = data.data
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    async getCurrentAdminList (groupId) {
      try {
        const { data } = await apollo.clients.alert.query({
          query: currentAdmin,
          variables: {
            groupId
          }
        })
        this.targetKeys = data.data.map(e => e.user_id)
      } catch (e) {
        this.targetKeys = []
        throw e
      }
    },
    /**
       * 过滤条件
       * @param inputValue
       * @param option
       * @return {boolean}
       */
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      // console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    },
    edit (record) {
      this.title = '设置组管理员'
      this.visible = true
      this.record = {
        ...record
      }
      this.getCurrentUserListerList(record.group_id)
      this.getCurrentAdminList(record.group_id)
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async submit () {
      try {
        this.loading = true
        // TODO: 直接传一个 userId 与 groupIds, 字段拼接处理到 api / controller 层完成
        const groupId = this.record.group_id
        const userIds = this.targetKeys
        await apollo.clients.alert.mutate({
          mutation: allocateAdmin,
          variables: {
            groupId,
            userIds
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '分配组管理员成功'
        })
        this.$emit('editSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">
  .GroupAdministratorSchema__modal {
    .ant-modal-body {
      /*padding-top: 0;*/
      height: 508px;
    }
    .ant-transfer {
      display: flex;
      align-content: center;
      justify-content: center;
    }
    .ant-transfer-operation {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .ant-transfer-list {
      height: 400px;
      flex: 1;
    }
  }
</style>
