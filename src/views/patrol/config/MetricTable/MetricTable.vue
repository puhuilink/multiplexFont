<template>
  <div>
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col
          :span="8"
        >
          <a-form-item>
            检查项名称：
            <a-input
              :style="{width:'30%'}"
              v-decorator="[
                `alias`,
                {
                  rules: [ ],
                },
              ]"
              placeholder="请输入关键字"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="16" :style="{ textAlign: 'right' }">
          <a-button type="primary" @click="handleSearch">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            清空
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-button type="primary" @click="()=>{this.visible=true}">新增</a-button>
    <a-modal
      title="新增检查项"
      wrapClassName="MetricSchema"
      :visible="visible"
      @cancel="resetSubmit"
      @close="resetSubmit"
      @ok="newSubmit"
    >
      <a-form layout="inline" :form="metricForm">
        <a-form-item
          label="检查项名称"
        >
          <a-input
            v-decorator="[
              'alias',
              { rules: [{ required: true, message: '检查项不能为空' }] },
            ]"
            style="width: 110px"
          />
        </a-form-item>
        <a-form-item
          label="检查值"
        >
          <a-select
            v-decorator="[
              'answer_id',
              { rules: [{ required: true, message: '检查值不能为空' }] },
            ]"
            style="width: 110px"
          >
            <a-select-option
              v-for="a in Object.values(answers)"
              :key="a.id"
              :value="a.id"
            >
              {{ a.alias }}
            </a-select-option>

          </a-select>
        </a-form-item>
      </a-form>

    </a-modal>
    <a-table
      :data-source="Object.values(metrics)"
      :pagination="pagination"
      :columns="metricColumns"
      row-key="id"
    >
      <template slot="metric_alias" slot-scope="text, record">
        <span v-if="record.editable">
          <a-input v-model="tempMetric.metric_alias" style="width: 100%;" />
        </span>
        <span v-else>
          {{ record.alias }}
        </span>
      </template>
      <template slot="answer" slot-scope="text, record">
        <span v-if="record.editable">
          <a-select v-model="tempMetric.answer_id" style="width: 100%;">
            <a-select-option v-for="(a,index) in Object.values(answers)" :key="index" :value="a.id">{{ a.alias
            }}</a-select-option>
          </a-select>
        </span>
        <span v-else>
          {{ answers[record.answer_id] != null ? answers[record.answer_id].alias : '' }}
        </span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认取消?" @confirm="() => cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a-button type="primary" :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" :disabled="editingKey !== ''" @click="() => deleteMetric(record.id)">删除</a-button>
          </span>
        </div>
      </template>

    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql } from '@/utils/request'

export default {
  name: 'MetricTable',
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      visible: false,
      metrics: {},
      pagination: {},
      answers: {},
      editingKey: '',
      metricForm: this.$form.createForm(this, {
        name: 'metricForm', data: {}
      }),
      metricColumns: [
        {
          title: '检查项',
          dataIndex: 'metric_alias',
          align: 'center',
          width: '25%',
          scopedSlots: { customRender: 'metric_alias' }
        },
        {
          title: '检查值',
          align: 'center',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tempMetric: {
        metric_alias: '',
        answer_id: ''
      },
      tempAnswer: {
        id: '',
        alias: '',
        format: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.fetchMetric()
    this.fetchAnswer()
  },
  mounted () {
  },
  methods: {
    handleSearch () {
      this.metrics = {}
      let where
      this.form.validateFields((err, value) => {
        if (!err) {
          if (value.alias !== null && value.alias !== undefined && value.alias !== '') {
            where = 'alias like %' + value.alias + '%'
            this.fetchMetric(10, where)
          } else {
            this.fetchMetric()
          }
        }
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    newSubmit () {
      this.metricForm.validateFields(err => {
        if (!err) {
          this.fetchMetric()
        }
      })
    },
    resetSubmit () {
      this.visible = false
      this.metricForm.resetFields()
    },
    toggle () {
      this.expand = !this.expand
    },
    async fetchMetric (limit = 10, where) {
      let base_sql = 'select * from t_patrol_metric where 1=1 '
      if (where !== null && where !== undefined) {
        base_sql += 'and' + where
      }
      if (limit !== 10) {
        base_sql += 'limit' + limit
      } else {
        base_sql += 'limit 10'
      }
      const result = await sql(base_sql)
      const data = dealQuery(result)
      this.metrics = {}
      for (let i = 0; i < data.length; i++) {
        const metric = data[i]
        this.metrics[metric.id] = metric
      }
      // console.log(this.metrics)
    },
    async fetchAnswer () {
      const base_sql = 'select * from t_patrol_answer where 1=1'
      const data = dealQuery(await sql(base_sql))
      this.answers = {}
      for (let i = 0; i < data.length; i++) {
        const answer = data[i]
        this.answers[answer.id] = answer
      }
      // console.log(this.answers)
    },
    edit (id) {
      this.metrics[id].editable = true
      this.editingKey = id
      this.tempMetric.metric_alias = this.metrics[id].alias
      this.tempMetric.answer_id = this.metrics[id].answer_id
      this.$forceUpdate()
    },
    deleteMetric (id) {
      delete this.metrics[id]
      this.$forceUpdate()
    },
    save (id) {
      this.metrics[id].editable = false
      this.editingKey = ''
      this.metrics[id].metric_alias = this.tempMetric.metric_alias
      this.metrics[id].answer_id = this.tempMetric.answer_id
      this.$forceUpdate()
      this.$emit('change', this.metrics)
    },
    cancel (id) {
      this.metrics[id].editable = false
      this.editingKey = ''
      this.tempMetric = {
        metric_alias: '',
        answer_id: ''
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="less">

</style>
