<template>
  <div>
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col
          :span="6"
        >
          <a-form-item>
            检查值名称:
            <a-input
              style="width: 60%"
              v-decorator="[
                `alias`
              ]"
              placeholder="请输入关键字"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            类型:
            <a-select
              style="width: 60%"
              v-decorator="[
                `type`
              ]"
              placeholder="请选择类型"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-button type="primary" @click="handleSearch">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            清空
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-button
      type="primary"
      @click="()=>{
        this.visible = true
        this.modalTitle = '新增检查项'
      }">新增
    </a-button>
    <a-modal
      :title="modalTitle"
      wrapClassName="MetricSchema"
      :visible="visible"
      @cancel="resetSubmit"
      @close="resetSubmit"
      @ok="newSubmit"
    >
      <a-form :form="answerForm">
        <a-form-item
          label="检查值名称"
        >
          <a-input
            v-decorator="[
              'alias',
              { rules: [{ required: true, message: '名称不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="类型"
        >
          <a-select
            v-model="tempType"
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '检查值不能为空' }] },
            ]"
          >
            <a-select-option
              value="select"
            >
              选择
            </a-select-option>
            <a-select-option
              value="fill"
            >
              填写
            </a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          label="具体内容"
        >
          <div v-if="this.tempType === 'select'">
            <a-row v-for="(f,index) in formatList" :key="index">
              <a-col :span="10">
                数值:
                <a-input
                  :style="{width:'60%'}"
                  v-model="f.value"
                >
                </a-input>
              </a-col>
              <a-col :span="10">
                含义:
                <a-input
                  :style="{width:'60%'}"
                  v-model="f.answer"
                >
                </a-input>
              </a-col>
              <a-col :span="4">
                <a-button type="primary" @click="addRecord"><a-icon type="plus" /></a-button>
              </a-col>
            </a-row>
          </div>
          <a-select
            v-else
            v-decorator="[
              'format',
              { rules: [{ required: true, message: '内容不能为空' }] },
            ]"
          >
            <a-select-option value="%.1f">
              1位小数
            </a-select-option>
            <a-select-option value="%d">
              整数
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

    </a-modal>
    <a-table
      :columns="columns"
      :data-source="Object.values(this.answers)"
      :pagination="pagination"
      row-key="id"
    >
      <template slot="format" slot-scope="text,record">
        <a-card size="small" v-if="record.type!=='fill'" :key="index" v-for="(a,index) in Object.values(JSON.parse(text))">
          <a-card-grid style="width: 50%;text-align: center;height: 15px">{{ a.alias }}</a-card-grid>
          <a-card-grid style="width: 50%;text-align: center;height: 15px">{{ a.value }}</a-card-grid>
        </a-card>
        <a-tag size="small" v-else>{{ JSON.parse(text).format }}</a-tag>
      </template>
      <template slot="type" slot-scope="text">
        {{ text === 'select' ? '选择' : '填写' }}
      </template>
      <template slot="action" slot-scope="text,record">
        <a-button type="primary" @click="() => edit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" @click="() => remove(record.id)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql } from '@/utils/request'

export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      data: [],
      answerForm: this.$form.createForm(this, {
        name: 'answerForm', data: {}
      }),
      visible: false,
      tempType: '',
      columns: [
        {
          title: '检查值',
          dataIndex: 'alias',
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '值映射',
          dataIndex: 'format',
          align: 'center',
          scopedSlots: { customRender: 'format' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      answers: {},
      formatList: [{
        value: null,
        answer: ''
      }],
      pagination: {},
      modalTitle: ''
    }
  },
  computed: {},
  watch: {},
  created () {
    this.fetchAnswer()
  },
  mounted () {

  },
  methods: {
    newSubmit () {
      this.answerForm.validateFields(err => {
        if (!err) {
          this.fetchMetric()
        }
      })
    },
    resetSubmit () {
      console.log(this.tempType)
      this.visible = false
      this.answerForm.resetFields()
    },
    handleSearch () {
      this.form.validateFields((err, value) => {
        if (!err) {
          this.answers = {}
          let where = ''
          if (value.alias !== null && value.alias !== undefined && value.alias !== '') {
            where += ' and alias like %' + value.alias + '%'
          }
          if (value.type !== null && value.type !== undefined && value.type !== '') {
            where += 'and type = ' + value.type
          }
          if (where !== '') {
            this.fetchAnswer(where)
          } else {
            this.fetchAnswer()
          }
        }
      })
    },
    handleReset () {
      this.form.resetFields()
    },
    edit (record) {
      this.modalTitle = '编辑检查值'
      this.visible = true
      console.log(record)
    },
    addRecord () {
      if (this.formatList.length < 5) {
        this.formatList.push({
          value: null,
          answer: ''
        })
      } else {
        this.$message.warn('最多五条映射！')
      }
      this.$forceUpdate()
    },
    toggle () {
      this.expand = !this.expand
    },
    async fetchAnswer (where) {
      let base_sql = 'select * from t_patrol_answer where 1=1'
      if (where !== null && where !== undefined && where !== '') {
        base_sql += where
      }
      const data = dealQuery(await sql(base_sql))
      this.answers = {}
      for (let i = 0; i < data.length; i++) {
        const answer = data[i]
        this.answers[answer.id] = answer
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
