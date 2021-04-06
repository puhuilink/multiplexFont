
<template>
  <a-modal
    :afterClose="reset"
    cancelText="取消"
    centered
    :confirmLoading="confirmLoading"
    :footer="null"
    :title="title"
    :width="1140"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="cancel"
    @ok="submit">

    <PerformanceDetail
      :hostId="hostId"
      v-if="hostId"
    />

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import PerformanceDetail from '@/components/Performance/Detail.vue'

export default {
  name: 'AlarmPopupDetails',
  mixins: [Schema],
  components: {
    PerformanceDetail
  },
  data () {
    return {
      confirmLoading: false,
      submit: () => {},
      hostId: null
    }
  },
  methods: {
    /**
     * 打开闪烁告警问题弹窗
     */
    add ([{ hostId }]) {
      this.show('监控对象')
      this.hostId = hostId
    }
  }
}
</script>

<style lang="less">
</style>
