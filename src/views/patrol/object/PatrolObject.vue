<template>
  <div class="patrol-object">

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="task_ci_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更区域"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-cascader
                    style="width: 100%"
                    placeholder="请选择"
                    :options="screening.ascriptionList"
                    v-model="queryParams.ascription"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="检查对象"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.ci_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="是否异常"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.is_enable"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in screening.enableList"
                      :key="item.code"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更日期范围"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-range-picker @change="doDateChange" />
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

      <template #operation>
        <a-button
          :disabled="!hasSelectedOne"
          @click="seeDetail"
        >
          详情查看
        </a-button>
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="!hasSelected">导出</a-button>
      </template>

      <a slot="action" slot-scope="text, record" @click="seeKpi(record)">查看</a>
    </CTable>

    <detail ref="detail"></detail>
    <kpi ref="kpi"></kpi>
  </div>
</template>

<script>
import { getPatrolObjectExcel } from '@/api/controller/ExcelExport'
import { getTaskCiList } from '@/api/controller/patrol'
import detail from '../modules/PODetail'
import kpi from '../modules/KpiList'
import screening from '../screening'
import { Confirm, List } from '@/components/Mixins'
import { filterAscription } from '../index'

export default {
  name: 'PatrolObject',
  mixins: [Confirm, List],
  components: {
    detail,
    kpi
  },
  data () {
    return {
      // 搜索： 展开/关闭
      screening,
      advanced: false,
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
      columns: [
        {
          title: '检查对象名称',
          dataIndex: 'ci_name',
          width: 120
        },
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 320,
          customRender: filterAscription
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
      selectedRows: [],
      loadData: parameter => {
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParams.ascription ? {
              ascription: {
                _eq: this.queryParams.ascription[this.queryParams.ascription.length - 1]
              }
            } : {},
            ...this.queryParams.is_enable ? {
              is_enable: {
                _eq: this.queryParams.is_enable
              }
            } : {},
            ...this.queryParams.task_status ? {
              task_status: {
                _eq: this.queryParams.task_status
              }
            } : {},
            ...this.queryParams.task_name ? {
              task_name: {
                _ilike: `%${this.queryParams.task_name.trim()}%`
              }
            } : {},
            ...this.queryParams.is_delay ? {
              is_delay: {
                _eq: this.queryParams.is_delay
              }
            } : {},
            ...this.queryParams.task_type ? {
              task_type: {
                _eq: this.queryParams.task_type
              }
            } : {},
            ...this.queryParams.transactor_name ? {
              transactor_name: {
                _ilike: `%${this.queryParams.transactor_name.trim()}%`
              }
            } : {},
            ...this.queryParams.is_df_transactor ? {
              is_df_transactor: {
                _eq: this.queryParams.is_df_transactor
              }
            } : {},
            ...this.queryParams.dateStr ? {
              plan_start_time: {
                _gte: this.queryParams.dateStr[0]
              },
              plan_end_time: {
                _lte: this.queryParams.dateStr[1]
              }
            } : {}
          }
        }
        return getTaskCiList(variables).then(r => r.data)
      }
    }
  },
  methods: {
    /**
     * 巡更日期范围改变
     */
    doDateChange (date, dateStr) {
      this.queryParams.dateStr = dateStr
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
    },
    customRow (record, index) {
      return {
        on: {
          dblclick: () => {
            this.$refs['detail'].open(record)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>
