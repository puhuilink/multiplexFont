<template>
  <a-modal
    :afterClose="reset"
    centered
    :confirmLoading="loading"
    :title="title"
    :width="720"
    wrapClassName="GroupAdministratorSchema__modal"
    v-model="visible"
    @cancel="cancel"
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
      :render="(item) => item.user.staff_name"
    >
    </a-transfer>
  </a-modal>
</template>

<script>
import { filterTransferOption } from '@/utils/util'
import { UserGroupService } from '@/api'
import { Schema } from '@/components/Mixins'
import { USER_ROLE } from '@/tables/user_group/enum'
import _ from 'lodash'

export default {
  name: 'GroupAdministratorSchema',
  mixins: [Schema],
  data: (vm) => ({
    loading: false,
    record: null,
    userList: [],
    targetKeys: []
  }),
  methods: {
    async getCurrentUserListerList (group_id) {
      try {
        const {
          data: { userGroupList }
        } = await UserGroupService.find({
          where: { group_id },
          fields: ['key: user_id', 'title: user_id', 'user { staff_name }'],
          alias: 'userGroupList'
        })

        const userListNum = userGroupList.filter(({ user }) => !!user)
        this.userList = _.uniqBy(userListNum, (e) => e.key)
      } catch (e) {
        this.userList = []
        throw e
      }
    },
    async getCurrentAdminList (group_id) {
      try {
        const {
          data: { userGroupList }
        } = await UserGroupService.find({
          where: {
            group_id,
            user_role: USER_ROLE.administrator
          },
          fields: ['user_id'],
          alias: 'userGroupList'
        })
        const targetList = userGroupList.map((e) => e.user_id)
        this.targetKeys = [...new Set(targetList)]
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
    filterOption: filterTransferOption('staff_name'),
    handleChange (targetKeys, direction, moveKeys) {
      console.log('targetKeys', targetKeys)
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {},
    edit (record) {
      this.show('设置组管理员')
      this.record = Object.assign({}, record)
      this.getCurrentUserListerList(record.group_id)
      this.getCurrentAdminList(record.group_id)
      this.submit = this.allocateAdmin
    },
    async allocateAdmin () {
      console.log('targetKeys111', this.targetKeys)
      try {
        this.loading = true
        const groupId = this.record.group_id
        const userIds = this.targetKeys
        await UserGroupService.allocateAdmin(groupId, userIds)
        this.$notification.success({
          message: '系统提示',
          description: '分配组管理员成功'
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
.GroupAdministratorSchema__modal {
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
