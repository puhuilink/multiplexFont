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
          <a-col class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="query(true)">
              <a-icon type="search" />
              查询
            </a-button>
            <a-button :style="{ marginLeft: '15px' }" @click="resetQueryParams">
              <a-icon type="sync" />
              重置
            </a-button>
          </a-col>
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
                  L1
                </a-select-option>
                <a-select-option value="2">
                  L2
                </a-select-option>
                <a-select-option value="3">
                  L3
                </a-select-option>
                <a-select-option value="4">
                  L4
                </a-select-option>
                <a-select-option value="5">
                  L5
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
              <a-range-picker v-model="queryParams.timeList" format="YYYY-MM-DD HH:mm:ss" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <!--      <span class="collapse">-->
      <!--        <QueryBtn @click="query" />-->
      <!--        <ResetBtn @click="resetQueryParams" />-->
      <!--      </span>-->
      <div class="operation_box">
        <a-button
          @click="downLoad"
          icon="export"
          :disabled="false"
          type="primary"
          :loading="exportLoading">导出</a-button>
        <!--            关闭按钮-->
        <a-popconfirm v-if="state === ALARM_STATE.unSolved" title="是否要关闭这些告警？" :disabled="!hasSelected" @confirm="() => batchCloseAlarm()">
          <a-button icon="check" :disabled="!hasSelected" style="margin-left: 10px">关闭</a-button>
        </a-popconfirm>

        <a-popconfirm v-if="state === ALARM_STATE.unclaimed" title="是否要认领这些告警？" :disabled="!hasSelected" @confirm="() => batchClaimedAlarm()">
          <a-button icon="check" :disabled="!hasSelected" style="margin-left: 10px">认领</a-button>
        </a-popconfirm>
        <div/>
      </div></a-form>
    <!--        导出-->
    <div class="wrapper_content content_item">
      <a-table
        :loading="loading"
        bordered
        rowKey="ID"
        :scroll="{y: scrollY}"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="dataSource"
        :pagination="paginationOpt"
        class="union_table"
      >
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
    </div>

    <DetailSchema ref="schema" @close="onClose"></DetailSchema>
  </div>
</template>

<script>
import { ALARM_MAP, ALARM_QUERY_LABEL, ALARM_STATE } from '@/tables/unionAlarm/enum'
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
import _ from 'lodash'
import { alarm } from '@/utils/request'
import moment from 'moment'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'
import { downloadExcel } from '@/utils/util'

const columns = [
  {
    title: '告警级别',
    dataIndex: 'level',
    key: 'level',
    width: 90,
    align: 'center',
    customRender: record => `L${record}`
  },
  {
    title: '告警标题',
    key: 'title',
    dataIndex: 'title'
  },
  {
    title: '告警对象',
    key: 'device',
    dataIndex: 'device'
  },
  {
    title: '告警类型',
    width: 90,
    key: 'device_type',
    dataIndex: 'device_type'
  },
  {
    title: '告警时间',
    key: 'last_time',
    dataIndex: 'last_time',
    customRender: (record) => {
      return moment(record).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '告警内容',
    key: 'content',
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
      exportLoading: false,
      ALARM_MAP,
      state: ALARM_STATE.unSolved,
      ALARM_STATE,
      ALARM_QUERY_LABEL,
      colLayout: {
        xl: 12,
        md: 12,
        sm: 24
      },
      queryParams: {
        process_status: '0'
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
      selectedRowKeys: [],
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条记录`,
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
      }
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
    handleSearch (page, size) {
      this.queryParams.limit = size
      this.queryParams.offset = page
      this.resetSelect()
      this.query()
    },
    onChangeState (activeKey) {
      this.state = activeKey
      this.queryParams = {}
      this.paginationOpt.defaultCurrent = 1
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
      const { data, page } = await alarm.post('/api/alert/main/list', {
        account_id: Vue.ls.get(USER).userId,
        limit: this.paginationOpt.defaultPageSize,
        offset: this.paginationOpt.defaultCurrent,
        ...this.queryParams
      })
      this.dataSource = data
      this.paginationOpt.total = page.total
    },
    resetQueryParams () {
      // TODO 重置查询
      this.queryParams = _.omit(this.queryParams, ['level', 'device_type', 'device', 'timeList', 'start_time', 'last_time'])
    },
    // 认领告警
    async claimAlarm (record) {
      try {
        this.loading = true
        // eslint-disable-next-line no-unused-vars
        const { code, msg } = await alarm.post('/api/alert/main/updates ', [{ id: record.ID, claim_status: '1', account_id: Vue.ls.get(USER).userId }])
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
        const { code, msg } = await alarm.post('/api/alert/main/updates ', [{ id: record.ID, process_status: '1', account_id: Vue.ls.get(USER).userId }])
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
      const parmas = this.selectedRows.map(el => ({ id: el.ID, claim_status: '1', account_id: Vue.ls.get(USER).userId }))
      try {
        this.loading = true
        const { code } = await alarm.post('/api/alert/main/updates ', parmas)
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
      const parmas = this.selectedRows.map(el => ({ id: el.ID, process_status: '1', claim_status: '1', account_id: Vue.ls.get(USER).userId }))
      try {
        this.loading = true
        const { code } = await alarm.post('/api/alert/main/updates ', parmas)
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
    },
    // 导出
    async downLoad () {
      try {
        this.exportLoading = true
        if (this.queryParams.timeList) {
          this.queryParams.start_time = this.queryParams.timeList[0]
          this.queryParams.last_time = this.queryParams.timeList[1]
        }
        const data = await alarm({
          url: '/api/alert/download',
          method: 'post',
          data: {
            account_id: Vue.ls.get(USER).userId,
            // alert_id: this.selectedRows.map(el => el.ID),
            ...this.queryParams
          },
          responseType: 'arraybuffer'
        })
        downloadExcel(`${ALARM_MAP.get(this.state)}` + '告警' + moment().format('YYYY-MM-DD HH:mm:ss') + '.xlsx', data)
        this.$notification.success({
          message: '系统提示',
          description: '导出告警记录成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: h => h('p', { domProps: { innerHTML: `导出告警记录失败${e}` } })
        })
        throw e
      } finally {
        this.exportLoading = false
      }
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  created () {
    this.query()
  },
  mounted () {
    // 在组件挂载后，发起异步请求加载用户数据
    const navContainer = document.querySelector('.unionAlarm .ant-tabs-nav-container')
    if (navContainer) {
      // 更改高度为 40px
      navContainer.style.cssText = 'height: 45px !important'
    }
  }
  // async beforeCreate () {
  //   try {
  //     const { data } = await alarm.get('/api/authentication/auth/get')
  //     const deData = decrypt(data)
  //     if (deData === '2') {
  //       await this.$router.push({ name: '600' })
  //     }
  //   } catch (e) {
  //     await this.$router.push({ name: '600' })
  //   }
  // }
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
  padding: 5px 10px;

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

.content_item {
  padding-left: 10px;
  padding-right: 10px;
}

.union_table {
  .ant-btn {
    min-width: 60px !important;
  }
}

</style>
