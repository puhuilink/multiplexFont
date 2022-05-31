<template>
  <div class="">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :lg="36" :md="8" :sm="24">
                <a-form-item label="城市" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.city" />
                </a-form-item>
              </a-col>
              <a-col :lg="36" :md="8" :sm="24">
                <a-form-item label="单位名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.name" />
                </a-form-item>
              </a-col>
              <!--              <a-col :lg="36" :md="8" :sm="24">-->
              <!--                <a-form-item label="经度" v-bind="formItemLayout" class="fw">-->
              <!--                  <a-input allowClear v-model.trim="queryParams.lng" />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--              <a-col :lg="36" :md="8" :sm="24">-->
              <!--                <a-form-item label="纬度" v-bind="formItemLayout" class="fw">-->
              <!--                  <a-input allowClear v-model.trim="queryParams.lat" />-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <!--            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />-->
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd" v-action:M0101>新增</a-button>
        <a-button @click="onEdit" v-action:M0101 :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="onDelete" v-action:M0101 :disabled="!hasSelected">删除</a-button>
      </template>
    </CTable>
    <UnitSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)">
    </UnitSchema>

  </div>
</template>

<script>
import { Confirm, List } from '~~~/Mixins'
import { CorpMapValueService } from '@/api/service/CorpMapValueService'
import { generateQuery } from '@/utils/graphql'
import UnitSchema from '@/views/system/unitManage/modules/unitSchema'
import _ from 'lodash'
import { axios } from '@/utils/request'
import moment from 'moment'
import { unitEnabledColumn } from '@/tables/alarm_rule/columns'

export default {
  name: 'Index',
  mixins: [Confirm, List],
  components: {
    UnitSchema
  },
  data () {
    return {
      columns: Object.freeze([
        {
          title: '城市',
          dataIndex: 'city',
          sorter: true,
          width: 180
        },
        {
          title: '经度',
          dataIndex: 'lng',
          width: 100,
          sorter: true,
          customRender: value => Number(value).toFixed(4)
        },
        {
          title: '纬度',
          dataIndex: 'lat',
          width: 100,
          tooltip: true,
          customRender: value => Number(value).toFixed(4)
        },
        {
          title: '单位名称',
          dataIndex: 'name',
          width: 120,
          sorter: true
        },
        {
          title: '对接系统',
          dataIndex: 'relation',
          width: 200,
          customRender: (value) => {
            const label = _.keys(value)
            return (
              <div>{
                label.map((el, index) => {
                  return <a-tag key={index}>{_.toUpper(el.split('_')[0])}</a-tag>
                })
              }</div>
            )
          }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          show: false,
          sortOrder: 'descend',
          width: 150,
          customRender: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '暂无日期'
        },
        ...[unitEnabledColumn].map(fn => fn.call(this))
      ]),
      selectedRows: []
    }
  },
  methods: {
    loadData (parameter) {
      return CorpMapValueService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        orderBy: { create_time: 'desc_nulls_last' },
        fields: [
          'id',
          'city',
          'lng',
          'lat',
          'name',
          'enabled',
          'address',
          'relation',
          'create_time'
        ],
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
    },
    onAdd () {
      this.$refs['schema'].add()
    },
    onEdit () {
      const [record] = this.selectedRows
      const str = []
      _.forOwn(record.relation, function (value, key) {
        str.push(`${key}/${value}`)
      })
      const values = _.cloneDeep(record)
      values.relation = str
      values.enabled = values.enabled.toString()
      this.$refs['schema'].edit(values)
    },
    onDelete () {
      const title = '删除'
      const content = '确定要删除选中的记录吗？'
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: async () => {
          const formData = new FormData()
          formData.append('corpIds', this.selectedRowKeys.map(el => Number(el)))
          axios.post('/corp/delete', formData, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          })
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
