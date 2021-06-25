<template>
  <fragment>
    <a-modal
      centered
      :confirmLoading="confirmLoading"
      :title="title"
      v-model="visible"
      :width="800"
      wrapClassName="ApproveSchema__modal"
      @cancel="cancel"
      :afterClose="reset"
      okText="发送"
      cancelText="取消"
    >
      <template slot="footer">
        <a-button :loading="examineLoading" @click="editRule" class="fl">审批模板</a-button>
        <a-button @click="cancel">取消</a-button>
        <a-button @click="submitMsg" :loading="submitLoading" type="primary">发送</a-button>
      </template>

      <a-spin :spinning="spinning">
        <ATable :columns="columns" :dataSource="events" rowKey="id" bordered/>
      </a-spin>
    </a-modal>

    <TempRule ref="rule" @updateConfig="onUpdateConfig" @submit="succeedSubmit"/>
  </fragment>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import TempRule from './modules/TempRule'
import { PatrolService, TempService } from '@/api'
import _ from 'lodash'
import { xungeng } from '@/utils/request'
import uuid from 'uuid/v4'

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
          customRender: (__, severity) => __ ? `L${__}` : {}
        },
        {
          title: '通知用户',
          dataIndex: 'staffName',
          width: 120,
          customRender: (contact) => {
            if (contact) { return _.join(contact, '/') } else return '未找到用户'
          }
        },
        {
          title: '通知方式',
          // dataIndex: 'send_type',
          width: 55,
          align: 'center',
          // customRender: sendType => sendType.map(type => SEND_TYPE_MAPPING.get(type)).join('、')
          customRender: () => <div>
            <tr>短信</tr>
            <hr style="background-color:rgb(210,210,210);height:1px;border:none;"/>
            <tr>邮件</tr>
          </div>
        },
        {
          title: '通知内容',
          width: 360,
          customRender: (__, record, index) => {
            // 筛选对象转换成数组
            const senderList = _.pick(record, ['smsMessage', 'emailMessage'])
            // senderList.smsMessage = '短信   '.concat(senderList.smsMessage)
            // senderList.emailMessage = '邮件   '.concat(senderList.emailMessage)
            const sendList = _.values(senderList)
            return (<div style="width:100%;">
              <tr>{sendList[0]}</tr>
              <hr style="background-color:rgb(210,210,210);height:1px;border:none;"/>
              <tr>{sendList[1]}</tr>
            </div>)
          }
        }
      ]),
      // 告警具体条目
      events: [],
      senderConfig: [],
      spinning: false,
      submitLoading: false,
      examineLoading: false,
      tempConfig: [],
      formModel: {
        taskId: '',
        eventIds: []
      }
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
    uuid,
    async submitMsg () {
      try {
        this.submitLoading = true
        const { code } = await xungeng.post('/approval/sendMessage', this.formModel)
        if (code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '审批成功'
          })
          this.$emit('success')
        }
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.submitLoading = false
        this.cancel()
      }
    },
    approve (taskId, events) {
      this.show('审批配置')
      this.formModel.taskId = taskId
      this.formModel.eventIds = events.map(el => el.id)
      // this.fetchSenderConfig()
      this.fetch(taskId, events)
      this.events = events
    },
    editRule () {
      const { senderConfig = [] } = this
      const eventsList = _.sortBy(_.unionBy(this.events, 'severity'), item => item.severity)
      if (!!_.find(eventsList, 'tempSmsId') || !!_.find(eventsList, 'tempEmailId')) {
        this.examineLoading = true
        this.$refs['rule'].open({ senderConfig }, this.formModel.eventIds)
        setInterval(() => { this.examineLoading = false }, 500)
      } else {
        alert('暂无联系人模板')
      }
    },
    succeedSubmit () {
      this.$emit('success')
      this.cancel()
    },
    async fetch (taskId, events) {
      try {
        this.spinning = true
        await Promise.all([
          this.fetchSenderConfig(taskId, events)
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
    async fetchSenderConfig (taskId, events) {
      try {
        // const senderConfig = await PatrolService.senderConfig(taskId, res)
        const senderConfig = await PatrolService.previewApproval(taskId, events)
        this.events = senderConfig
        this.senderConfig.push(taskId, senderConfig)
        // this.formModel.eventIds =
        // this.senderConfig = _.orderBy(senderConfig, ['event_level'], ['asc'])
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
