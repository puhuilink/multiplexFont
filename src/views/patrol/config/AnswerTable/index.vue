<template>
  <div>
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col
          :span="6"
          offset="8"
          :style="{textAlign: 'right'}"
        >
          <a-form-item>
            检查值名称:
            <a-input
              style="width: 70%"
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
              style="width: 80%"
              v-decorator="[
                `type`
              ]"
              placeholder="请选择类型"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4" :style="{textAlign: 'left',marginLeft: '-10px'}">
          <a-button type="primary" @click="handleSearch">
            查询
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-button
      type="primary"
      @click="()=>{
        this.visible = true
        this.modalTitle = '新增检查项'
        this.formatList = [
          {
            value: null,
            alias:''
          }
        ]
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
      <a-form :form="answerForm" ref="answerForm">
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
          <div v-if="this.answerForm.getFieldsValue().type === 'select'">
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
                  v-model="f.alias"
                >
                </a-input>
              </a-col>
              <a-col :span="4">
                <a><a-icon type="minus" @click="removeRecord(index)"/></a>
              </a-col>
            </a-row>
            <a-row :style="{display:'flex',justifyContent:'center'}"><a type="primary" @click="addRecord"><a-icon type="plus" /></a>
            </a-row>
          </div>
          <a-select
            v-else
            v-decorator="[
              'format',
              {
                rules: [{ required: true, message: '内容不能为空' }],
                initialValue: this.tempObject.format
              },
            ]"
            defaultValue="%.1f"
          >
            <a-select-option value="%.1f" >
              1位小数
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="默认报警条件"
        >
          <a-select
            v-decorator="[
              'defaultCondition',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
          >
            <a-select-option :value="'eq'">等于</a-select-option>
            <a-select-option :value="'ne'">不等于</a-select-option>
            <a-select-option :value="'gt'">大于</a-select-option>
            <a-select-option :value="'lt'">小于</a-select-option>
            <a-select-option :value="'out'">超过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="默认报警最小值"
          v-if="this.answerForm.getFieldsValue().defaultCondition !=='gt'"
        >
          <a-select
            v-if="this.answerForm.getFieldsValue().defaultCondition === 'eq'"
            v-decorator="[
              'defaultLowerThreshold',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
          >
            <a-select-option
              v-for="(f,index) in formatList"
              :key="index"
              :value="f.value"
            >
              {{ f.alias }}
            </a-select-option>

          </a-select>
          <a-input-number
            :style="{width:'100%'}"
            v-decorator="[
              'defaultLowerThreshold',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="默认报警最大值"
          v-if="this.answerForm.getFieldsValue().type!=='select'&&this.answerForm.getFieldsValue().defaultCondition !=='lt'"
        >
          <a-input-number
            :style="{width:'100%'}"
            v-decorator="[
              'defaultUpperThreshold',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
          >
          </a-input-number>
        </a-form-item><a-form-item
          label="默认报警等级"
        >
          <a-select
            v-decorator="[
              'defaultSeverity',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
          >
            <a-select-option
              v-for="a in 5"
              :key="a"
              :value="a"
            >
              告警等级{{ a }}
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
        <a-tag size="small" v-else>一位小数</a-tag>
      </template>
      <template slot="type" slot-scope="text">
        {{ text === 'select' ? '选择' : '填写' }}
      </template>
      <template slot="action" slot-scope="text,record">
        <a-button type="primary" @click="() => edit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" @click="() => remove(record.id)">删除</a-button>
      </template>
      <template slot="threshold" slot-scope="text,record">
        {{ translateThreshold(record) }}
      </template>
    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql, xungeng } from '@/utils/request'

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
      tempObject: {},
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
          width: '30%',
          scopedSlots: { customRender: 'format' }
        },
        {
          title: '默认告警阈值',
          align: 'center',
          scopedSlots: { customRender: 'threshold' }
        },
        {
          title: '默认告警等级',
          dataIndex: 'default_severity',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      answers: {},
      formatList: [{
        value: null,
        alias: ''
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
    removeRecord (index) {
      this.formatList.splice(index, 1)
    },
    newSubmit () {
      this.answerForm.validateFields(async (err, val) => {
        if (!err) {
          let threshold = {}
          switch (val.defaultCondition) {
            case 'out':
              threshold = {
                'defaultLowerThreshold': val.defaultLowerThreshold,
                'defaultUpperThreshold': val.defaultUpperThreshold
              }
              break
            case 'gt':
              threshold = {
                'defaultUpperThreshold': val.defaultUpperThreshold
              }
              break
            default:
              threshold = {
                'defaultLowerThreshold': val.defaultLowerThreshold
              }
          }
          const result = await xungeng.post('answer/add', {
            'alias': val.alias,
            'type': val.type,
            'format': JSON.stringify(this.formatList),
            'defaultCondition': val.defaultCondition,
            ...threshold,
            'defaultSeverity': val.defaultSeverity
          })
          if (result.code === 200) {
            this.$message.success(result.msg)
            this.visible = false
            await this.fetchAnswer()
          } else {
            this.$message.error(result.msg)
          }
        }
      })
    },
    translateThreshold (record) {
      switch (record.default_condition) {
        case 'eq':
          return '值为"' + JSON.parse(record.format)[record.default_lower_threshold].alias + '"则异常'
        case 'ne':
          return '值不为"' + JSON.parse(record.format)[record.default_lower_threshold].alias + '"则异常'
        case 'out':
          return '值超出"' + record.default_lower_threshold + '~' + record.default_upper_threshold + '"范围则异常'
        case 'gt':
          return '值大于"' + record.default_upper_threshold + '"则异常'
        case 'lt':
          return '值小于"' + record.default_lower_threshold + '"则异常'
        default:
          return '暂无阈值'
      }
    },
    resetSubmit () {
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
      this.$nextTick(() => {
        this.answerForm.setFieldsValue({
          'id': record.id,
          'alias': record.alias,
          'type': record.type,
          'format': JSON.parse(record.format).format,
          'defaultCondition': record.default_condition,
          'defaultLowerThreshold': record.default_lower_threshold,
          'defaultUpperThreshold': record.default_upper_uhreshold,
          'defaultSeverity': record.default_severity
        })
        console.log(JSON.parse(record.format))
        this.formatList = JSON.parse(record.format)
      })
    },
    async remove (id) {
      const result = await xungeng.post('answer/delete', {
        'id': id
      })
      if (result.code === 200) {
        this.$message.success(result.msg)
        this.visible = false
        await this.fetchAnswer()
      } else {
        this.$message.error(result.msg)
      }
    },
    addRecord () {
      if (this.formatList.length < 5) {
        this.formatList.push({
          value: null,
          alias: ''
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
