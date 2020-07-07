<template>
  <div class="EventList">
    <CTable
      :columns="columns"
      :data="loadData"
      :showPagination="false"
      rowKey="id"
      :rowSelection="rowSelection"
      :subScroll="scroll"
    />
  </div>
</template>

<script>
import { PatrolService } from '@/api-hasura'
import { List } from '@/components/Mixins'
import _ from 'lodash'

export default {
  name: 'EventList',
  mixins: [List],
  components: {},
  props: {
    taskId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: Object.freeze([
        {
          title: '告警级别',
          dataIndex: 'severity',
          sorter: true,
          width: 180
        },
        // {
        //   title: '楼层',
        //   dataIndex: 'id',
        //   sorter: true,
        //   width: 180
        // },
        // {
        //   title: '巡更点位',
        //   dataIndex: 'id',
        //   sorter: true,
        //   width: 180
        // },
        // {
        //   title: '柜位',
        //   dataIndex: 'id',
        //   sorter: true,
        //   width: 180
        // },
        {
          title: '设备',
          dataIndex: 'host_id',
          sorter: true,
          width: 180
        },
        {
          title: '检查项',
          dataIndex: 'metric_id',
          sorter: true,
          width: 180
        },
        {
          title: '值',
          dataIndex: 'value',
          sorter: true,
          width: 180
        },
        {
          title: '备注',
          dataIndex: 'note',
          sorter: true,
          width: 180
        },
        {
          title: '图片',
          dataIndex: 'tags',
          sorter: true,
          width: 180,
          customRender: tags => {
            try {
            // eslint-disable-next-line no-eval
              const { imgs = [] } = eval(tags)
              // return <img >
              return imgs.map(src => <img src={src} />)
            } catch (e) {
              return []
            }
          }
        }
      ])
    }
  },
  computed: {
    scrollY () {
      return 200
    }
  },
  methods: {
    loadData (parameter) {
      const { taskId: task_id } = this
      return PatrolService.eventFind({
        where: { task_id },
        fields: _.uniq([ 'id', ...this.columns.map(({ dataIndex }) => dataIndex) ]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
