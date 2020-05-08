<template>
  <div class="patrol-object">

    <CTable
      ref="table"
      rowKey="task_ci_id"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:`calc(100vh - 300px)` }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更区域"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%">
                  <a-select
                    allowClear
                    v-model="queryParam.ascription"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in ascriptionList"
                      :key="item.code"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="检查对象"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset:2 }"
                  style="width: 100%">
                  <a-input v-model="queryParam.ci_name" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="是否异常"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.is_enable"
                      placeholder="请选择"
                      default-value=""
                    >
                      <a-select-option
                        v-for="item in enableList"
                        :key="item.code"
                      >{{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="巡更日期范围"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-range-picker @change="doDateChange" />
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
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
        <!-- <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="seeDetail"
        >
          详情查看
        </a-button>
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="selectedRowKeys.length == 0">导出</a-button> -->
        <a-button
          :disabled="selectedRowKeys.length !== 1"
        >
          详情查看
        </a-button>
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="selectedRowKeys.length == 0">导出</a-button>
      </template>

      <a slot="action" slot-scope="text, record" @click="seeKpi(record)">查看</a>
    </CTable>

    <detail ref="detail"></detail>
    <kpi ref="kpi"></kpi>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { STable } from '@/components'
import { getPatrolObjectExcel } from '@/api/controller/ExcelExport'
import { getTaskCiList } from '@/api/controller/patrol'
import detail from '../modules/PODetail'
import kpi from '../modules/KpiList'

export default {
  name: 'PatrolObject',
  components: {
    CTable,
    STable,
    detail,
    kpi
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // TODO:数据来源不清晰，暂做静态处理
      ascriptionList: [
        {
          code: 'MachineRoom-BJ',
          name: '北京机房'
        },
        {
          code: 'MachineRoom-XM',
          name: '厦门机房'
        }
      ],
      enableList: [
        {
          code: 0,
          name: '否'
        },
        {
          code: 1,
          name: '是'
        }
      ],
      taskStateList: [
        {
          value: '0',
          label: '未执行'
        },
        {
          value: '1',
          label: '已下载'
        },
        {
          value: '2',
          label: '执行中'
        },
        {
          value: '3',
          label: '已完成'
        },
        {
          value: '4',
          label: '超时完成'
        },
        {
          value: '5',
          label: '失败'
        }
      ],
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '检查对象名称',
          dataIndex: 'ci_name',
          width: 100
        },
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 120,
          customRender: (text) => {
            this.ascriptionList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        // TODO: 未知字段名
        {
          title: '异常',
          dataIndex: 'abnormal',
          width: 80,
          sorter: true
        },
        {
          title: '告警级别',
          dataIndex: 'level_no',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '描述',
          dataIndex: 'memo',
          width: 120,
          sorter: true
        },
        {
          title: '查看图片',
          dataIndex: 'file_urls',
          sorter: true
        },
        {
          title: '检查项',
          key: 'operation',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 内联列表表头
      innerColumns: [
        {
          title: '检查项名称',
          dataIndex: 'kpi_name',
          width: 150
        },
        {
          title: '检查结果',
          dataIndex: 'result',
          width: 100
        },
        {
          title: '是否异常',
          dataIndex: 'abnormal'
        }
      ],
      innerData: [],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: [],
      loadData: parameter => {
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParam.ascription ? {
              ascription: {
                _eq: this.queryParam.ascription
              }
            } : {},
            ...this.queryParam.is_enable ? {
              is_enable: {
                _eq: this.queryParam.is_enable
              }
            } : {},
            ...this.queryParam.task_status ? {
              task_status: {
                _eq: this.queryParam.task_status
              }
            } : {},
            ...this.queryParam.task_name ? {
              task_name: {
                _ilike: `%${this.queryParam.task_name.trim()}%`
              }
            } : {},
            ...this.queryParam.is_delay ? {
              is_delay: {
                _eq: this.queryParam.is_delay
              }
            } : {},
            ...this.queryParam.task_type ? {
              task_type: {
                _eq: this.queryParam.task_type
              }
            } : {},
            ...this.queryParam.transactor_name ? {
              transactor_name: {
                _ilike: `%${this.queryParam.transactor_name.trim()}%`
              }
            } : {},
            ...this.queryParam.is_df_transactor ? {
              is_df_transactor: {
                _eq: this.queryParam.is_df_transactor
              }
            } : {},
            ...this.queryParam.dateStr ? {
              plan_start_time: {
                _gte: this.queryParam.dateStr[0]
              },
              plan_end_time: {
                _lte: this.queryParam.dateStr[1]
              }
            } : {}
          }
        }
        return getTaskCiList(variables).then(r => r.data)
      }
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
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
     * 巡更日期范围改变
     */
    doDateChange (date, dateStr) {
      this.queryParam.dateStr = dateStr
    },
    /**
     * 查询
     * @param {Boolean} firstPage 是否从第一页开始
     */
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    seeDetail () {
      this.$refs['detail'].open(this.selectedRows[0])
    },
    seeKpi (record) {
      console.log(record)
      this.$refs['kpi'].open(record)
    },
    /**
     * 导出
     */
    async  exportExcel (e) {
      const file = await getPatrolObjectExcel(e)
      this.downloadFile(file, '巡更检查对象列表')
    },
    downloadFile (file, filename = '') {
      const blob = new Blob(
        [file],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = filename // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement)// 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
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
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
