<template>
  <div class="PatrolPath" v-show="false">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      :rowKey="el => el.pathId+','+el.zone_id"
      :scroll="scroll"
      :showPagination="false"
    >
    </CTable>
  </div>
</template>

<script>
import mixin from './mixin'
import { PatrolService } from '@/api'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export const patrolPathRule = {
  alias: [
    { required: true, message: '请输入计划名称' }
  ],
  group_id: [
    { required: true, message: '请选择巡更组' }
  ]
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
          dataIndex: 'alias',
          width: 180
        },
        {
          title: '巡检区域',
          dataIndex: 'zone.alias',
          width: 180
        }
      ])
    }
  },
  computed: {
    group_id () {
      return this.plan ? this.plan.groupId : ''
    },
    scrollY () {
      return 100
    }
    // rowSelection () {
    //   return {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       const [pathId, zoneId] = [...selectedRowKeys.toString().split(',')]
    //       // this.plan.pathId = pathId
    //       // this.plan.zoneId = zoneId
    //     },
    //     getCheckboxProps: record => ({
    //       props: {
    //         defaultChecked: true
    //       },
    //     }),
    //   };
    // }
    // rowSelection () {
    //   return {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, '123', this.plan)
    //       const [pathId, zoneId] = [...selectedRowKeys.toString().split(',')]
    //       this.plan.pathId = pathId
    //       this.plan.zoneId = zoneId
    //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, '123', this.plan)
    //     },
    //     getCheckboxProps: record => ({
    //       props: {
    //         defaultChecked: Object.is(this.plan.pathId, (record.key) ? record.key.split(',')[0] : NaN)
    //       }
    //     })
    //   }
    // }
  },
  watch: {
    group_id () {
      this.query(false)
    }
    // 'rowSelection': {
    //   immediate: true,
    //   handler (value) {
    //     if (value) {
    //       const { selectedRowKeys, ...rest } = this.rowSelection
    //       const [pathId, zoneId] = [...selectedRowKeys.toString().split(',')]
    //       this.plan.pathId = pathId
    //       this.plan.zoneId = zoneId
    //     }
    //   }
    // }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      const { group_id } = this
      return PatrolService.pathFind(({
        where: {
          // 如果选中工作组，则展示该工作组下的路线
          ...generateQuery({ group_id })
        },
        fields: [
          `pathId: id`,
          `group_id`,
          `alias`,
          `zone { alias }`,
          `zone_id`
        ],
        alias: 'data'
      }))
        .then(r => {
          const data = r.data
          if (data.data.length !== 0) {
            this.plan.pathId = _.first(data.data).pathId
            this.plan.zoneId = _.first(data.data).zone_id
          } else {
            this.plan.pathId = ''
            this.plan.zoneId = ''
          }
          return r.data
        })
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
