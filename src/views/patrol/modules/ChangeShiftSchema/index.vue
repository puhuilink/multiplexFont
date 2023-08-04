<template>
  <a-modal
    centered
    :footer="null"
    :title="title"
    :width="820"
    wrapClassName="ChangeShiftSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >
    <a-spin :spinning="spinning">
      <div class="ChangeShiftSchema__block">
        <div class="font_head">交班</div>
        <a-row :gutter="[8,8]">
          <a-col :span="8" style="text-align: left">
            <span>交班人：{{ record.handName }}</span>
          </a-col>

          <a-col :span="9" style="text-align: left">
            <span>交班时间：{{ record.handTime }}</span>
          </a-col>

          <a-col :span="7" style="text-align: left">
            <span>交班状态：{{ record.status | status }}</span>
          </a-col>

          <a-col :span="8" style="text-align: left">
            <span>工具仪表、钥匙：{{ record.tool | tool }}</span>
          </a-col>

          <a-col :span="9" style="text-align: left">
            <span>图表资料：{{ record.paper | data }}</span>
          </a-col>

          <a-col :span="7" style="text-align: left">
            <span>监控平台运行状态：{{ record.monitorStatus | monitorStatus }}</span>
          </a-col>

          <a-col :span="8" style="text-align: left">
            <span>机房温度（℃）：{{ record.temperature }}</span>
          </a-col>

          <a-col :span="9" style="text-align: left">
            <span>机房湿度（%rH）：{{ record.humidity }}</span>
          </a-col>

          <a-col :span="7" style="text-align: left">
            <span>机房整洁度：{{ record.sanitary | sanitary }}</span>
          </a-col>
        </a-row>

        <a-row>
          <a-divider />

          <a-table
            :rowKey="(record, index) => index + 1"
            :columns="columns"
            bordered
            size="middle"
            :locale="locale"
            :dataSource="record.events"
            :pagination="false"
          ></a-table>

          <a-divider />

        </a-row>

        <div class="font_head">接班</div>
        <a-row>
          <a-col :span="8">
            <span>接班人：{{ record.receiveName }}</span>
          </a-col>
          <a-col :span="8" style="text-align: center">
            <span>接班时间：{{ record.receiveTime }}</span>
          </a-col>

        </a-row>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import moment from 'moment'
import { PatrolService } from '@/api'
import { camelExchange } from '@/utils/util'

export default {
  name: 'ChangeShiftSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data () {
    return {
      record: {},
      spinning: false,
      columns: [{
        title: '遗留事项',
        align: 'left',
        className: 'biaoTou',
        children: [
          {
            title: '序号',
            align: 'center',
            width: 50,
            customRender: (text, record, index) => index + 1
          },
          {
            title: '遗留内容',
            align: 'center',
            dataIndex: 'remark',
            key: 'remark'
          },
          {
            title: '状态',
            align: 'center',
            width: 150,
            sorter: (a, b) => {
              console.log('ab', a, b)
              return Number(a.eventstatus) - Number(b.eventstatus)
            },
            dataIndex: 'status',
            customRender: (text) => {
              console.log('text', text)
              return (<span class={Number(text) === 0 ? 'event_normal' : 'event_danger'}>{Number(text) === 0 ? '已完成' : '未完成'}</span>)
            }
          }
        ]
      }],
      locale: {
        emptyText: '暂无遗留事项'
      }
    }
  },
  filters: {
    data (data = '') {
      switch (data) {
        case '2':
          return '异常'
        case '1':
          return '正常'
        default:
          return ''
      }
    },
    list (list = '') {
      switch (list) {
        case '0':
          return '否'
        case '1':
          return '是'
        default:
          return ''
      }
    },
    monitorStatus (monitorStatus = '') {
      switch (monitorStatus) {
        case '2':
          return '异常'
        case '1':
          return '正常'
        default:
          return ''
      }
    },
    sanitary (sanitary = '') {
      switch (sanitary) {
        case '3':
          return '较差'
        case '2':
          return '良好'
        case '1':
          return '优秀'
        default:
          return ''
      }
    },
    status (status = '') {
      switch (status) {
        case 0:
          return '交接正常'
        case 1:
          return '交班正常'
        case 10:
          return '交班异常'
        case 20:
          return '接班异常'
        default:
          return '接口异常'
      }
    },
    tool (tool = '') {
      switch (tool) {
        case '1':
          return '正常'
        case '2':
          return '异常'
        default:
          return ''
      }
    },
    timeFormat (time = '') {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {},
  methods: {
    detail (id) {
      this.show('交接班日志表详情')
      this.fetch(id)
    },
    async fetch (id) {
      try {
        this.spinning = true
        this.record = camelExchange(await PatrolService.changeShiftDetail(id))
        console.log('record', this.record)
      } catch (e) {
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    }
  }
}
</script>

<style lang="less">
.ChangeShiftSchema {
  &__block {
    margin-bottom: 10px;
    padding: 10px 40px;
  }
}

.event_danger {
  color: red;
}

.event_normal {
  color: blue;
}
.biaoTou {
  background-color: rgba(249, 251,255) !important;
}

.font_head {
  font: 16px black;
  font-weight: bold;
  padding-bottom: 15px;
}
</style>
