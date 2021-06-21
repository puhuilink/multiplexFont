<template>
  <div class="PatrolTemp">
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

              <a-col :md="12" :sm="24">
                <a-form-item label="规则名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="启用状态" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model.number="queryParams.enabled" >
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
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

      <!-- / 操作区域 -->
      <template #operation>
        <a-select v-model="queryParams.type" @change="query">
          <a-select-option
            v-for="(label, value) in allMode"
            :key="value"
            :value="value"
          >{{ label }}</a-select-option>
        </a-select>
          &nbsp;&nbsp;
        <a-button @click="onAdd">新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit">编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete">删除</a-button>
      </template>
    </CTable>
    <NoticeSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)">
    </NoticeSchema>
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { ALL_SEND_TYPE_MAPPING } from '@/tables/alarm_temp/types'
import moment from 'moment'
import NoticeSchema from './NoticeTempScehma/index'
import { PatrolTemplateService } from '@/api/service/PatrolTemplateService'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
export default {
  name: 'NoticeTemp',
  mixins: [List],
  data () {
    const format = 'YY-MM-DD hh:mm:ss'
    return {
      columns: Object.freeze([
        {
          title: '模板名称',
          dataIndex: 'title',
          width: 200,
          sorter: true
        },
        {
          title: '通知方式',
          dataIndex: 'type',
          width: 90,
          sorter: true,
          customRender: mode => ALL_SEND_TYPE_MAPPING.get(mode)
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          width: 200,
          sorter: true,
          customRender: time => time ? moment(time).format(format) : ''
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          width: 200,
          sorter: true,
          customRender: time => time ? moment(time).format(format) : ''
        },
        {
          title: '启用状态',
          dataIndex: 'enabled',
          width: 90,
          sorter: true,
          customRender: enabled => enabled ? '是' : '否'
        }
      ]),
      queryParams: {
        type: ''
      },
      allMode: Object.freeze(Object.fromEntries(ALL_SEND_TYPE_MAPPING))
    }
  },
  components: {
    NoticeSchema
  },
  props: {},
  methods: {
    async loadData (parameter) {
      // TODO 回显patrolTemp中的模板
      const { enabled, ...restQueryParams } = this.queryParams
      return PatrolTemplateService.find({
        where: {
          ...generateQuery({
            ...restQueryParams,
            ...enabled === undefined ? {} : { enabled: !!enabled }
          })
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onAdd () {
      this.$refs.schema.add()
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    },
    onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => PatrolTemplateService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    }
  }
}
</script>

<style lang="less">

</style>
