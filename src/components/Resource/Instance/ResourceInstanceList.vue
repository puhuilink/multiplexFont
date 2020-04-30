<template>
  <div class="ResourceInstanceList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      :rowKey="el => el._id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: scrollX, y: `calc(100vh - 370px)`}"
    >

      <template #query>
        <a-form layout="inline">
          <div class="fold">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  :labelCol="{ span: 2 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  label="名称"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams.name" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  label="显示名称"
                  style="width: 100%"
                >
                  <a-input allowClear v-model="queryParams.label" />
                </a-form-item>
              </a-col>

            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style="advanced && { float: 'right', overflow: 'hidden', transform: 'translateY(6.5PX)' } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button @click="edit" :disabled="selectedRowKeys.length !== 1">编辑</a-button>
        <a-button :disabled="selectedRowKeys.length === 0">删除</a-button>
        <a-button>数据检查</a-button>
      </template>

    </CTable>

    <ResourceInstanceSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import ResourceInstanceSchema from './ResourceInstanceSchema'
// import { Ellipsis } from '@/components'
import { InstanceService, ModelService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
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
    parentNameS: {
      type: String,
      default: ''
    },
    parentTreeS: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/require-default-prop
    parentDid: {
      type: Number
    }
  },
  components: {
    CTable,
    ResourceInstanceSchema
  },
  data: () => ({
    // 第几次加载数据
    timer: 0,
    // 查询栏是否展开
    advanced: true,
    // 查询参数
    queryParams: {},
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
      immediate: true,
      deep: true,
      async handler () {
        // 重置数据
        this.reset()
        // 等待 table 挂载
        await this.$nextTick()
        // this.$refs['table'].loading = true
        // FIXME: loadColumns 在 loadData 之后完成，会造成页面闪烁
        this.loadColumns()
        // 重新查询
        // 组件 created 时，CTable 组件会执行一次 loadData
        // 此处加上判断，避免重复调用
        if (this.timer > 1) {
          this.timer && this.$refs['table'].refresh(true)
        }
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add(
        this.parentNameS,
        this.parentTreeS
      )
    },
    edit () {
      const [record] = this.selectRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    async loadData (parameter) {
      this.timer++
      this.selectedRowKeys = []
      this.selectedRows = []
      return InstanceService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
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
        console.log(attributes)
        const columns = defaultColumns.concat(_.orderBy(attributes, ['orderBy'], ['asc']).map(({ label, name, width }) => ({
          title: label,
          dataIndex: name,
          // 老系统数据的 width 大都比较写，在 antd 框架下表现为容易溢出
          width: width ? width + 60 : 120,
          customRender: (text, record) => _.get(record, `values.${name}`),
          ellipsis: true
        })))
        this.columns = columns
      } catch (e) {
        this.columns = []
        throw e
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
      this.advanced = !this.andvaced
      if (!this.advanced) {
        delete (this.queryParams.email)
        delete (this.queryParams.flag)
      }
    }
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
