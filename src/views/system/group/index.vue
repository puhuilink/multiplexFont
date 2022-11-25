<template>
  <div class="group">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="group_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="工作组编号" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.group_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="工作组名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.group_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item v-bind="formItemLayout" label="有效标识" class="fw">
                  <a-select allowClear defaultValue="1" v-model="queryParams.flag" placeholder="请选择">
                    <a-select-option :value="1">有效</a-select-option>
                    <a-select-option :value="0">无效</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd" v-action:M0106>新增工作组</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne" v-action:M0112>编辑工作组</a-button>
        <a-button @click="onBatchDelete" :disabled="!hasSelectedOne" v-action:M0108>删除工作组</a-button>
        <a-button @click="onAllocateUser" :disabled="!hasSelectedOne" v-action:M0109>分配用户</a-button>
        <a-button @click="onAllocateAdmin" :disabled="!hasSelectedOne" v-action:M0115>分配管理员</a-button>
        <a-button @click="onToggleFlag" :disabled="!hasSelectedOne" v-action:M0113>更改工作组状态</a-button>
        <a-button @click="onAllocateAuth" :disabled="!hasSelectedOne" v-action:M0114>分配工作组权限</a-button>
      </template>
    </CTable>

    <GroupSchema v-action:M0106 ref="schema" @addSuccess="query" @editSuccess="query(false)" />

    <AuthSchema v-action:M0114 ref="auth" @success="query(false)" />

    <GroupAdministratorSchema v-action:M0115 ref="groupAdmin" @editSuccess="query(false)" />

    <GroupUserSchema v-action:M0109 ref="groupUser" @editSuccess="query(false)" />
  </div>
</template>

<script>
import GroupSchema from './modules/GroupSchema'
import AuthSchema from '@/components/Auth/AuthSchema'
import GroupAdministratorSchema from './modules/GroupAdministratorSchema'
import GroupUserSchema from './modules/GroupUserSchema'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { GroupService } from '@/api'
import { GROUP_FLAG } from '@/tables/group/enum'

export default {
  name: 'Group',
  mixins: [Confirm, List],
  components: {
    GroupSchema,
    AuthSchema,
    GroupAdministratorSchema,
    GroupUserSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '工作组编号',
        dataIndex: 'group_id',
        sorter: true,
        width: 140
      },
      {
        title: '工作组名称',
        dataIndex: 'group_name',
        width: 140,
        sorter: true
      },
      {
        title: '有效标志',
        dataIndex: 'flag',
        width: 50,
        sorter: true,
        customRender: (flag) => (flag.toString() === GROUP_FLAG.enabled ? '有效' : '无效')
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 280,
        tooltip: true
      }
    ])
  }),
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !!selectedRows.find(({ flag }) => flag === GROUP_FLAG.enabled)
      } else {
        return false
      }
    }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return GroupService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        alias: 'data',
        ...parameter
      }).then((r) => r.data)
    },
    /**
     * 为工作组分配管理员
     * @event
     */
    onAllocateAdmin () {
      const [record] = this.selectedRows
      this.$refs['groupAdmin'].edit(record)
    },
    /**
     * 为工作组分配用户
     * @event
     */
    onAllocateUser () {
      const [record] = this.selectedRows
      this.$refs['groupUser'].edit(record)
    },
    /**
     * 为工作组分配权限
     * @event
     */
    onAllocateAuth () {
      const [record] = this.selectedRows
      this.$refs['auth'].edit(record)
    },
    /**
     * 新增工作组
     * @event
     */
    onAdd () {
      this.$refs['schema'].add()
    },
    /**
     * 批量删除工作组
     * @event
     */
    async onBatchDelete () {
      const [{ flag }] = this.selectedRows
      const title = flag === GROUP_FLAG.enabled ? '无法删除' : '删除'
      const content = flag === GROUP_FLAG.enabled ? '只能删除无效用户' : '确定要删除选中的记录吗？'
      const onOk = flag === GROUP_FLAG.enabled ? 1 : 0
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: () => {
          if (onOk === 1) {
          } else {
            GroupService.batchDelete(this.selectedRowKeys)
              .then(() => {
                this.$notifyDeleteSuccess()
                this.query(false)
              })
              .catch(this.$notifyError)
          }
        }
      })
    },
    /**
     * 更改工作组状态
     * @event
     */
    async onToggleFlag () {
      const [{ group_id, flag }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认更改工作组状态？',
        onOk: () =>
          GroupService.toggleFlag(group_id, flag === GROUP_FLAG.enabled ? GROUP_FLAG.disabled : GROUP_FLAG.enabled)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },
    /**
     * 编辑工作组
     * @event
     */
    onEdit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    }
  }
}

</script>

<style lang='less'>
</style>
