<template>
  <a-table>
  </a-table>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      columns: [
        {
          title: '监控对象',
          dataIndex: 'host_alias',
          scopedSlots: { customRender: 'host' }
        },
        {
          title: '监控实体',
          dataIndex: 'endpoint_alias',
          scopedSlots: { customRender: 'endpoint' }
        },
        {
          title: '检查项',
          dataIndex: 'metric_alias',
          scopedSlots: { customRender: 'metric' }
        },
        {
          title: '检查值',
          dataIndex: 'answer_alias',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '条件',
          dataIndex: 'condition',
          scopedSlots: { customRender: 'condition' }
        },
        {
          title: '阈值',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
</style>
