<template>
  <div class="patrol-task">

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="task_id"
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
                  label="是否异常"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.is_enable"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in screening.enableList"
                      :key="item.code"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="任务单状态"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.task_status"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in taskStatusList"
                      :key="item.type"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="任务名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.task_name" placeholder=""/>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="是否延迟开始"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.is_delay"
                    placeholder="请选择"
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
                  label="任务类型"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.task_type"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in planTypeList"
                      :key="item.code"
                    >{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="执行人"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.transactor_name" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="是否默认执行人执行"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    v-model="queryParams.is_df_transactor"
                    placeholder="请选择"
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

      <!-- / 操作区域 -->
      <template #operation>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="seeDetail"
        >
          查看
        </a-button>
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="selectedRowKeys.length == 0">导出</a-button>
      </template>

    </CTable>
    <!-- S 模块 -->
    <detail ref="detail"></detail>
    <!-- E 模块 -->
  </div>
</template>

<script>
import { getPatrolTaskExcel } from '@/api/controller/ExcelExport'
import { getTaskInfoList, getUserGroupList } from '@/api/controller/patrol'
import detail from '../modules/PTDetail'
import screening from '../screening'
import { Confirm, List } from '@/components/Mixins'
import { filterAscription } from '../index'

export default {
  name: 'PatrolTask',
  mixins: [Confirm, List],
  components: {
    detail
  },
  data () {
    return {
      screening,
      taskStatusList: screening.taskStatusList,
      planTypeList: screening.planTypeList,
      delayList: screening.enableList,
      columns: [
        {
          title: '序号',
          dataIndex: 'task_id',
          key: 'name',
          width: 100,
          fixed: 'left'
        },
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 120,
          customRender: filterAscription
        },
        {
          title: '任务类型',
          dataIndex: 'task_type',
          width: 120,
          sorter: true,
          customRender: (text) => {
            this.planTypeList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '任务名称',
          dataIndex: 'task_name',
          width: 150,
          sorter: true
        },
        {
          title: '计划开始时间',
          dataIndex: 'plan_start_time',
          width: 180,
          sorter: true
        },
        {
          title: '计划结束时间',
          dataIndex: 'plan_end_time',
          width: 180,
          sorter: true
        },
        {
          title: '任务单状态',
          dataIndex: 'task_status',
          width: 120,
          sorter: true,
          customRender: (text) => {
            this.screening.taskStatusList.forEach(element => {
              if (element.type === text) {
                text = element.label
              }
            })
            return text
          }
        },
        // TODO: 未知字段名
        {
          title: '异常',
          dataIndex: 'task_state',
          width: 80,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'Y':
                text = '无异常'
                break
              case 'N':
                text = '有异常'
                break
            }
            return text
          }
        },
        {
          title: '执行人',
          dataIndex: 'transactor_name',
          width: 150,
          sorter: true
        },
        {
          title: '延迟开始',
          dataIndex: 'is_delay',
          width: 120,
          sorter: true,
          customRender: (text) => {
            this.screening.enableList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '实际开始时间',
          dataIndex: 'real_end_time',
          width: 150,
          sorter: true
        },
        {
          title: '实际结束时间',
          dataIndex: 'real_start_time',
          width: 150,
          sorter: true
        },
        {
          title: '默认执行人执行',
          dataIndex: 'is_df_transactor',
          width: 150,
          sorter: true,
          customRender: (text) => {
            this.screening.enableList.forEach(element => {
              if (element.code === text) {
                text = element.name
              }
            })
            return text
          }
        },
        {
          title: '默认执行人',
          dataIndex: 'df_transactor_name',
          width: 150,
          sorter: true
        }
      ],
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
        return getTaskInfoList(variables).then(r => r.data)
      },
      userGroupList: [],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  methods: {
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
    /**
     * 巡更日期范围改变
     */
    doDateChange (date, dateStr) {
      this.queryParams.dateStr = dateStr
    },
    seeDetail () {
      this.$refs.detail.open(this.selectedRows[0])
    },
    /**
     * 导出
     */
    async  exportExcel (e) {
      const file = await getPatrolTaskExcel(e)
      this.downloadFile(file, '巡更任务单列表')
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
  },
  created () {
    this.getGroupList()
  }
}
</script>

<style scoped lang='less'>
</style>
