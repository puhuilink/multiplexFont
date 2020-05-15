/*
 * 动态基线策略
 */
<template>
  <div class="baseline-policy">
    <!-- S 列表 -->
    <CTable
      ref="table"
      rowKey="uuid"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:800 }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >

      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="策略名称"
                  :md="12"
                  :sm="24"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.title"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="周期"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-input type="number" v-model.number="queryParams.cycle_count" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="计算时间"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%">
                    <a-input v-model="queryParams.cron_expression" />
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
        <a-button
          @click="$refs.detail.open({}, 'Add')"
          v-action:M1301
        >
          新建
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="$refs.detail.open(selectedRows[0], 'Edit')"
          v-action:M1302
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
          v-action:M1303
        >
          删除
        </a-button>
      </template>
    </CTable>
    <!-- E 列表 -->

    <!-- S 模块 -->
    <detail
      ref="detail"
      @addSuccess="() => { this.queryParams = {}; this.query() }"
      @editSuccess="$refs['table'].refresh(false)"
    ></detail>
    <!-- E 模块 -->
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import detail from '../modules/BSDetail'
import { queryBaselineList, deleteBaselinePolicies } from '@/api/controller/BaselinePolicy'

export default {
  name: 'BaselinePolicy',
  components: {
    CTable,
    Ellipsis,
    detail
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: {},
      // 告警列表表头
      columns: [
        {
          title: '策略名称',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '周期',
          dataIndex: 'cycle_count',
          width: 150,
          sorter: true
        },
        {
          title: '时间步长',
          dataIndex: 'cal_interval',
          width: 200,
          sorter: true
        },
        {
          title: '样本密集区域',
          dataIndex: 'sample_radio',
          width: 250,
          sorter: true
        },
        {
          title: '计算时间',
          dataIndex: 'cron_expression',
          width: 120,
          sorter: true
        }
      ],
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
     * 删除选中项
     */
    async deleteCtrl () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await deleteBaselinePolicies(this.selectedRowKeys)
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
    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      return queryBaselineList({
        ...parameter,
        where: {
          ...this.queryParams.title ? {
            title: {
              _ilike: `%${this.queryParams.title.trim()}%`
            }
          } : {},
          ...this.queryParams.cycle_count !== undefined ? {
            cycle_count: {
              _eq: Number(this.queryParams.cycle_count)
            }
          } : {},
          ...this.queryParams.cron_expression !== undefined ? {
            cron_expression: {
              _like: `%${this.queryParams.cron_expression.trim()}%`
            }
          } : {}
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
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
