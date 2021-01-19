<template>
  <fragment>
    <a-modal
      centered
      :confirmLoading="confirmLoading"
      :title="title"
      v-model="visible"
      :width="640"
      wrapClassName="ApproveSchema__modal"
      @cancel="cancel"
      :afterClose="reset"
      okText="发送"
      cancelText="取消"
      @ok="submit"
    >
      <template slot="footer">
        <a-button @click="editRule" class="fl">审批模板</a-button>
        <a-button @click="cancel">取消</a-button>
        <a-button @click="submit" :loading="submitLoading" type="primary">发送</a-button>
      </template>

      <a-spin :spinning="spinning">
        <ATable :columns="columns" :dataSource="events" :pagination="false" rowKey="id" />
      </a-spin>
    </a-modal>

    <TempRule ref="rule" @updateConfig="onUpdateConfig" />
  </fragment>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempRule from './modules/TempRule'
import { PatrolService, TempService } from '@/api'
import _ from 'lodash'

export default {
  name: 'ApproveSchema',
  mixins: [Schema],
  components: {
    TempRule
  },
  props: {},
  data () {
    return {
      columns: Object.freeze([
        {
          title: '通知等级',
          dataIndex: 'severity',
          width: 90,
          customRender: (severity) => (severity ? `L${severity}` : '')
        },
        {
          title: '通知用户',
          width: 90,
          customRender: (severity) => this.severityUserMapping.get(severity)
        },
        // {
        //   title: '通知方式',
        //   dataIndex: 'send_type',
        //   width: 180,
        //   customRender: sendType => sendType.map(type => SEND_TYPE_MAPPING.get(type)).join('、')
        // },
        {
          title: '通知内容',
          width: 180,
          customRender: () => '模板内容'
        }
      ]),
      // 告警具体条目
      events: [],
      senderConfig: [],
      spinning: false,
      submitLoading: false,
      tempConfig: []
    }
  },
  computed: {
    // 通知等级与通知用户映射关系
    severityUserMapping () {
      return new Map([
        ...this.senderConfig.map(({ event_level, userList }) => [
          event_level,
          userList.map(({ staff_name }) => staff_name).join('、')
        ])
      ])
      // return mapping
    }
  },
  methods: {
    approve (events = []) {
      this.show('审批预览')
      // this.fetchSenderConfig()
      this.fetch(events)
      this.events = events
    },
    editRule () {
      const { senderConfig = [], tempConfig = [] } = this
      this.$refs['rule'].open({ senderConfig, tempConfig })
    },

    async fetch (res) {
      try {
        this.spinning = true
        await Promise.all([
          this.fetchSenderConfig(res)
          // this.fetchTemp()
        ])
      } catch (e) {
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 获取发送配置
     */
    async fetchSenderConfig (res) {
      try {
        const senderConfig = await PatrolService.senderConfig(res)
        this.senderConfig = _.orderBy(senderConfig, ['event_level'], ['asc'])
      } catch (e) {
        this.senderConfig = []
        throw e
      }
    },
    /**
     * 获取发送模板
     */
    async fetchTemp () {
      try {
        // TODO: 根据任务单类型获取模板：IT / 动环
        this.tempConfig = await TempService.find()
      } catch (e) {
        this.tempConfig = null
        throw e
      }
    },
    /**
     * 更新模板规则（可能为临时 / 默认模板）
     */
    onUpdateConfig ({ senderConfig = [], tempConfig = [] }) {
      this.senderConfig = senderConfig
      this.tempConfig = tempConfig
    },
    async send () {
      try {
        this.submitLoading = true
        await PatrolService.approveSend()
      } catch (e) {
        throw e
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.ApproveSchema {
  &__modal {
    .ant-modal-body {
      height: 500px;
      overflow-y: auto;
    }
  }
}
</style>
