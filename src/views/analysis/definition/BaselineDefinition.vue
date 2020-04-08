/*
 * 动态基线定义管理
 */

<template>
  <div class="baseline-definition">
    <CTable
      ref="table"
      rowKey="uuid"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:`calc(100vh - 300px)` }"
      :customRow="customRow"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="动态基线名称"
                  :labelCol="layout.label"
                  :wrapperCol="layout.wrapper"
                  style="width: 100%">
                  <a-input v-model="queryParams.title" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="节点类型"
                  :labelCol="layout.label"
                  :wrapperCol="layout.wrapper"
                  style="width: 100%">
                  <ci-model-select
                    :value="queryParams.model"
                    @input="onModelInput"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="节点类型"
                  :labelCol="layout.label"
                  :wrapperCol="layout.wrapper"
                  style="width: 100%"
                >
                  <KpiSelect
                    :nodetypeS="queryParams.model"
                    v-model="queryParams.kpi_code"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = Object.assign({}, initialQueryParams)">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="edit"
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
      </template>

    </CTable>

    <BaselineDefinitionSchema ref="schema" />

  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import screening from '../../alarm/screening'
import deleteCheck from '@/components/DeleteCheck'
import Template from '../../design/modules/template/index'
import { getBaselineDefList } from '@/api/controller/Baseline'
import { getResourceInstanceList } from '@/api/controller/Resource'
import BaselineDefinitionSchema from './BaselineDefinitionSchema'
import { CiModelSelect, KpiSelect } from '@/components/Common'

const layout = {
  label: { span: 6 },
  wrapper: { span: 16, offset: 2 }
}

const initialQueryParams = {
  model: '',
  title: '',
  kpi_code: []
}

export default {
  name: 'BaselineDefinition',
  components: {
    Template,
    CTable,
    Ellipsis,
    CiModelSelect,
    KpiSelect,
    BaselineDefinitionSchema
  },
  data () {
    return {
      layout,
      // 搜索： 展开/关闭
      advanced: false,
      initialQueryParams,
      // 查询参数
      queryParams: {
        model: '',
        title: '',
        kpi_code: []
      },
      nodeType: screening.CIType,
      // 告警列表表头
      columns: [
        {
          title: '动态基线名称',
          dataIndex: 'title',
          sorter: true,
          width: 300
          // fixed: 'left'
        },
        {
          title: '节点类型',
          dataIndex: 'ci_type_label',
          width: 150,
          sorter: true
        },
        {
          title: '节点实例',
          dataIndex: 'ci_label',
          width: 300,
          sorter: true
        },
        {
          title: 'KPI名称',
          dataIndex: 'kpi_label',
          width: 100,
          sorter: true
        },
        {
          title: '周期',
          dataIndex: 'cycle_default_type',
          width: 100,
          sorter: true,
          customRender: (text) => {
            text += ''
            switch (text) {
              case 'Day':
                return '按日计算'
              case 'Week':
                return '按周计算'
              default:
                return text
            }
          }
        }
      ],
      loadData: parameter => {
        // 清空选中
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParams.title ? {
              title: {
                _ilike: `%${this.queryParams.title.trim()}%`
              }
            } : {},
            ...this.queryParams.label ? {
              ci_type_label: {
                _eq: `${this.queryParams.label}`
              }
            } : {},
            ...this.queryParams.kpi_code && this.queryParams.kpi_code.length ? {
              kpi_code: {
                // 一条记录可能绑定多个 Kpi，在数据表中是一个以逗号分隔的字符串
                _like: `%${this.queryParams.kpi_code[0]}%`
              }
            } : {}
          }
        }
        return getBaselineDefList(variables).then(r => r.data)
      },
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {},
  computed: {
    scrollX: {
      get () {
        return this.columns.map(e => e.width || 0).reduce((x1, x2) => (x1 + x2))
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add()
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 查询
     * @param {Boolean} firstPage 是否从第一页开始
     */
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    /**
    * 筛选展开开关
    */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
    * 日期时间空间选择
    */
    onDataChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onDataOk (value) {
      console.log('onOk: ', value)
    },
    onModelInput (value, label) {
      if (this.queryParams.model === value) {
        return
      }
      this.queryParams.model = value
      this.queryParams.label = label
      this.queryParams.kpi_code = []
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
          click: () => {
            console.log(record, index)
          }
        }
      }
    },
    /**
    * 删除选中项
    */
    async deleteCtrl () {
      await deleteCheck.sureDelete() &&
    console.log('确定删除')
    }
  },
  created () {
    getResourceInstanceList()
      .then(r => {
        console.log(r)
      })
  }
}
</script>

<style scoped lang="less">
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
  </style>
