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
    :rowKey="(record) => record.group_id"
    okText="保存"
    @ok="submit"
  >
    <a-transfer
      v-if="visible"
      :dataSource="userList"
      showSearch
      :titles="['未分配用户', '已分配用户']"
      :filterOption="filterOption"
      :targetKeys="targetKeys"
      @change="handleChange"
      @search="handleSearch"
      :render="(item) => item.title"
    >
    </a-transfer>
  </a-modal>
</template>

<script>
import { filterTransferOption } from '@/utils/util'
import { UserService, UserGroupService } from '@/api'
import { Schema } from '@/components/Mixins'
import { USER_FLAG } from '@/tables/user/enum'

export default {
  name: 'GroupUserSchema',
  mixins: [Schema],
  data: (vm) => ({
    loading: false,
    record: null,
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
        const {
          data: { userList }
        } = await UserService.find({
          fields: ['key: user_id', 'title: staff_name', 'flag'],
          alias: 'userList'
        })

        console.log('userList', userList)
        this.userList = userList.map((el) => ({
          ...el,
          disabled: el.flag === USER_FLAG.disabled
        }))
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    async getCurrentUserList (group_id) {
      try {
        const {
          data: { userGroupList }
        } = await UserGroupService.find({
          where: { group_id },
          fields: ['user_id'],
          alias: 'userGroupList'
        })
        this.targetKeys = userGroupList.map((e) => e.user_id)
      } catch (e) {
        this.targetKeys = []
        throw e
      }
    },
    filterOption: filterTransferOption('title'),
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {},
    edit (record) {
      this.show('设置用户')
      this.record = Object.assign({}, record)
      this.submit = this.allocateGroupUsers
      this.getAllUserList()
      this.getCurrentUserList(record.group_id)
    },
    async allocateGroupUsers () {
      try {
        this.loading = true
        const groupId = this.record.group_id
        const userIds = this.targetKeys
        await UserGroupService.allocateGroupUsers(groupId, userIds)
        this.$notification.success({
          message: '系统提示',
          description: '分配用户成功'
        })
        this.$emit('editSuccess')
        this.cancel()
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
