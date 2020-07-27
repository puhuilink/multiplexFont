<template>
  <div class="EventList">
    <CTable
      :columns="columns"
      :data="loadData"
      :showPagination="false"
      rowKey="id"
      :rowSelection="hasReviewed ? null : rowSelection"
      :subScroll="scroll"
    />

    <a-modal wrapClassName="EventList__modal" v-model="visible" :footer="null">
      <img class="EventList__modal_img" :src="src" />
    </a-modal>
  </div>
</template>

<script>
import { PatrolService } from '@/api-hasura'
import { List } from '@/components/Mixins'
import _ from 'lodash'
import { ANSWER_TYPE_SELECT } from '../../typing'

export default {
  name: 'EventList',
  mixins: [List],
  components: {},
  props: {
    taskId: {
      type: Number,
      required: true
    },
    // 已审批过的任务单无法再次审批
    hasReviewed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: Object.freeze([
        {
          title: '告警级别',
          dataIndex: 'severity',
          sorter: true,
          width: 90
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
          dataIndex: 'host { alias }',
          width: 180,
          customRender: (__, { host }) => _.get(host, 'alias')
        },
        {
          title: '检查项',
          dataIndex: 'metric { alias }',
          width: 180,
          customRender: (__, { metric }) => _.get(metric, 'alias')
        },
        {
          title: '值',
          dataIndex: 'value',
          sorter: true,
          width: 180,
          customRender: (value, { answer: { alias, format, type } }) => {
            if (type === ANSWER_TYPE_SELECT) {
              const aliasList = alias.split('/')
              const index = format.findIndex(f => f.value === value)
              return aliasList[index]
            } else {
              return value
            }
          }
        },
        {
          title: '备注',
          dataIndex: 'note',
          tooltip: true,
          width: 220
        },
        {
          title: '图片',
          dataIndex: 'tags',
          width: 220,
          customRender: tags => {
            try {
            // eslint-disable-next-line no-eval
              const { imgs = [] } = eval(tags)
              // const imgs = ['https://qn.antdv.com/vue.png']
              return imgs.map(src => <img class="EventList__tags_img" src={src} onClick={() => this.previewImg(src)} />)
            } catch (e) {
              return []
            }
          }
        }
      ]),
      src: '',
      visible: false
    }
  },
  computed: {
    scrollY () {
      return 200
    },
    rowSelection () {
      const { selectedRows, selectedRowKeys, selectRow: onChange } = this
      return {
        onChange,
        selectedRows,
        selectedRowKeys,
        getCheckboxProps: record => ({
          props: {
            // TODO: 确定常量值
            disabled: record.status === '已发送'
          }
        })
      }
    }
  },
  watch: {
    hasReviewed (hasReviewed) {
      // 任务单已审批，则之前选中的异常项不能进行审批
      if (hasReviewed) {
        this.$emit('selectSubRow', {
          selectedRows: [],
          taskId: this.taskId
        })
      }
    },
    selectedRows () {
      const selectedRows = this.selectedRows.map(
        selectedRow => _.mapValues(selectedRow, value => _.get(value, 'alias', value))
      )
      this.$emit('selectSubRow', {
        selectedRows: _.cloneDeep(selectedRows),
        taskId: this.taskId
      })
    }
  },
  methods: {
    loadData (parameter) {
      const { taskId: task_id } = this
      return PatrolService.eventFind({
        where: { task_id },
        fields: _.uniq([
          'id',
          ...this.columns.map(({ dataIndex }) => dataIndex),
          'answer { alias format type }',
          'status'
        ]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    previewImg (src) {
      this.visible = true
      this.src = src
    }
  }
}
</script>

<style lang="less">
.EventList {

  &__modal {
    &_img {
      width: 360px;
      height: 360px;
    }
  }

  &__tags {

    &_img {
      width: 36px;
      height: 36px;
      cursor: pointer;
    }
  }
}
</style>
