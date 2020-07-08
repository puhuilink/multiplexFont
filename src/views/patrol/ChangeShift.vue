<template>
  <div class="ChangeShift">
    <div class="user">
      <CTable
        :columns="columns"
        :data="loadData"
        ref="table"
        rowKey="id"
        :rowSelection="rowSelection"
        :scroll="scroll"
      >

        <!-- / 操作区域 -->
        <template #query>
          <a-form layout="inline" class="form">
            <div :class="{ fold: !advanced }">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="交接人员姓名"
                    v-bind="formItemLayout"
                    class="fw"
                  >
                    <a-input allowClear v-model.trim="queryParams.user_id" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <span :class="advanced ? 'expand' : 'collapse'">
              <QueryBtn @click="query" />
              <ResetBtn @click="resetQueryParams" />
              <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
            </span>
          </a-form>
        </template>

        <!-- / 操作区域 -->
        <template #operation>
          <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
          <a-button @click="onExport" :disabled="!hasSelected">导出</a-button>
        </template>

      </CTable>

      <ChangeShiftSchema
        ref="schema"
      />
    </div>
  </div>
</template>

<script>
import { PatrolService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import ChangeShiftSchema from './modules/ChangeShiftSchema'

export default {
  name: 'ChangeShift',
  mixins: [Confirm, List],
  components: {
    ChangeShiftSchema
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      // {
      //   title: '巡更组',
      //   dataIndex: '',
      //   sorter: true,
      //   width: 180
      // },
      {
        title: '交班人姓名',
        dataIndex: 'hand_name',
        sorter: true,
        width: 180
      },
      {
        title: '交班时间',
        dataIndex: 'hand_time',
        sorter: true,
        width: 180
      },
      // {
      //   title: '交班状态',
      //   dataIndex: 'hand_time',
      //   sorter: true,
      //   width: 180
      // },
      {
        title: '接班人姓名',
        dataIndex: 'receive_name',
        sorter: true,
        width: 180
      },
      // {
      //   title: '接班状态',
      //   dataIndex: 'receive_time',
      //   sorter: true,
      //   width: 180
      // },
      {
        title: '交接时间',
        dataIndex: 'receive_time',
        sorter: true,
        width: 180
      }
      // {
      //   title: '交接状态',
      //   dataIndex: 'user_id',
      //   sorter: true,
      //   width: 180
      // }
    ])
  }),
  computed: {},
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return PatrolService.changeShiftFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onDetail () {
      const [record] = this.selectedRowKeys
      this.$refs['schema'].detail(record)
    },
    onExport () {}
  }
}
</script>

<style lang="less">

</style>
