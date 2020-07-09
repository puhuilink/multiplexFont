<template>
  <div class="PatrolPath">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
      :rowSelection="null"
      :scroll="scroll"
      :showPagination="false"
    >
    </CTable>
  </div>
</template>

<script>
import mixin from './mixin'
import { PatrolService } from '@/api-hasura'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
// import _ from 'lodash'

export const patrolPathRule = {
  // alias: [
  //   { required: true, message: '请输入计划名称' }
  // ],
  // group_id: [
  //   { required: true, message: '请选择巡更组' }
  // ]
}

export default {
  name: 'PatrolPath',
  mixins: [List, mixin],
  components: {},
  props: {},
  data () {
    return {
      columns: Object.freeze([
        {
          title: '路线名称',
          dataIndex: 'path.alias',
          width: 180
        },
        {
          title: '巡检区域',
          dataIndex: 'zone.alias',
          width: 180
        },
        {
          title: '路线展示',
          width: 90,
          customRender: () => (<a-button type="link">查看路线</a-button>)
        }
      ])
    }
  },
  computed: {
    group_id () {
      return this.plan ? this.plan.group_id : ''
    },
    scrollY () {
      return 100
    }
  },
  watch: {
    group_id () {
      this.query(false)
    }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      const { group_id } = this
      return PatrolService.planFind(({
        where: {
          // 如果选中工作组，则展示该工作组下的路线
          ...generateQuery({ group_id })
        },
        fields: [
          `group_id`,
          `path { id alias }`,
          `zone { alias }`
        ],
        alias: 'data'
      }))
        .then(r => r.data)
    }
  }
}
</script>

<style lang="less">
.PatrolPath {

  .ant-btn-link {
    padding-left: 0;
  }
}
</style>
