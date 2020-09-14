<script>
import AlarmDetail from '../../modules/AlarmDetail'

export default {
  name: 'AlarmLogHistoryDetail',
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    formItemList: Object.freeze([
      { label: '告警编号', key: 'id' },
      {
        children: [
          { label: '告警等级', key: 'alarm_level' },
          { label: '告警次数', key: 'alarm_level' }
        ]
      },
      {
        children: [
          { label: '事件等级', key: '' },
          { label: '升级次数', key: '' },
          { label: '升级时间', key: '' }
        ]
      },
      { label: '告警状态', key: 'state' },
      { label: '设备名称', key: '' },
      {
        children: [
          { label: '监控实例', key: '' },
          { label: 'KPI值', key: '' }
        ]
      },
      { label: '首次告警时间', key: '' },
      { label: '最近告警时间', key: '' },
      { label: '前转人', key: 'forward_person' },
      { label: '前转时间', key: 'forward_time' },
      { label: '解决人', key: 'forward_person' },
      { label: '解决时间', key: 'forward_time' },
      { label: '合并时间', key: 'merge_time' },
      { label: '合并次数', key: 'merge_count' },
      { label: '采集系统', key: 'agent_id' },
      { label: '消息内容', key: 'detail' }
    ])
  }),
  computed: {},
  methods: {
    fetch (id) {

    },
    open (id) {
      this.$refs.detail.open(id)
    }
  },
  render (h) {
    const { formItemList } = this
    return h(AlarmDetail, {
      props: {
        formItemList,
        useResolve: false
      },
      ref: 'detail'
    })
  }
}
</script>

<style lang="less">

</style>
