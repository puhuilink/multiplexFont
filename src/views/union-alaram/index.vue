<template>
  <div class="unionAlarm">
    <a-tabs :activeKey="state" @change="onChangeState">
      <a-tab-pane :key="ALARM_STATE.unSolved" tab="待处理"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.closed" tab="已处理"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.unclaimed" tab="未认领"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.claimed" tab="已认领"></a-tab-pane>
    </a-tabs>
    <!--      查询-->
    <a-form layout="inline" class="form">
      <div class="fold">
        <a-row :gutter="[8,8]">
          <a-col v-bind="colLayout">
            <!--            告警级别-->
            <a-form-item :label="ALARM_QUERY_LABEL.level" v-bind="formItemLayout" class="wd">
              <a-select
                mode="multiple"
                show-search
                placeholder="选择告警级别"
                v-model="queryParams.level"
              >
                <a-select-option value="1">
                  P1
                </a-select-option>
                <a-select-option value="2">
                  P2
                </a-select-option>
                <a-select-option value="3">
                  P3
                </a-select-option>
                <a-select-option value="4">
                  P4
                </a-select-option>
                <a-select-option value="5">
                  P5
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.type" v-bind="formItemLayout" class="wd">
              <a-input placeholder="请输入告警类型" v-model="queryParams.device_type" allowClear></a-input>
            </a-form-item>
          </a-col>
          <!--          告警对象-->
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.object" v-bind="formItemLayout" class="wd">
              <a-input placeholder="请输入告警对象" v-model="queryParams.device" allowClear></a-input>
            </a-form-item>
          </a-col>
          <!--          时间范围-->
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.range" v-bind="formItemLayout" class="wd">
              <a-range-picker @change="onChange" v-model="queryParams.timeList" format="YYYY-MM-DD HH:mm:ss" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span class="collapse">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
      </span>
    </a-form>
    <!--        导出-->
    <a-button icon="export" :disabled="false" style="margin-bottom: 10px" type="primary">导出</a-button>
    <!--            关闭按钮-->
    <a-popconfirm v-if="state === ALARM_STATE.unSolved" title="是否要关闭这些告警？" :disabled="!hasSelected" @confirm="() => batchCloseAlarm()">
      <a-button icon="check" :disabled="!hasSelected" style="margin-left: 10px">关闭</a-button>
    </a-popconfirm>

    <a-popconfirm v-if="state === ALARM_STATE.unclaimed" title="是否要认领这些告警？" :disabled="!hasSelected" @confirm="() => batchClaimedAlarm()">
      <a-button icon="check" :disabled="!hasSelected" style="margin-left: 10px">认领</a-button>
    </a-popconfirm>
    <a-table
      :loading="loading"
      bordered
      :columns="columns"
      :pagination="{
        current: this.current,
        pageSize: this.pageSize,
        pageSizeOptions: ['10', '20'],
        showSizeChanger: true,
        showQuickJumper: true,
        total: this.total,
        showTotal: (total,[start, end])=> `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onChange:(page, pageSize) =>{
          this.current = page
          this.pageSize = pageSize
          this.handleSearch(page, pageSize)
        },
        showSizeChange: (current, size) => {
          this.current = current
          this.pageSize = size
          this.handleSearch(current, pageSize)
        }
      }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :data-source="dataSource">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record" class="center">
        <a-button @click="showDetail(text, record)">详情</a-button>
        <a-divider v-if="state === ALARM_STATE.unclaimed" type="vertical" />
        <a-popconfirm v-if="state === ALARM_STATE.unclaimed" title="是否要认领这条告警？" @confirm="() => claimAlarm(record)">
          <a-button>认领</a-button>
        </a-popconfirm>
        <a-divider v-if="state === ALARM_STATE.unSolved" type="vertical" />
        <a-popconfirm v-if="state === ALARM_STATE.unSolved" title="是否要关闭这条告警？" @confirm="() => closeAlarm(record)">
          <a-button>关闭</a-button>
        </a-popconfirm>
      </span>
    </a-table>
    <DetailSchema ref="schema" @close="onClose"></DetailSchema>
  </div>
</template>

<script>
import { ALARM_QUERY_LABEL, ALARM_STATE } from '@/tables/unionAlarm/enum'
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
import _ from 'lodash'
import { alarm } from '@/utils/request'
import moment from 'moment'

const columns = [
  {
    title: '告警级别',
    dataIndex: 'level',
    width: 90,
    align: 'center',
    customRender: record => `P${record}`
  },
  {
    title: '告警标题',
    dataIndex: 'title'
  },
  {
    title: '告警对象',
    dataIndex: 'device'
  },
  {
    title: '告警类型',
    width: 90,
    dataIndex: 'device_type'
  },
  {
    title: '告警时间',
    dataIndex: 'last_time',
    customRender: (record) => moment(record).format('YYYY-MM-DD hh:mm:ss')
  },
  {
    title: '告警内容',
    dataIndex: 'content'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
const dataSource = []
export default {
  name: 'UnionAlarm',
  data () {
    return {
      loading: false,
      state: ALARM_STATE.unSolved,
      ALARM_STATE,
      ALARM_QUERY_LABEL,
      colLayout: {
        xl: 12,
        md: 12,
        sm: 24
      },
      queryParams: {
        process_status: '0',
        limit: 10,
        offset: 1
      },
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 4 } },
        wrapperCol: {
          xs: { span: 10, offset: 0 },
          md: { span: 14, offset: 0 },
          xl: { span: 16, offset: 2 },
          xxl: { span: 20, offset: 0 }
        }
      },
      dataSource,
      columns,
      current: 1,
      pageSize: 10,
      a: 0,
      visible: false,
      selectedRowKeys: []
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onChange (date, dateString) {
    },
    handleSearch (page, size) {
      this.queryParams.limit = size
      this.queryParams.offset = page
      this.query()
    },
    onChangeState (activeKey) {
      this.state = activeKey
      this.queryParams = {}
      this.current = 1
      this.pageSize = 10
      this.queryParams.offset = 1
      this.queryParams.limit = 10
      switch (this.state) {
        case ALARM_STATE.unSolved:
          this.queryParams.process_status = '0'
          break
        case ALARM_STATE.closed:
          this.queryParams.process_status = '1'
          break
        case ALARM_STATE.unclaimed:
          this.queryParams.claim_status = '0'
          break
        case ALARM_STATE.claimed:
          this.queryParams.claim_status = '1'
          break
      }
      this.query()
    },
    async query () {
      // TODO 查询
      if (this.queryParams.timeList) {
        this.queryParams.start_time = this.queryParams.timeList[0]
        this.queryParams.last_time = this.queryParams.timeList[1]
      }
      const { data, page } = await alarm.post('/platform/alert/main/list', {
        ...this.queryParams
      })
      this.dataSource = data
      this.total = page.total
    },
    resetQueryParams () {
      // TODO 重置查询
      this.queryParams = _.omit(this.queryParams, ['level', 'deviceType', 'device', 'timeList', 'start_time', 'last_time'])
    },
    // 认领告警
    async claimAlarm (record) {
      try {
        this.loading = true
        // eslint-disable-next-line no-unused-vars
        const { code, msg } = await alarm.post('/platform/alert/main/updates ', [{ id: record.ID, claim_status: '1' }])
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '认领成功'
          })
          this.query()
        }
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    // 关闭告警
    async closeAlarm (record) {
      try {
        this.loading = true
        // eslint-disable-next-line no-unused-vars
        const { code, msg } = await alarm.post('/platform/alert/main/updates ', [{ id: record.ID, process_status: '1' }])
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '关闭成功'
          })
          this.query()
        }
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '关闭失败'
        })
        throw e
      } finally {
        this.loading = false
      }
    },
    async batchClaimedAlarm () {
      const parmas = this.selectedRows.map(el => ({ id: el.ID, claim_status: '1' }))
      try {
        this.loading = true
        const { code } = await alarm.post('/platform/alert/main/updates ', parmas)
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '认领成功'
          })
          this.query()
        }
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '认领失败'
        })
        throw e
      } finally {
        this.loading = false
        this.resetSelect()
      }
    },
    async batchCloseAlarm () {
      const parmas = this.selectedRows.map(el => ({ id: el.ID, process_status: '1', claim_status: '1' }))
      try {
        this.loading = true
        const { code } = await alarm.post('/platform/alert/main/updates ', parmas)
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '关闭成功'
          })
          this.query()
        }
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '关闭失败'
        })
        throw e
      } finally {
        this.loading = false
        this.resetSelect()
      }
    },
    resetSelect () {
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    showDetail (text, record) {
      this.$refs.schema.show('压缩告警详情', text)
      // TODO 交互详情内容
    },
    onClose () {
      this.visible = false
    }
  },
  computed: {
    rowSelection: function () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowKeys = selectedRowKeys
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRows = selectedRows
        }
      }
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  created () {
    this.query()
  }
}
</script>

<style lang='less' scoped>
* {
  marigin: 0px;
  //background-color: #EFF3F7;
}

.header {
  //padding: 10px;
  width: 100%;
}

.left {
  float: left;
  width: 40%;
}

.wd {
  width: 100%;
}

.hg {
  height: 100%;
}

.form {
  margin-right: 10px;

  .fold {
    flex: 1;
    display: inline-block;
    width: calc(100% - 216px);
  }

  .collapse {
    float: right;
    overflow: hidden;
    transform: translateY(3.5px);
  }
}

.right {
  float: right;
  width: 75%;

  &_range_picker {
    width: 160px;
  }

  &_input {
    width: 120px;
  }
}

.center {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
