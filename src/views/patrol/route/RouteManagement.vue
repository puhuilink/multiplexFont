/*
 * 路线管理
 */
<template>
  <div class="route-management">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="route_id"
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
                    allowClear
                    style="width: 100%"
                    placeholder="请选择"
                    :options="screening.ascriptionList"
                    v-model="queryParams.ascription"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="路线名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.route_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="路线编号"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.route_code" />
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
        <a-button :disabled="!hasSelectedOne" @click="seeDetail" >查看</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" >删除</a-button>
      </template>

    </CTable>

    <detail ref="detail" />
  </div>
</template>

<script>
import detail from '../modules/RMDetail'
import { getRouteList, deleteRoute } from '@/api/controller/patrol'
import screening from '../screening'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export default {
  name: 'RouteManagement',
  mixins: [Confirm, List],
  components: {
    detail
  },
  data: () => ({
    screening,
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
        sorter: true
      }
    ]
  }),
  methods: {
    loadData (parameter) {
      return getRouteList({
        ...parameter,
        where: {
          ...generateQuery(_.omit(this.queryParams, 'ascription')),
          ...this.queryParams.ascription ? {
            ascription: {
              _eq: this.queryParams.ascription[this.queryParams.ascription.length - 1]
            }
          } : {}
        }
      }).then(r => r.data)
    },
    add () {
      this.$refs['detail'].open('', 'New')
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['detail'].open(record, 'Edit')
    },
    seeDetail () {
      const [record] = this.selectedRows
      this.$refs['detail'].open(record, 'See')
    },
    /**
     * 删除选中项
     */
    async onBatchDelete () {
      this.$confirmDelete({
        onOk: () => deleteRoute({ IDs: this.selectedRowKeys })
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
