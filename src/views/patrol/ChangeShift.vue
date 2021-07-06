<template>
  <div class="ChangeShift">
    <div class="user">
      <CTable
        :columns="columns"
        :data="loadData"
        ref="table"
        rowKey="id"
        :rowSelection="rowSelection"
        :scroll="scroll">
        <!-- / 操作区域 -->
        <template #query>
          <a-form layout="inline" class="form">
            <div :class="{ fold: !advanced }">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item label="交接人员姓名" v-bind="formItemLayout" class="fw">
                    <a-input allowClear v-model.trim="queryParams.hand_name" />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item label="接班时间" v-bind="formItemLayout" class="fw">
                    <a-range-picker
                      class="fw"
                      :disabledDate="(current) => current && current > moment().endOf('day')"
                      format="YYYY-MM-DD HH:mm"
                      :placeholder="['开始时间', '结束时间']"
                      :ranges="{
                        最近1天: [moment().add(-1, 'days'), moment(), moment()],
                        最近1周: [moment().add(-7, 'days'), moment()],
                        最近1月: [moment().add(-30, 'days'), moment()],
                      }"
                      :showTime="{ format: 'HH:mm' }"
                      v-model="queryParams.receive_time"
                    />
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
          <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
          <a-button @click="onExport" :loading="exportLoading" :disabled="!hasSelected">导出</a-button>
        </template>
      </CTable>

      <ChangeShiftSchema ref="schema" />
    </div>
  </div>
</template>

<script>
import { PatrolService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import ChangeShiftSchema from './modules/ChangeShiftSchema'
import moment from 'moment'
import { downloadExcel } from '@/utils/util'

export default {
  name: 'ChangeShift',
  mixins: [Confirm, List],
  components: {
    ChangeShiftSchema
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      // {
      //   title: '巡更组',
      //   dataIndex: '',
      //   sorter: true,
      //   width: 180
      // },
      {
        title: '交班人姓名',
        dataIndex: 'hand_name',
        sorter: true,
        width: 180
      },
      {
        title: '交班时间',
        dataIndex: 'hand_time',
        sorter: true,
        width: 180,
        customRender: hand_time => moment(hand_time).format('YYYY-MM-DD HH:mm:ss')
      },
      // {
      //   title: '交班状态',
      //   dataIndex: 'hand_time',
      //   sorter: true,
      //   width: 180
      // },
      {
        title: '接班人姓名',
        dataIndex: 'receive_name',
        sorter: true,
        width: 180
      },
      {
        title: '接班时间',
        dataIndex: 'receive_time',
        sorter: true,
        width: 180,
        customRender: time => time ? moment(time).format() : ''
      }
      // {
      //   title: '交接状态',
      //   dataIndex: 'user_id',
      //   sorter: true,
      //   width: 180
      // }
    ]),
    exportLoading: false
  }),
  computed: {},
  methods: {
    moment,
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return PatrolService.changeShiftFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq(['id', 'receive_time', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
    },
    onDetail () {
      const [record] = this.selectedRowKeys
      this.$refs['schema'].detail(record)
    },
    async onExport () {
      try {
        this.exportLoading = true
        const data = await PatrolService.onExport(this.selectedRowKeys)
        downloadExcel('交接班记录', data)
        this.$notification.success({
          message: '系统提示',
          description: '导出交接班记录成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: h => h('p', { domProps: { innerHTML: `导出交接班记录失败${e}` } })
        })
        throw e
      } finally {
        this.exportLoading = false
      }
    }
  }
}
</script>

<style lang="less">
</style>
