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
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="动态基线名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-input v-model="queryParams.title" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="节点类型"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-select
                    allowClear
                    v-model="queryParams.ci_type_label"
                    placeholder="请选择"
                  >
                    <a-select-opt-group
                      v-for="(group,index) in nodeType"
                      :key="index"
                      :label="group.label"
                      :allowClear="true"
                    >
                      <a-select-option
                        v-for="item in group.options"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="KPI"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%"
                  >
                    <a-select
                      allowClear
                      v-model="queryParams.kpi"
                      placeholder="请选择"
                    >
                      <a-select-opt-group
                        v-for="(group,index) in nodeType"
                        :key="index"
                        :label="group.label"
                        :allowClear="true"
                      >
                        <a-select-option
                          v-for="item in group.options"
                          :key="item.value"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button>新建</a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
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
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import screening from '../../alarm/screening'
import deleteCheck from '@/components/DeleteCheck'
import Template from '../../design/moduels/template/index'
import { getBaseLineDefList } from '@/api/controller/Baseline'
import { getResourceInstanceList } from '@/api/controller/Resource'

export default {
  name: 'BaselineDefinition',
  components: {
    Template,
    CTable,
    Ellipsis
  },
  data () {
    return {
    // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: {},
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
          // width: 100,
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
            ...this.queryParams.ci_type_label ? {
              ci_type_label: {
                _ilike: `%${this.queryParams.ci_type_label.trim()}%`
              }
            } : {},
            ...this.queryParams.kpi ? {
              kpi: {
                _ilike: `%${this.queryParams.kpi.trim()}%`
              }
            } : {}
          }
        }
        return getBaseLineDefList(variables).then(r => r.data)
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
