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
        <a-button @click="editRule" class="fl">告警审批规则</a-button>
        <a-button @click="cancel">取消</a-button>
        <a-button @click="submit" type="primary">发送</a-button>
      </template>

      <a-spin :spinning="spinning">
        <ATable
          :columns="columns"
          :dataSource="events"
          :pagination="false"
          rowKey="id"
        />
      </a-spin>

    </a-modal>

    <TemporaryApproveRule ref="rule" />
  </fragment>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TemporaryApproveRule from './TemporaryApproveRule'
import { PatrolService, TempService } from '@/api-hasura'
// import { SEND_TYPE_MAPPING } from '../../../typing'

export default {
  name: 'ApproveSchema',
  mixins: [Schema],
  components: {
    TemporaryApproveRule
  },
  props: {},
  data () {
    return {
      columns: Object.freeze([
        {
          title: '通知等级',
          dataIndex: 'severity',
          width: 180,
          customRender: severity => severity ? `L${severity}` : ''
        },
        {
          title: '通知用户',
          width: 180,
          customRender: severity => this.severityUserMapping.get(severity)
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
      temp: null
    }
  },
  computed: {
    // 通知等级与通知用户映射关系
    severityUserMapping () {
      const mapping = new Map()
      this.senderConfig.forEach(({ event_level, userList }) => {
        mapping.set(event_level, userList.map(({ staff_name }) => staff_name).join('、'))
      })
      return mapping
    }
  },
  methods: {
    approve (events) {
      this.show('审批预览')
      this.fetchSenderConfig()
      this.events = events
    },
    editRule () {
      this.$refs['rule'].open()
    },
    async fetch () {
      try {
        this.spinning = true
        await Promise.all([
          this.fetchSenderConfig()
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
    async fetchSenderConfig () {
      try {
        this.senderConfig = await PatrolService.senderConfig()
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
        this.temp = await TempService.find()
      } catch (e) {
        this.temp = null
        throw e
      }
    }
  }
}
</script>

<style lang="less">

</style>
