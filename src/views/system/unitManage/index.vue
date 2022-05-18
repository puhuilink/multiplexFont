<template>
  <div class="">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
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
                <a-form-item label="经度" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.lng" />
                </a-form-item>
              </a-col>
              <a-col :lg="36" :md="8" :sm="24">
                <a-form-item label="纬度" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.lat" />
                </a-form-item>
              </a-col>
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
        <a-button @click="onDelete" v-action:M0101 :disabled="!hasSelectedOne">删除</a-button>
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
          width: 180,
          customRender: (value) => {
            if (value) {
              return value.split('/')[0]
            }
          }
        },
        {
          title: '经度',
          dataIndex: 'lng',
          width: 150,
          sorter: true,
          customRender: value => Number(value).toFixed(4)
        },
        {
          title: '纬度',
          dataIndex: 'lat',
          width: 170,
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
          width: 100,
          customRender: (value) => {
            const label = _.keys(value)
            return (
              <div>{
                label.map((el, index) => {
                  return <a-tag key= { index }>{_.toUpper(el.split('_')[0])}</a-tag>
                })
              }</div>
            )
          }
        }
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
        fields: [
          'id',
          'city',
          'lng',
          'lat',
          'name',
          'enabled',
          'address',
          'relation'
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
      const [record] = this.selectedRows
      const title = '删除'
      const content = '确定要删除选中的记录吗？'
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: () => {
          axios.post('/corp/delete', _.pick(record, ['id']))
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
