<template>
  <div class="ChangeShift">
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8,8]">
          <a-col :style="{ textAlign: 'left' }" class="search_box">
            <label class="search_label">搜索条件
              <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
            </label>
            <span>
              <QueryBtn @click="query" />
              <ResetBtn @click="resetQueryParams" />
            </span>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="交班人姓名" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入交班人姓名" allowClear v-model.trim="queryParams.handName" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
        <a-row>
        </a-row>
      </div>

      <!-- <span :class="advanced ? 'expand' : 'collapse'">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" /> -->
      <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />-->
      <!-- </span> -->
    </a-form>
    <div style="margin-bottom: 10px;"></div>
    <div class="operation_box">
      <a-button :type="hasSelectedOne ? 'primary' : ''" @click="onDetail" :disabled="!hasSelectedOne" style="margin-right: 10px;">
        <a-icon type="search" />
        查看</a-button>
      <a-button :type="hasSelected ? 'primary' : ''" @click="onExport" :loading="exportLoading" :disabled="!hasSelected">
        <a-icon type="upload" />
        导出</a-button>
    </div>
    <a-table
      :columns="columns"
      :scroll="scroll"
      :rowSelection="rowSelection"
      rowKey="id"
      :loading="pageLoading"
      :pagination="paginationOpt"
      :data-source="dataSource"
      :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''"
    ></a-table>

    <ChangeShiftSchema ref="schema" @addSuccess="query" @editSuccess="query"/>
  </div>
</template>

<script>
import { PatrolService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import ChangeShiftSchema from './modules/ChangeShiftSchema'
import moment from 'moment'
import { downloadExcel } from '@/utils/util'
import { xungeng } from '@/utils/request'

export default {
  name: 'ChangeShift',
  mixins: [Confirm, List],
  components: {
    ChangeShiftSchema
  },
  props: {},
  data () {
    return {
      columns: Object.freeze([
        // {
        //   title: '巡更组',
        //   dataIndex: '',
        //   sorter: true,
        //   width: 180
        // },
        {
          title: '交班人姓名',
          dataIndex: 'handName',
          width: 180
        },
        {
          title: '交班时间',
          dataIndex: 'handTime',
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
          dataIndex: 'receiveName',
          width: 180
        },
        {
          title: '接班时间',
          dataIndex: 'receiveTime',
          defaultSortOrder: 'descend',
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
      exportLoading: false,
      pageLoading: false,
      dataSource: [],
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      },
      queryParams: {}
    }
  },
  computed: {},
  methods: {
    moment,
    async query () {
      try {
        this.pageLoading = true
        if (this.queryParams.receive_time) {
          this.queryParams.createTimeStart = this.moment(this.queryParams.receive_time[0]).format('YYYY-MM-DD HH:mm:ss')
          this.queryParams.createTimeEnd = this.moment(this.queryParams.receive_time[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log('querty', _.omit(this.queryParams, ['receive_time']), this.queryParams)
        const { data: { list, total } } = await xungeng.get('/changeShifts/list', {
          params: {
            pageSize: this.paginationOpt.defaultPageSize,
            pageNum: this.paginationOpt.defaultCurrent,
            ..._.omit(this.queryParams, ['receive_time'])
          }
        })
        this.dataSource = list
        this.paginationOpt.total = Number(total)
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
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
  },
  mounted () {
    this.query()
  }
}
</script>

<style scoped lang="less">
</style>
