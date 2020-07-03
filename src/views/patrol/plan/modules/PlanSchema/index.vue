<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="PlanSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-spin :spinning="spinning">
      <!-- {{ record.alias }} -->
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { PatrolService } from '@/api-hasura'

export default {
  name: 'PlanSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    record: {},
    spinning: false
  }),
  computed: {},
  methods: {
    add () {
      this.submit = this.insert
      this.show('新增巡检计划')
    },
    edit (id) {
      this.submit = this.update
      this.show('编辑巡检计划')
      this.fetch(id)
    },
    async fetch (id) {
      try {
        this.spinning = true
        this.record = await PatrolService.planDetail(id)
      } catch (e) {
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {},
    async update () {}
  }
}
</script>

<style lang="less">

</style>
