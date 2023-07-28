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
    okText="提交"
    @ok="submit"
    cancelText="取消"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="record" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="角色名称" prop="name">
        <a-input style="width: 60%" v-model="record.name" disabled/>
      </a-form-model-item>
      <a-form-model-item label="分配" prop="remark">
        <a-transfer
          v-if="visible"
          :dataSource="groupList"
          showSearch
          :filterOption="filterOption"
          :targetKeys="targetKeys"
          @change="handleChange"
          @search="handleSearch"
          :render="(item) => item.title"
        >
        </a-transfer>
      </a-form-model-item>
    </a-form-model>

  </a-modal>
</template>

<script>
import { filterTransferOption } from '@/utils/util'
import { GroupService, RoleService, UserGroupService } from '@/api'
import { GROUP_FLAG } from '@/tables/group/enum'
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'UserGroupSchema',
  mixins: [Schema],
  data: (vm) => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    activeTabKey: '1',
    loading: false,
    record: null,
    // 所有数据
    groupList: [],
    // 选中数据
    targetKeys: [],
    rules: {
      name: [
        { required: true }
      ]
    },
    originalForm: {
      name: ''
    }
  }),
  methods: {
    /**
     * 获取所有用户组
     * @return {Promise<Undefined>}
     */
    async getAllUser () {
      try {
        const { list } = await RoleService.getUser()
        this.groupList = list.map((el) => {
          return {
            key: el.id,
            title: el.staffName
          }
        })
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
      this.show('分配用户')
      this.record = Object.assign({}, record)
      const that = this
      RoleService.getUser(record.id).then((r) => {
        const { list } = r
        const arr = list.map(l => l.id)
        that.targetKeys = arr
      })
      this.submit = this.allocateUserGroups
      this.getAllUser()
      // this.getCurrentGroupList(record.user_id)
    },
    async allocateUserGroups () {
      try {
        this.loading = true
        const roleId = this.record.id
        await RoleService.assignment(roleId, this.targetKeys)
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
