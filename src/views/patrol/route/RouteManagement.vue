/*
 * 路线管理
 */
<template>
  <div class="route-management">
    <CTable
      ref="table"
      rowKey="route_id"
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
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-cascader
                    style="width: 100%"
                    placeholder="请选择"
                    :options="screening.ascriptionList"
                    v-model="queryParam.ascription"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="路线名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-input v-model="queryParam.route_name" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="路线编号"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%">
                    <a-input v-model="queryParam.route_code" placeholder=""/>
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
        <!-- <a-button @click="add">新建</a-button>
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
        </a-button> -->
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="seeDetail"
        >
          查看
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
      </template>

      <span slot="route_info" slot-scope="text">
        <ellipsis :length="50" tooltip>{{ text.replace(/,/g, '——>') }}</ellipsis>
      </span>
    </CTable>
    <!-- S 模块 -->
    <detail ref="detail"></detail>
    <!-- E 模块 -->
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import detail from '../modules/RMDetail'
import { getRouteList, deleteRoute } from '@/api/controller/patrol'
import screening from '../screening'

export default {
  name: 'RouteManagement',
  components: {
    CTable,
    Ellipsis,
    detail
  },
  data () {
    return {
      screening,
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 告警列表表头
      columns: [
        {
          title: '路线名称',
          dataIndex: 'route_name',
          width: 200,
          sorter: true
        },
        {
          title: '巡更区域',
          dataIndex: 'ascription',
          width: 200,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'MachineRoom-XM':
                return '厦门机房'
              case 'MachineRoom-BJ':
                return '北京机房'
              default:
                return text
            }
          }
        },
        {
          title: '路线编号',
          dataIndex: 'route_code',
          width: 300,
          sorter: true
        },
        {
          title: '路线展示',
          dataIndex: 'rf_names',
          sorter: true,
          scopedSlots: { customRender: 'route_info' }
        }
      ],
      loadData: parameter => {
        this.selectedRowKeys = []
        const variables = {
          ...parameter,
          where: {
            ...this.queryParam.ascription ? {
              ascription: {
                _eq: this.queryParam.ascription[this.queryParam.ascription.length - 1]
              }
            } : {},
            ...this.queryParam.route_name ? {
              route_name: {
                _ilike: `%${this.queryParam.route_name.trim()}%`
              }
            } : {},
            ...this.queryParam.route_code ? {
              route_code: {
                _ilike: `%${this.queryParam.route_code.trim()}%`
              }
            } : {}
          }
        }
        return getRouteList(variables).then(r => r.data)
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
      this.$refs['detail'].open('', 'New')
    },
    edit () {
      // const [record] = this.selectedRows
      // this.$refs['detail'].edtt(record)
      this.$refs['detail'].open(this.selectedRows[0], 'Edit')
    },
    seeDetail () {
      this.$refs['detail'].open(this.selectedRows[0], 'See')
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
        const variables = {
          IDs: this.selectedRowKeys
        }
        await deleteRoute(variables)
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
