<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="GroupUserSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    :rowKey="record => record.group_id"
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
      :render="item => item.title"
    >
    </a-transfer>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { filterTransferOption } from '@/utils/util'

const userList = gql`query {
  data: t_user {
    key: user_id
    title: staff_name
  }
}`

const groupUserList = gql`query groupList($groupId: String) {
  data: t_user_group(where: {group_id: {_eq: $groupId}}) {
    user_id
  }
}`

// FIXME: 如果删除的用户同时是该组的管理员，管理员表也应该操作
const allocateGroupUser = gql`mutation allocateGroupUser ($groupId: String!, $objects: [t_user_group_insert_input!]! = []) {
  # 批量删除旧用户
  delete_t_user_group (where: {group_id: {_eq: $groupId}}) {
    affected_rows
  }
  # 批量插入新用户
  insert_t_user_group (objects:$objects) {
    affected_rows
  }
}`

export default {
  name: 'GroupUserSchema',
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
    /**
     * 获取所有用户组
     * @return {Promise<Undefined>}
     */
    async getAllUserList () {
      try {
        const { data } = await apollo.clients.alert.query({ query: userList }).then(r => r.data)
        this.userList = data
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    async getCurrentUserList (groupId) {
      try {
        const { data } = await apollo.clients.alert.query({ query: groupUserList, variables: { groupId } }).then(r => r.data)
        this.targetKeys = data.map(e => e.user_id)
      } catch (e) {
        this.targetKeys = []
        throw e
      }
    },
    filterOption: filterTransferOption('title'),
    handleChange (targetKeys, direction, moveKeys) {
      // console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {
      // console.log('search:', dir, value)
    },
    edit (record) {
      this.getAllUserList()
      // console.log(record)
      this.getCurrentUserList(record.group_id)
      this.title = '设置用户'
      this.record = {
        ...record
      }
      this.visible = true
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
        const objects = this.targetKeys.map(userId => ({
          user_id: userId,
          group_id: groupId,
          // 1为非管理员，2为管理员
          user_role: '1'
        }))
        // console.log(ob)
        await apollo.clients.alert.mutate({
          mutation: allocateGroupUser,
          variables: {
            groupId,
            objects
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '分配用户成功'
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
  .GroupUserSchema__modal {
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
