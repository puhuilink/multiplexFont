<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="640"
    wrapClassName="TemporaryApproveRule__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form :form="form" layout="vertical">
    </a-form>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'TemporaryApproveRule',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    open () {
      this.show('告警审批规则')
    }
  }
}
</script>

<style lang="less">

</style>
