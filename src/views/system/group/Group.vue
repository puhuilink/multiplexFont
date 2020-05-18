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
        <a-form layout="inline">
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
                    <a-select-option value="1">有效</a-select-option>
                    <a-select-option value="0">无效</a-select-option>
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
        <a-button @click="onDatchDelete" :disabled="!isValid" v-action:M0108>删除</a-button>
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
import { Ellipsis } from '@/components'
import GroupSchema from './GroupSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import GroupAdministratorSchema from './GroupAdministratorSchema'
import GroupUserSchema from './GroupUserSchema'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'
import Template from '../../design/modules/template/index'
import deleteCheck from '@/components/DeleteCheck'
import List from '@/components/Mixins/Table/List'
import { generateQuery } from '@/utils/graphql'
import { GroupService } from '@/api-hasura/index'

const deleteGroup = gql`mutation delete_user ($groupIds: [String!] = [], $desktopNames: [String!] = []) {
  #   group 表删除
  delete_t_group (where: {
    group_id: {
      _in: $groupIds
    }
  }) {
    affected_rows
  }
  #   关联解除
  delete_t_user_group (where: {
    group_id: {
      _in: $groupIds
    }
  }) {
    affected_rows
  }
  # 删除权限
  delete_t_authorize_object (where: {
    group_id: {
      _in: $groupIds
    }
  }) {
    affected_rows
  }
  # 删除桌面
  delete_t_view (where: {
    view_name: {
      _in: $groupIds
    }
    view_title: {
      _in: $desktopNames
    }
  }) {
    affected_rows
  }
}`

const updateGroupFlag = gql`mutation update_group_flag ($groupId: String!, $flag: numeric) {
  update_t_group(
    where: {
      group_id: {
        _eq: $groupId
      }
    },
    _set: {
      flag: $flag
    }
  ) {
    affected_rows
  }
}`

// 删除组会删除组，并且解除其组内用户的关联
// 只能删除无效组

export default {
  name: 'Group',
  mixins: [List],
  components: {
    Template,
    CTable,
    Ellipsis,
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
        customRender: val => val ? '有效' : '失效'
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
    isValid () {
      if (!this.hasSelected) {
        return false
      } else {
        // 仅失效工作组可删除
        return this.selectedRows
          .filter(el => !el.flag)
          .length === this.selectedRows.length
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
    async onDatchDelete () {
      await deleteCheck.sureDelete()
      try {
        this.$refs['table'].loading = true
        const desktopNames = this.selectedRowKeys.map(id => `${id}桌面`)
        await apollo.clients.alert.mutate({
          mutation: deleteGroup,
          variables: {
            groupIds: [
              ...this.selectedRowKeys
            ],
            desktopNames
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })

        this.query(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
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
        const [record] = this.selectedRows
        await apollo.clients.alert.mutate({
          mutation: updateGroupFlag,
          variables: {
            groupId: record.group_id,
            flag: Number(!record.flag)
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.query(false)
      } catch (e) {
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
