<template>
  <div class="baseline-definition">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="uuid"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="10" :sm="24">
                <a-form-item
                  label="动态基线名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item
                  label="节点类型"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <ci-model-select
                    :value="queryParams.model"
                    @input="onModelInput"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="KPI"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <KpiSelect
                    :nodetypeS="queryParams.model"
                    v-model="queryParams.kpi_code"
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

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd" v-action:M1304>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M1305 >编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M1306 >删除</a-button>
      </template>

    </CTable>

    <BaselineDefinitionSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)"
    />

  </div>
</template>

<script>
import deleteCheck from '@/components/DeleteCheck'
import { getBaselineDefList, deleteBaselineDefs } from '@/api/controller/BaselineDef'
import BaselineDefinitionSchema from './BaselineDefinitionSchema'
import { CiModelSelect, KpiSelect } from '@/components/Common'
import List from '@/components/Mixins/Table/List'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'

export default {
  name: 'BaselineDefinition',
  mixins: [List],
  components: {
    CiModelSelect,
    KpiSelect,
    BaselineDefinitionSchema
  },
  data: (vm) => ({
    formItemLayout: {
      labelCol: {
        sm: { span: 8 },
        md: { span: 8 },
        xl: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 14, offset: 2 },
        md: { span: 14, offset: 1 },
        xl: { span: 12, offset: 4 }
      }
    },
    // 查询参数
    queryParams: {
      model: '',
      title: '',
      kpi_code: []
    },
    columns: [
      {
        title: '动态基线名称',
        dataIndex: 'title',
        sorter: true,
        width: 300
      },
      {
        title: '节点类型',
        dataIndex: 'ci_type_label',
        width: 150,
        sorter: true
      },
      {
        title: '节点实例',
        dataIndex: 'ci_label',
        width: 300,
        sorter: true,
        customRender: text => vm.$createElement('div', {
          domProps: {
            innerHTML: (text || '').replace(/,/g, '<br />')
          }
        })
      },
      {
        title: 'KPI名称',
        dataIndex: 'kpi_label',
        width: 100,
        sorter: true,
        customRender: text => vm.$createElement('div', {
          domProps: {
            innerHTML: (text || '').replace(/,/g, '<br />')
          }
        })
      },
      {
        title: '周期',
        dataIndex: 'cycle_default_type',
        width: 100,
        sorter: true,
        customRender: (text) => {
          text += ''
          switch (text) {
            case 'Day':
              return '按日计算'
            case 'Week':
              return '按周计算'
            default:
              return text
          }
        }
      }
    ]
  }),
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      const variables = {
        ...parameter,
        where: {
          ...generateQuery(_.pick(this.queryParams, ['title', 'label'])),
          ...this.queryParams.kpi_code && this.queryParams.kpi_code.length ? {
            kpi_code: {
              // 一条记录可能绑定多个 Kpi，在数据表中是一个以逗号分隔的字符串
              _like: `%${this.queryParams.kpi_code[0]}%`
            }
          } : {}
        }
      }
      return getBaselineDefList(variables).then(r => r.data)
    },
    /**
     * 新增动态基线定义
     * @event
     */
    onAdd () {
      this.$refs['schema'].add()
    },
    /**
    * 批量删除选动态基线定义
     * @event
    */
    async onBatchDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        await deleteBaselineDefs(this.selectedRowKeys)
        this.$refs['table'].refresh()
        this.notifyDeleteSuccess()
      } catch (e) {
        this.notifyError(e)
        throw e
      }
    },
    /**
     * 编辑动态基线定义
     * @event
     */
    onEdit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 选中节点类型
     * @event
     */
    onModelInput (value, label) {
      if (this.queryParams.model === value) {
        return
      }
      this.queryParams.model = value
      this.queryParams.label = label
      this.queryParams.kpi_code = []
    }
  }
}
</script>

<style lang="less">
</style>
