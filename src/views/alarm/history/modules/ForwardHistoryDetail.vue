<template>
  <a-modal
    centered
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="ForwardHistoryDetail__modal"
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

export default {
  name: 'ForwardHistoryDetail',
  mixins: [Schema],
  components: {
    DetailForm
  },
  props: {},
  data: () => ({
    formItemList: Object.freeze([
      { label: '前转时间', key: 'send_time' }
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
    open (id) {
      this.show('前转详情')
      this.fetch(id)
    }
  }
}
</script>

<style lang="less">

</style>
