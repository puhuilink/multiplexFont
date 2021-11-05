<template>
  <div>
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col
          :span="15"
          offset="5"
        >
          <a-form-item>
            检查项名称：
            <a-input
              :style="{width:'60%'}"
              v-decorator="[
                `alias`,
                {
                  rules: [ ],
                },
              ]"
              placeholder="请输入关键字"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="4" :style="{ textAlign: 'left' }">
          <a-button type="primary" @click="()=>handleSearch()">
            查询
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-button
      @click="()=>{
        this.visible = true
        this.isNew = true
      }">新增</a-button>
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
              'answerId',
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
      :pagination="{
        current: this.current,
        defaultPageSize: 10,
        total:this.total,
        showTotal: (total,range)=> `${range[0]}-${range[1]}共${total}个检查项`,
        onChange:(pageNumber) =>{
          this.current = pageNumber
          handleSearch(pageNumber)
        }
      }"
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
import { sql, xungeng } from '@/utils/request'

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
      total: 0,
      current: 1,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      visible: false,
      isNew: false,
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
  computed: {
    modalTitle () {
      return this.isNew ? '新增检查值' : '编辑检查值'
    }
  },
  watch: {},
  created () {
    this.fetchMetric('', 1)
    this.fetchAnswer()
  },
  mounted () {
  },
  methods: {
    handleSearch (pageNo = 1) {
      let where
      this.form.validateFields((err, value) => {
        if (!err) {
          if (value.alias !== null && value.alias !== undefined && value.alias !== '') {
            where = ' alias like \'%' + value.alias + '%\''
            this.fetchMetric(where, pageNo)
          } else {
            this.fetchMetric(null, pageNo)
          }
        }
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    newSubmit () {
      this.metricForm.validateFields(async (err, val) => {
        if (!err) {
          const { alias, answerId } = val
          const result = await xungeng.post('metric/add', { 'alias': alias, 'answerId': answerId })
          if (result.code === 200) {
            this.$notification.success({
              message: '系统提示',
              description: '导出交接班记录成功'
            })
          } else {
            this.$notification.error({
              message: '系统提示',
              description: '操作失败：' + result.msg.toString()
            })
          }
          await this.fetchMetric(null, 1)
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
    async fetchMetric (where, pageNo) {
      this.editingKey = ''
      this.metrics = {}
      let base_sql = 'select * from t_patrol_metric where 1=1 '
      let bases = 'select count(1) as total from t_patrol_metric where 1=1 '
      if (where !== null && where !== undefined && where !== '') {
        base_sql += ' and' + where
        bases += ' and' + where
      }
      base_sql += ' limit 10 offset ' + (pageNo - 1) * 10
      console.log(base_sql)
      const result = await sql(base_sql)
      console.log(result)
      this.total = parseInt(dealQuery(await sql(bases))[0]['total'])
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
    async deleteMetric (id) {
      const result = await xungeng.post('metric/delete',
        {
          'id': id
        })
      if (result.code === 200) {
        delete this.metrics[id]
        this.$notification.success({
          message: '系统提示',
          description: '删除检查项成功'
        })
        this.$forceUpdate()
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
    },
    async save (id) {
      this.metrics[id].editable = false
      this.editingKey = ''
      const result = await xungeng.post('metric/edit',
        {
          'id': id,
          'alias': this.tempMetric.metric_alias,
          'answerId': this.tempMetric.answer_id
        })
      if (result.code === 200) {
        this.metrics[id].metric_alias = this.tempMetric.metric_alias
        this.metrics[id].answer_id = this.tempMetric.answer_id
        this.$notification.success({
          message: '系统提示',
          description: '编辑检查项成功'
        })
        this.$forceUpdate()
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
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
