<template>
  <a-modal
    centered
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="AlarmLogForwardDetail__modal"
    :afterClose="reset"
  >
    <template slot="footer">
      <a-button key="back" @click="cancel">取消</a-button>
    </template>

    <a-spin :spinning="spinning">
      <DetailForm :formItemList="formItemList" :record="record" />
    </a-spin>
  </a-modal>
</template>

<script>
import DetailForm from '../../modules/DetailForm'
import Schema from '@/components/Mixins/Modal/Schema'
import { AlarmForwardService } from '@/api-hasura'
import moment from 'moment'

export default {
  name: 'AlarmLogForwardDetail',
  mixins: [Schema],
  components: {
    DetailForm
  },
  props: {},
  data: () => ({
    formItemList: Object.freeze([
      {
        label: '通知时间',
        key: 'send_time',
        customRender: send_time => send_time ? moment(send_time).format() : ''
      },
      {
        label: '通知状态',
        key: 'status',
        customRender: status => status ? '已通知' : '通知失败'
      },
      {
        label: '通知内容',
        textarea: true,
        key: 'send_content'
      }
    ]),
    record: {},
    spinning: false
  }),
  computed: {},
  methods: {
    async fetch (id) {
      try {
        this.spinning = true
        this.record = await AlarmForwardService.detail(id)
      } catch (e) {
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    open (record) {
      this.show('前转详情')
      this.record = record
    }
  }
}
</script>

<style lang="less">

</style>
