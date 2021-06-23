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
        <h2>交班</h2>
        <a-row>
          <a-col :span="8">
            <span>交班人：{{ record.hand_name }}</span>
          </a-col>

          <!--          <a-col :span="8">-->
          <!--            <span>状态：{{ record.status | status }}</span>-->
          <!--          </a-col>-->

          <a-col :span="8">
            <span>交班时间：{{ record.hand_time | timeFormat }}</span>
          </a-col>

        </a-row>

        <a-row>
          <a-col :span="8">
            <span>工具仪表、钥匙：{{ record.tool | tool }}</span>
          </a-col>
          <a-col :span="8">
            <span>图纸资料：{{ record.data | data }}</span>
          </a-col>
          <a-col :span="8">
            <span>监控平台运行状态：{{ record.monitor_status | monitorStatus }}</span>
          </a-col>

        </a-row>

        <a-row>
          <a-col :span="8">
            <span>机房温度（℃）：{{ record.temperature }}</span>
          </a-col>

          <a-col :span="8">
            <span>机房湿度（%rH）：{{ record.sanitary | sanitary }}</span>
          </a-col>

          <a-col :span="8">
            <span>机房整洁度：{{ record.hand_name }}</span>
          </a-col>
        </a-row>

        <h3>遗留事项</h3>
        <a-row>
          <a-col :span="12">
            <span>告警信息：{{ record.alarm_info }}</span>
          </a-col>

          <a-col :span="12">
            <span>故障情况：{{ record.fault_conditions }}</span>
          </a-col>

        </a-row>

        <a-row>
          <a-col :span="12">
            <span>配合工作：{{ record.cooperation }}</span>
          </a-col>

          <a-col :span="12">
            <span>其他： {{ record.other }}</span>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <span>其他事项：{{ record.other_matter }}</span>
          </a-col>
        </a-row>
      </div>

      <a-divider />

      <div class="ChangeShiftSchema__block">
        <h2>接班</h2>
        <a-row>
          <a-col :span="8">
            <span>接班人：{{ record.receive_name }}</span>
          </a-col>

          <!--          <a-col :span="8">-->
          <!--            <span>状态：{{ record.status | status }}</span>-->
          <!--          </a-col>-->

          <a-col :span="8">
            <span>交班时间：{{ record.receive_time | timeFormat }}</span>
          </a-col>

        </a-row>

        <h3>交接文档</h3>
        <a-row>
          <a-col :span="8">
            <span>设备日常巡检表：{{ record.inspection_list | list }}</span>
          </a-col>

          <a-col :span="8">
            <span>监控值班记录表：{{ record.log_list | list }}</span>
          </a-col>

          <a-col :span="8">
            <span>运维日志表：{{ record.inspection_list | list }}</span>
          </a-col>

        </a-row>

        <a-row>
          <a-col :span="24">
            <span>详细描述：{{ record.detail_description }}</span>
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

export default {
  name: 'ChangeShiftSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    record: {},
    spinning: false
  }),
  filters: {
    data (data = '') {
      switch (data) {
        case '0':
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
        case '0':
          return '异常'
        case '1':
          return '正常'
        default:
          return ''
      }
    },
    sanitary (sanitary = '') {
      switch (sanitary) {
        case '0':
          return '较差'
        case '1':
          return '良好'
        case '2':
          return '优秀'
        default:
          return ''
      }
    },
    status (status = '') {
      switch (status) {
        case '0':
          return '已关闭'
        case '1':
          return '已交班'
        case '2':
          return '已接班'
        default:
          return ''
      }
    },
    tool (tool = '') {
      switch (tool) {
        case '0':
          return '异常'
        case '1':
          return '正常'
        default:
          return ''
      }
    },
    timeFormat (time = '') {
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
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
        this.record = await PatrolService.changeShiftDetail(id)
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
  }
}
</style>
