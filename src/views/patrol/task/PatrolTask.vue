<template>
  <div class="patrol-task">

    <CTable
      ref="table"
      rowKey="task_id"
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
                  label="巡检区域"
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
            </a-row>

            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="任务单状态"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.task_status"
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
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-input v-model="queryParam.task_name" placeholder=""/>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="是否延迟开始"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.is_delay"
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
                    label="任务类型"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.task_type"
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
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-input v-model="queryParam.transactor_name" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="是否默认执行人执行"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-select
                      allowClear
                      v-model="queryParam.is_df_transactor"
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
                    label="巡检日期范围"
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
          查看
        </a-button>
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="selectedRowKeys.length == 0">导出</a-button> -->
        <a-button
          :disabled="selectedRowKeys.length !== 1"
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
import CTable from '@/components/Table/CTable'
import { getPatrolTaskExcel } from '@/api/controller/ExcelExport'
import { getTaskInfoList, getUserGroupList } from '@/api/controller/patrol'
import detail from '../modules/PTDetail'

export default {
  name: 'PatrolTask',
  components: {
    CTable,
    detail
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      taskStatusList: [
        {
          type: 'A',
          label: '未执行'
        },
        {
          type: 'B',
          label: '已下载'
        },
        {
          type: 'D',
          label: '已完成'
        },
        {
          type: 'E',
          label: '超时完成'
        },
        {
          type: 'F',
          label: '失败'
        }
      ],
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
      planTypeList: [
        {
          code: 'A',
          name: '例行巡检'
        },
        {
          code: 'B',
          name: '临时巡检'
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
      delayList: [
        {
          code: 0,
          name: '否'
        },
        {
          code: 1,
          name: '是'
        }
      ],
      // 告警列表表头
      columns: [
        {
          title: '序号',
          dataIndex: 'task_id',
          key: 'name',
          width: 100,
          fixed: 'left'
        },
        {
          title: '巡检区域',
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
            this.taskStatusList.forEach(element => {
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
            this.enableList.forEach(element => {
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
            this.enableList.forEach(element => {
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
        return getTaskInfoList(variables).then(r => r.data)
      },
      userGroupList: [],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  created () {
    this.getGroupList()
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
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
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
     * 巡检日期范围改变
     */
    doDateChange (date, dateStr) {
      this.queryParam.dateStr = dateStr
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
     * 查询
     * @param {Boolean} firstPage 是否从第一页开始
     */
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    seeDetail () {
      this.$refs.detail.open(this.selectedRows[0])
    },
    /**
     * 导出
     */
    async  exportExcel (e) {
      const file = await getPatrolTaskExcel(e)
      this.downloadFile(file, '巡检任务单列表')
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
