<template>
  <div class="ResourceInstanceList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      :rowKey="el => el.did"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: scrollX, y: `calc(100vh - 370px)`}"
    >

      <template #query>
        <a-form layout="inline">
          <div class="fold">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  :labelCol="{ span: 2 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  label="名称"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams.name_s" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  label="显示名称"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams.label_s" />
                </a-form-item>
              </a-col>

            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style="advanced && { float: 'right', overflow: 'hidden', transform: 'translateY(6.5PX)' } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button @click="edit" :disabled="selectedRowKeys.length !== 1">编辑</a-button>
        <a-button :disabled="selectedRowKeys.length === 0">删除</a-button>
        <a-button>数据检查</a-button>
      </template>

    </CTable>

    <ResourceInstanceSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import ResourceInstanceSchema from './ResourceInstanceSchema'
import {
  getInstanceList
} from '@/api/controller/Instance'
import { getKpiList } from '@/api/controller/Kpi'

export default {
  name: 'ResourceInstanceList',
  props: {
    where: {
      type: Object,
      default: () => ({})
    },
    parentNameS: {
      type: String,
      default: ''
    },
    parentTreeS: {
      type: String,
      default: ''
    }
  },
  components: {
    CTable,
    ResourceInstanceSchema
  },
  data: () => ({
    // 查询栏是否展开
    advanced: true,
    // 查询参数
    queryParams: {},
    // 选中行
    selectRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    // TODO: 列不全
    // TODO: td 溢出省略号或自动增长但与表头保持对齐
    columns: {
      get () {
        return [
          // {
          //   title: 'ID',
          //   dataIndex: 'id_s',
          //   sorter: true,
          //   width: 180
          // },
          {
            title: '名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 600
          },
          {
            title: '显示名称',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          },
          {
            title: '父节点',
            dataIndex: 'parentname_s',
            width: 300
          },
          {
            title: '所属节点类型',
            dataIndex: 'nodetype_s',
            width: 300
          }
        ]
      }
    },
    scrollX: {
      get () {
        return this.columns
          .filter(e => e.width)
          .reduce((a, b) => a + b) + 36
      }
    }
  },
  watch: {
    '$props': {
      deep: true,
      handler () {
        // 重置查询条件
        this.reset()
        // 重新查询
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add(
        this.parentNameS,
        this.parentTreeS
      )
    },
    edit () {
      const [record] = this.selectRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      this.selectedRowKeys = []
      this.selectedRows = []
      const handler = this.parentNameS === 'Kpi' ? getKpiList : getInstanceList
      return handler({
        orderBy: {
          ...this.parentNameS === 'Kpi' ? { rid: 'desc' } : { did: 'desc' }
        },
        ...parameter,
        where: {
          ...this.where,
          ...this.queryParams.name_s ? {
            name_s: {
              _ilike: `%${this.queryParams.name_s.trim()}%`
            }
          } : {},
          ...this.queryParams.label_s ? { label_s: {
            _ilike: `%${this.queryParams.label_s.trim()}%`
          } } : {}
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys, selectRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectRows = selectRows
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 切换查询栏展开状态
     * @event
     */
    toggleAdvanced () {
      this.advanced = !this.andvaced
      if (!this.advanced) {
        delete (this.queryParams.email)
        delete (this.queryParams.flag)
      }
    }
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
