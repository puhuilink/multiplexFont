<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="UserGroupSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    :rowKey="record => record.group_id"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-transfer
      :dataSource="groupList"
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

const groupList = gql`query groupList {
  data: t_group {
    key: group_id
    title: group_name
    group_id
    group_name
  }
}`

const userGroupList = gql`query groupList($userId: String) {
  data: t_user_group(where: {user_id: {_eq: $userId}}) {
    group_id
  }
}
`

const allocateUserGroup = gql`mutation allocateUserGroup ($userId: String!, $objects: [t_user_group_insert_input!]! = []) {
  # 批量删除旧分组
  delete_t_user_group (where: {user_id: {_eq: $userId}}) {
    affected_rows
  }
  # 批量插入新分组
  insert_t_user_group (objects:$objects) {
    affected_rows
  }
}`

export default {
  name: 'UserGroupSchema',
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    loading: false,
    record: null,
    title: '',
    visible: false,
    // 所有数据
    groupList: [],
    // 选中数据
    targetKeys: []
  }),
  mounted () {
    // this.getMock()
  },
  methods: {
    /**
     * 获取所有用户组
     * @return {Promise<Undefined>}
     */
    async getAllGroupList () {
      try {
        const { data } = await apollo.clients.alert.query({ query: groupList }).then(r => r.data)
        this.groupList = data
      } catch (e) {
        this.groupList = []
        throw e
      }
    },
    async getCurrentGroupList (userId) {
      try {
        const { data } = await apollo.clients.alert.query({ query: userGroupList, variables: { userId } }).then(r => r.data)
        this.targetKeys = data.map(e => e.group_id)
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
      this.getAllGroupList()
      this.getCurrentGroupList(record.user_id)
      this.title = '分配工作组'
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
        const userId = this.record.user_id
        const objects = this.targetKeys.map(groupId => ({
          user_id: userId,
          group_id: groupId,
          // 1为非管理员，2为管理员
          user_role: '1'
        }))
        await apollo.clients.alert.mutate({
          mutation: allocateUserGroup,
          variables: {
            userId,
            objects
          }
        })
        // TODO: toast
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
  .UserGroupSchema__modal {
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
