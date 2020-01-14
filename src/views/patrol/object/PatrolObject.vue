<template>
  <div class="patrol-object">
    <a-card :borderd="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="巡检区域">
                <a-select
                  allowClear
                  v-model="queryParam.checkArea"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option value="0">北京机房</a-select-option>
                  <a-select-option value="1">厦门机房</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="检查对象名称">
                <a-input v-model="queryParam.checkName" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="是否异常">
                  <a-select
                    allowClear
                    v-model="queryParam.abnormal"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="巡检日期范围"
                  style="margin-bottom:0;"
                >
                  <a-date-picker style="width: 45%" v-model="queryParam.beginDate" placeholder="请选择"/>
                  <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                    -
                  </span>
                  <a-date-picker style="width: 45%" v-model="queryParam.endDate" placeholder="请选择"/>
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
        <a-button>导出Excel</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <s-table
        ref="table"
        size="small"
        rowKey="key"
        class="components-table-demo-nested"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x:800, y:400 }"
        :customRow="customRow"
        showPagination="auto"
      >
        <s-table
          ref="table"
          size="small"
          :columns="inlineColumns"
          :data="loadTableData"
          :alert="false"
          :pagination="false"
          slot="expandedRowRender"
        >
        </s-table>
      </s-table>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getObj, getObjInfo } from '@/api/patrol'

export default {
  name: 'PatrolObject',
  components: {
    STable
  },
  data () {
    return {
      // 搜索： 展开/关闭
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
      // 查询参数
      queryParam: {},
      // 列表表头
      columns: [
        {
          title: '检查对象名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          align: 'center'
        },
        {
          title: '巡检区域',
          dataIndex: 'checkArea',
          align: 'center',
          width: 120
        },
        {
          title: '异常',
          dataIndex: 'abnormal',
          align: 'center',
          width: 80,
          sorter: true
        },
        {
          title: '告警级别',
          dataIndex: 'alarmLevel',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '描述',
          dataIndex: 'describe',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '查看图片',
          dataIndex: 'image',
          sorter: true
        }
      ],
      // 内联列表表头
      inlineColumns: [
        {
          title: '检查项名称',
          dataIndex: 'name',
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
      loadData: parameter => {
        return getObj(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      loadTableData: parameter => {
        return getObjInfo(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      }
    }
  },
  filters: {
    taskStateFilter (e) {
      return this.taskStateList[e].label
    },
    YNFilter (e) {
      e += ''
      switch (e) {
        case '0':
          return '是'
        case '1':
          return '否'
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
