/*
 * 生成故障
 * Author: yizhu liu
 * Date: 2019-12-24 09:28:43
 * Email: lyz02413@163.com
 */
<template>
  <div class="generate-fault">
    <a-card :bordered="false">
      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="故障状态">
                <a-select
                  allowClear
                  v-model="queryParam.faultStatus"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option
                    v-for="item in faultStatus"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="故障规则">
                <a-select
                  allowClear
                  v-model="queryParam.faultRule"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option
                    v-for="item in faultStatus"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="故障类型">
                  <a-input v-model="queryParam.faultType" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开始时间">
                  <a-date-picker
                    showTime
                    placeholder="Select Begin Time"
                    @change="onDataChange"
                    @ok="onDataOk"
                    v-model="queryParam.beginTime"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="结束时间">
                  <a-date-picker
                    showTime
                    placeholder="Select End Time"
                    @change="onDataChange"
                    @ok="onDataOk"
                    v-model="queryParam.endTime"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建人">
                  <a-input v-model="queryParam.originator" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="解决人">
                  <a-input v-model="queryParam.solveMan" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 操作栏 -->
      <div class="opration">
        <a-button>查看告警</a-button>
        <a-button>显示设置</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <s-table
        ref="table"
        size="small"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 2000, y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="message" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getGenerateFaultList } from '@/api/generateFault'

export default {
  name: 'GenerateFault',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      faultStatus: [
        {
          value: '0',
          label: '已取消'
        },
        {
          value: '1',
          label: '已产生'
        },
        {
          value: '2',
          label: '已激活'
        },
        {
          value: '3',
          label: '已封挡'
        },
        {
          value: '4',
          label: '已解决'
        }
      ],
      // 告警列表表头
      columns: [
        {
          title: '故障编号',
          dataIndex: 'id',
          sorter: true,
          align: 'center',
          width: 100,
          fixed: 'left'
        },
        {
          title: '故障状态',
          dataIndex: 'faultStatus',
          align: 'center',
          width: 100,
          sorter: true
        },
        {
          title: '前转规则名称',
          dataIndex: 'forwardRule',
          align: 'left',
          width: 200
        },
        {
          title: '故障级别',
          dataIndex: 'faultLevel',
          align: 'center',
          width: 100,
          sorter: true
        },
        {
          title: '故障类型',
          dataIndex: 'faultType',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '故障描述',
          dataIndex: 'message',
          align: 'center',
          width: 300,
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '最大告警数量',
          dataIndex: 'maxCount',
          align: 'center',
          width: 120
        },
        {
          title: '创建人',
          dataIndex: 'originator',
          align: 'center',
          width: 100
        },
        {
          title: '解决人',
          dataIndex: 'solveMan',
          align: 'center',
          width: 100
        },
        {
          title: '产生时间',
          dataIndex: 'productTime',
          align: 'center',
          width: 140
        },
        {
          title: '激活时间',
          dataIndex: 'activeTime',
          align: 'center',
          width: 140
        },
        {
          title: '封挡时间',
          dataIndex: 'blockTime',
          align: 'center',
          width: 140
        },
        {
          title: '解决时间',
          dataIndex: 'solveTime',
          align: 'center',
          width: 140
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getGenerateFaultList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {},
  methods: {
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
    }
  }
}
</script>

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
</style>
