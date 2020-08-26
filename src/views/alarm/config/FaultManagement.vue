/*
 * 故障前转路径管理
 */
<template>
  <div class="fault-management ">
    <a-card :bordered="false">
      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="forward_path_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1800, y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >

        <template #query>
          <a-form layout="inline">
            <a-row >
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="前转路径名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParam.forward_path_title" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="前转类型"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParam.forward_type"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in screening.forwardType"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="系统前转目标"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParam.forward_user" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="状态"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%"
                  >
                    <a-select
                      style="width: 100%;"
                      v-model="queryParam.enabled"
                    >
                      <a-select-option value="true">启用</a-select-option>
                      <a-select-option value="false">禁用</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
            <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
              <a-button type="primary" @click="query">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-form>
        </template>

        <template #operation>
          <div class="operation">
            <a-button
              @click="$refs.detail.open('', 'New')"
            >
              新增
            </a-button>
            <a-button
              :disabled="selectedRowKeys.length !== 1"
              @click="$refs.detail.open(selectedRows[0], 'Edit')"
            >
              编辑
            </a-button>
            <a-button
              :disabled="selectedRowKeys.length == 0"
              @click="deleteCtrl"
            >
              删除
            </a-button>
            <a-button
              :disabled="!selectedRowKeys.length > 0"
              @click="enableCtrl(true)"
            >
              启用
            </a-button>
            <a-button
              :disabled="!selectedRowKeys.length > 0"
              @click="enableCtrl(false)"
            >
              停用
            </a-button>
            <a-button
              :disabled="selectedRowKeys.length !== 1"
              @click="$refs.correlation.open(selectedRows[0])"
            >
              关联故障
            </a-button>
          </div>
        </template>
        <span slot="status" slot-scope="text">
          <a-icon
            v-if="text"
            type="check-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#00c356'}"
          />
          <a-icon
            v-else
            type="close-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#f97160'}"
          />
        </span>
        <span slot="appExplain" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </CTable>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail
        ref="detail"
        @addSuccess="$refs['table'].refresh(false)"
      ></detail>
      <correlation ref="correlation"></correlation>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import detail from './modules/FMDetail'
import correlation from './modules/FMCorrelation'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import screening from '../screening'

const query = gql`query($where:t_forward_path_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_forward_path_order_by!]) {
    pagination: t_forward_path_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  data: t_forward_path (offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    enabled
    forward_comment
    forward_destination
    forward_path_id
    forward_path_title
    forward_type
    forward_user
    incident_severity
    incident_type
    send_cycle
    send_tag
    template_name
    template_path
  }
}`

const deleteAttrs = gql`mutation ($idList: [numeric!] = []) {
  # instance表删除
  delete_t_forward_path (where: {
    forward_path_id: {
      _in: $idList
    }
  }) {
    affected_rows
  }
}`

const enableUpdate = gql`mutation update_t_forward_path ($id: [numeric!] = [], $enabled: Boolean!) {
  update_t_forward_path(
    where: {
      forward_path_id: {
        _in: $id
      }
    },
    _set: {
      enabled: $enabled
    } 
  ) {
    affected_rows
  }
}`

export default {
  name: 'FaultManagement',
  components: {
    CTable,
    Ellipsis,
    detail,
    correlation
  },
  data () {
    return {
      screening,
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '前转路径名称',
          dataIndex: 'forward_path_title',
          width: 180,
          sorter: true
        },
        {
          title: '前转类型',
          dataIndex: 'forward_type',
          width: 100,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'EOMS':
                return '运维系统'
              case 'Email':
                return '邮件'
              case 'SMS':
                return '短信'
              default:
                return text
            }
          }
        },
        {
          title: '系统前转目标',
          dataIndex: 'forward_user',
          width: 200,
          sorter: true
        },
        {
          title: '前转周期',
          dataIndex: 'send_cycle',
          width: 100,
          sorter: true
        },
        {
          title: '发送标志',
          dataIndex: 'send_tag',
          width: 100,
          sorter: true
        },
        {
          title: '启用标志',
          dataIndex: 'enabled',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '前转模板',
          width: 100,
          dataIndex: 'template_path'
        },
        {
          title: '备注',
          width: 100,
          dataIndex: 'forward_comment'
        },
        {
          title: '其他前转目标',
          dataIndex: 'forward_destination',
          width: 150,
          sorter: true
        },
        {
          title: '应用说明',
          dataIndex: 'app_note_s',
          sorter: true,
          width: 350,
          scopedSlots: { customRender: 'appExplain' }
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {
    statusTitleFilter (type) {
      type += ''
      switch (type) {
        case 'true':
          return '已启用'
        case 'false':
          return '已禁用'
        default:
          return ''
      }
    }
  },
  computed: {},
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 表格展示规则类型过滤
     */
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    /**
     * 选中行更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          dblclick: () => {
            this.$refs['detail'].open(record, 'Edit')
          }
        }
      }
    },
    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.queryParam.forward_path_title ? {
              forward_path_title: {
                _ilike: `%${this.queryParam.forward_path_title.trim()}%`
              }
            } : {},
            ...this.queryParam.forward_type ? {
              forward_type: {
                _eq: this.queryParam.forward_type
              }
            } : {},
            ...this.queryParam.forward_user ? {
              forward_user: {
                _ilike: `%${this.queryParam.forward_user.trim()}%`
              }
            } : {},
            ...this.queryParam.enabled ? {
              enabled: {
                _eq: this.queryParam.enabled === 'true'
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 删除选中项
     */
    async deleteCtrl () {
      console.log(this.selectedRowKeys)
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await apollo.clients.alert.mutate({
          mutation: deleteAttrs,
          variables: {
            idList: [
              ...this.selectedRowKeys
            ]
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })

        this.$refs['table'].refresh(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 确定启用
     */
    async enableCtrl (value) {
      if (!await deleteCheck.confirm({ content: value ? '确定启用吗？' : '确定停用吗？' })) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await apollo.clients.alert.mutate({
          mutation: enableUpdate,
          variables: {
            id: [...this.selectedRowKeys],
            enabled: value
          }
        })
        this.query()
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
        // this.$message.info(value ? '成功启用' : '成功停用')
      }
    }
  }
}
</script>

<style scoped>

</style>
