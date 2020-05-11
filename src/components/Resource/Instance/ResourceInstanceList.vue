<template>
  <div class="ResourceInstanceList">
    <a-spin :spinning="loading">
      <CTable
        ref="table"
        :data="loadData"
        :columns="columns"
        :rowKey="el => el._id"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
        :scroll="{ x: scrollX, y: `calc(100vh - 370px)`}"
      >

        <template #query>
          <a-form layout="inline" :style="{ overflow: hiddenOperation ? 'hidden' : 'visible' }">
            <div :class="{ fold: !advanced }">
              <a-row>
                <a-col
                  v-for="(value, index) in queryParams.values"
                  :key="index"
                  :md="12"
                  :sm="24"
                  v-show="index <= 1 || (index > 1 && advanced)"
                >
                  <a-form-item
                    :labelCol="{ span: 8 }"
                    :wrapperCol="{ span: 12, offset: 4 }"
                    :label="value.label"
                    style="width: 100%"
                  >
                    <a-input allowClear v-model="value.value" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <!-- TODO: 统一管理布局 -->
            <!-- TODO: 居中 span -->
            <span :style="advanced ? { float: 'right', overflow: 'hidden', transform: `translateY(${ hiddenOperation ? '0' : '6.5' }px)` } : { display: 'inline-block', transform: 'translateY(-15.5px)' } ">
              <template v-if="queryParams.values.length">
                <!-- FIXME: 查询接口入参错误 -->
                <!-- FIXME: 查询匹配条件动态 -->
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
              </template>
              <a @click="toggleAdvanced" style="margin-left: 8px" v-if="queryParams.values.length > 2">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-form>
        </template>

        <template #operation v-if="!hiddenOperation">
          <a-button @click="add">新建</a-button>
          <a-button @click="edit" :disabled="selectedRowKeys.length !== 1">编辑</a-button>
          <a-button :disabled="selectedRowKeys.length === 0">删除</a-button>
          <a-button>数据检查</a-button>
        </template>

      </CTable>
    </a-spin>

    <ResourceInstanceSchema
      v-if="!hiddenOperation"
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import ResourceInstanceSchema from './ResourceInstanceSchema/index'
import { InstanceService, ModelService } from '@/api-hasura/index'
import { generateJsonbQuery } from '@/utils/graphql'
import _ from 'lodash'

const defaultColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    width: 180
  },
  {
    title: 'parent',
    dataIndex: 'parentName',
    width: 120
  }
]

export default {
  name: 'ResourceInstanceList',
  props: {
    where: {
      type: Object,
      default: () => ({})
    },
    parentName: {
      type: String,
      default: ''
    },
    parentTree: {
      type: String,
      default: ''
    },
    hiddenOperation: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CTable,
    ResourceInstanceSchema
  },
  data: () => ({
    // 查询栏是否展开
    advanced: false,
    loading: false,
    // 查询参数
    queryParams: {
      values: []
    },
    // 选中行
    selectRows: [],
    // 选中行的 key
    selectedRowKeys: [],
    columns: []
  }),
  computed: {
    // TODO: 列不全
    // TODO: td 溢出省略号或自动增长但与表头保持对齐
    scrollX: {
      get () {
        if (_.isEmpty(this.columns)) {
          return true
        } else {
          return this.columns
            .map(e => e.width || 0)
            .reduce((a, b) => a + b) + 36
        }
      }
    },
    columnFieldList: {
      get () {
        return this.columns.map(e => e.dataIndex)
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      async handler () {
        // 重置当前数据
        this.reset()
        this.loadColumns()
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    add () {
      const { parentName, parentTree } = this
      this.$refs['schema'].add(
        parentName,
        parentTree
      )
    },
    edit () {
      // const [_id] = this.selectRowKeys
      const [instance] = this.selectRows
      const { parentName, _id } = instance
      this.$refs['schema'].edit(parentName, _id)
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    async loadData (parameter) {
      this.selectedRowKeys = []
      this.selectedRows = []

      console.log(generateJsonbQuery(_.pick(this.queryParams, ['values'])))

      return InstanceService.list({
        where: {
          ...this.where,
          ..._.omit(this.queryParams, ['values']),
          ...generateJsonbQuery(_.pick(this.queryParams, ['values']))
          // values:
          // values: _.pickBy(this.queryParams, v => !!v)
          // ...generateQuery(this.queryParams)
        },
        fields: [
          '_id',
          'parentName',
          'name',
          'values'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    },
    async loadColumns () {
      const { parentName } = this.where
      try {
        this.loading = true
        const { data: { modelList } } = await ModelService.find({
          where: {
            name: parentName
          },
          fields: [
            'attributes'
          ],
          alias: 'modelList'
        })
        // name 是唯一字段，查询出的 model 是长度为1的数组
        const [model] = modelList
        const { attributes } = model
        // console.log(attributes)
        const columns = defaultColumns.concat(_.orderBy(attributes, ['orderBy'], ['asc']).map((column) => ({
          ...column,
          title: column.label,
          dataIndex: name,
          // 老系统数据的 width 大都比较写，在 antd 框架下表现为容易溢出
          width: column.width ? column.width + 60 : 120,
          customRender: (text, record) => {
            const value = _.get(record, `values.${column.name}`)
            // 数据表存储为 jsonb 类型，可能存储了 true、false 等值，此处需要转换为 String 格式
            return (value !== null && value !== undefined) ? `${value}` : ''
          },
          ellipsis: true
        })))
        this.columns = columns
      } catch (e) {
        this.columns = []
        throw e
      } finally {
        this.queryParams.values = this.columns
          .filter(field => !!field.searchField)
          .map(({ matchType, label, name, dataType }) => ({ matchType, label, name, dataType }))
        this.loading = false
      }
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys, selectRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectRows = selectRows
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 切换查询栏展开状态
     * @event
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  created () {
    this.loadColumns()
    // CTable created 时会触发 loadData
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
  padding-right: 10px;
}
</style>
