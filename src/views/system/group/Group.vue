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
                <a-form-item
                  label="工作组编号"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.group_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="工作组名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.group_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  v-bind="formItemLayout"
                  label="有效标识"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    defaultValue="1"
                    v-model="queryParams.flag"
                    placeholder="请选择"
                  >
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
        <a-button @click="onAdd" v-action:M0106>新增</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne" v-action:M0101>编辑</a-button>
        <a-button @click="onBatchDelete" :disabled="!isSelectedValid" v-action:M0108>删除</a-button>
        <a-button @click="onAllocateUser" :disabled="!hasSelectedOne" v-action:M0101>分配用户</a-button>
        <a-button @click="onAllocateAdmin" :disabled="!hasSelectedOne" v-action:M0101>分配管理员</a-button>
        <a-button @click="onToggleFlag" :disabled="!hasSelectedOne" v-action:M0101>更改状态</a-button>
        <a-button @click="onAllocateAuth" :disabled="!hasSelectedOne" v-action:M0110>分配权限</a-button>
      </template>

    </CTable>

    <GroupSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)"
    />

    <AuthScheme
      ref="auth"
      @success="query(false)"
    />

    <GroupAdministratorSchema
      ref="groupAdmin"
      @editSuccess="query(false)"
    />

    <GroupUserSchema
      ref="groupUser"
      @editSuccess="query(false)"
    />
  </div>
</template>

<script>
import GroupSchema from './GroupSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import GroupAdministratorSchema from './GroupAdministratorSchema'
import GroupUserSchema from './GroupUserSchema'
import deleteCheck from '@/components/DeleteCheck'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { GroupService } from '@/api-hasura/index'

export default {
  name: 'Group',
  mixins: [Confirm, List],
  components: {
    GroupSchema,
    AuthScheme,
    GroupAdministratorSchema,
    GroupUserSchema
  },
  data: () => ({
    columns: [
      {
        title: '工作组编号',
        dataIndex: 'group_id',
        sorter: true,
        width: 280
      },
      {
        title: '工作组名称',
        dataIndex: 'group_name',
        width: 280,
        sorter: true
      },
      {
        title: '有效标志',
        dataIndex: 'flag',
        width: 120,
        sorter: true,
        customRender: val => val ? '有效' : '无效'
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 280,
        tooltip: true
      }
    ]
  }),
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !selectedRows.find(({ flag }) => flag)
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
      }).then(r => r.data)
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
     * 新增工作区
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
      this.$confirmDelete({
        onOk: () => GroupService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.notifyError)
      })
    },
    /**
     * 更改工作组状态
     * @event
     */
    async onToggleFlag () {
      if (!await deleteCheck.confirm({ content: '是否改变工作组状态？' })) {
        return
      }
      try {
        this.$refs['table'].loading = true
        const [{ group_id, flag }] = this.selectedRows
        await GroupService.toggleFlag(group_id, Number(!flag))
        this.notifyToggleFlagSuccess()
        this.query(false)
      } catch (e) {
        this.notifyError(e)
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
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
