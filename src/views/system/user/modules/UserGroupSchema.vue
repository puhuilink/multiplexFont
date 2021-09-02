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
    :rowKey="(record) => record.group_id"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-transfer
      v-if="visible"
      :dataSource="groupList"
      showSearch
      :titles="['未分配工作组', '已分配工作组']"
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
import { GroupService, UserGroupService } from '@/api'
import { GROUP_FLAG } from '@/tables/group/enum'
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'UserGroupSchema',
  mixins: [Schema],
  data: (vm) => ({
    activeTabKey: '1',
    loading: false,
    record: null,
    // 所有数据
    groupList: [],
    // 选中数据
    targetKeys: []
  }),
  methods: {
    /**
     * 获取所有用户组
     * @return {Promise<Undefined>}
     */
    async getAllGroupList () {
      try {
        const {
          data: { groupList }
        } = await GroupService.find({
          fields: ['key: group_id', 'title: group_name', 'group_id', 'group_name', 'flag'],
          alias: 'groupList'
        })
        this.groupList = groupList.map((el) => ({
          ...el,
          disabled: el.flag !== GROUP_FLAG.enabled
        }))
      } catch (e) {
        this.groupList = []
        throw e
      }
    },
    async getCurrentGroupList (user_id) {
      try {
        const {
          data: { userGroupList }
        } = await UserGroupService.find({
          where: { user_id },
          fields: ['group_id'],
          alias: 'userGroupList'
        })
        this.targetKeys = userGroupList.map((e) => e.group_id)
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
    filterOption: filterTransferOption('group_name'),
    handleChange (targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleSearch (dir, value) {},
    edit (record) {
      this.show('分配工作组')
      this.record = Object.assign({}, record)
      this.submit = this.allocateUserGroups
      this.getAllGroupList()
      this.getCurrentGroupList(record.user_id)
    },
    async allocateUserGroups () {
      try {
        this.loading = true
        const userId = this.record.user_id
        const groupIds = this.targetKeys
        await UserGroupService.allocateUserGroups(userId, groupIds)
        this.$notification.success({
          message: '系统提示',
          description: '分配工作组成功'
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
.UserGroupSchema__modal {
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
