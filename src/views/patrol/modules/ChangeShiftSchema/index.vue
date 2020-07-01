<template>
  <a-modal
    centered
    :footer="null"
    :title="title"
    :width="720"
    wrapClassName="ChangeShiftSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >
    <a-spin :spinning="spinning">
      <p>交班</p>
      交班人： {{ record.hand_name }}
      <p>接班</p>
      接班人：{{ record.receive_name }}
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { PatrolService } from '@/api-hasura'

export default {
  name: 'ChangeShiftSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    record: {},
    spinning: false
  }),
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

</style>
