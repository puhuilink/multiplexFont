<template>
  <div class="index">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      :rowKey="rowKey"
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
                  label="监控实体"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <CmdbEndpointList
                    :parentId="host_id"
                    :value.sync="queryParams.endpoint_id"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="检查项"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <CmdbMetricSelect
                    :parentId="queryParams.endpoint_id"
                    :value.sync="queryParams.metric_id"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item
                  label="采集时间"
                  v-bind="fullFormItemLayout"
                  class="fw"
                >
                  <a-range-picker
                    allowClear
                    class="fw"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                    :ranges="{
                      '最近一天': [moment(), moment()],
                      '最近一周': [moment().add(-7, 'days'), moment()],
                      '最近一月': [moment().add(-30, 'days'), moment()]
                    }"
                    :showTime="{ format: 'HH:mm' }"
                    v-model="queryParams.collect_time"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
          </span>
        </a-form>
      </template>

    </CTable>
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { MetricService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import moment from 'moment'
import { CmdbEndpointList, CmdbMetricSelect } from '@/components/Cmdb'

export default {
  name: 'PerformanceList',
  mixins: [List],
  components: {
    CmdbEndpointList,
    CmdbMetricSelect
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      // {
      //   title: '监控对象',
      //   dataIndex: 'host_id',
      //   sorter: true,
      //   width: 180,
      //   customRender: (__, { host_id, cmdb = {} }) => _.get(cmdb, 'host_alias') || host_id
      // },
      {
        title: '监控实体',
        dataIndex: 'endpoint_id',
        sorter: true,
        width: 180,
        customRender: (__, { endpoint_id, cmdb = {} }) => _.get(cmdb, 'endpoint_alias') || endpoint_id
      },
      {
        title: '检查项',
        dataIndex: 'metric_id',
        sorter: true,
        width: 180,
        customRender: (__, { metric_id, cmdb = {} }) => _.get(cmdb, 'metric_alias') || metric_id
      },
      {
        title: '指标值',
        dataIndex: 'metric_value metric_value_str',
        sorter: false,
        width: 180,
        customRender: (__, { metric_value, metric_value_str }) => metric_value || metric_value_str
      },
      {
        title: '采集时间',
        dataIndex: 'collect_time',
        sorter: true,
        width: 180,
        customRender: (collectTime) => collectTime ? moment(collectTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    ]),
    queryParams: {
      // 默认查询最近一个月的数据，避免一次性查询所有数据
      'collect_time': [
        // moment().add(-30, 'days'),
        // moment()
        moment('2020-07-31 22:25'),
        moment('2020-08-01 22:25')
      ]
    }
  }),
  computed: {
    scrollY () {
      return 'max(calc(100vh - 420px), 100px)'
    },
    // FIXME: host_id 作为 props
    host_id () {
      return _.get(this.where, 'host_id._eq') || _.get(this.where, 'host_id')
    }
  },
  watch: {
    where: {
      immediate: true,
      deep: true,
      async handler (where) {
        await this.$nextTick()
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    moment,
    loadData (parameter) {
      if (_.isEmpty(this.where)) {
        return {}
      }
      return MetricService.find(({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: [
          ...this.columns.map(({ dataIndex }) => dataIndex),
          'metric_value_str',
          `cmdb {
            endpoint_alias
            metric_alias
          }`
        ],
        ...parameter,
        alias: 'data'
      })).then(r => r.data)
    },
    rowKey (row) {
      return `${Math.random()}-${row.host_id}-${row.endpoint_id}-${row.metric_id}-${row.collect_time}`
    }
  }
}
</script>

<style lang="less">

</style>
