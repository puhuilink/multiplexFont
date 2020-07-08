<template>
  <div class="Route">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
      :rowSelection="null"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="用户名"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="姓名"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
          </span>
        </a-form>
      </template>
    </CTable>
  </div>
</template>

<script>
import mixin from './mixin'
import { PatrolService } from '@/api-hasura'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export default {
  name: 'Route',
  mixins: [List, mixin],
  components: {},
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '路线名称',
        dataIndex: 'alias',
        sorter: true,
        width: 180
      },
      {
        title: '巡检区域',
        dataIndex: 'zone_id',
        sorter: true,
        width: 180
      }
      // {
      //   title: '路线展示',
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
      return PatrolService.pathFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
