<!--suppress ALL -->
<template>
  <div>
    <a-form class="ant-advanced-search-form" :form="form">
      <div class="fold">
        <a-row :gutter="[8, 8]">
          <a-col :style="{ textAlign: 'left' }" class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="handleSearch">
              查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              重置
            </a-button>
          </a-col>
          <a-col
            :md="6"
            :sm="24"
          >
            <a-form-model-item
              prop="alias">
              检查值名称:
              <a-input
                style="width: 70%"
                v-decorator="[
                  `alias`
                ]"
                placeholder="请输入关键字"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-model-item
              prop="alias">
              类型:
              <a-select
                style="width: 80%"
                v-decorator="[
                  `type`
                ]"
                placeholder="请选择类型"
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
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <div class="operation_box">
      <a-button
        v-action:F010001003001
        type="primary"
        @click="()=>{
          this.visible = true
          this.modalTitle = '新增检查值'
          this.isNew = true
          this.formatList = [
            {
              value: null,
              alias:''
            }
          ]
        }"><a-icon type="plus-circle"/>新增</a-button>
    </div>
    <a-modal
      v-if="visible"
      :title="modalTitle"
      wrapClassName="MetricSchema"
      :visible="visible"
      @cancel="resetSubmit"
      @close="resetSubmit"
      @ok="newSubmit"
      okText="提交"
    >
      <a-form-model :model="answerForm" ref="answerForm">
        <a-form-model-item
          prop="alias"
          :rules="[{ required: true, message: '请输入检查值名称' }]"
          label="检查值名称"
        >
          <a-input
            v-model="answerForm.alias"
          />
        </a-form-model-item>
        <a-form-model-item
          :rules="[{ required: true, message: '请选择检查值类型' }]"
          label="类型"
          prop="type"
        >
          <a-select
            v-model="answerForm.type"
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
        </a-form-model-item>
        <a-form-model-item
          prop="format"
          :rules="[{ required: true, message: answerForm.type ==='fill'?'请选择检查值具体内容':'请输入检查值具体内容' }]"
          label="具体内容"
        >
          <div v-if="this.answerForm.type === 'select'">
            <a-row v-for="(f,index) in formatList" :key="index">
              <a-col :span="10">
                数值:
                <a-input-number
                  :style="{width:'60%'}"
                  v-model="f.value"
                >
                </a-input-number>
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
                <a>
                  <a-icon type="minus" @click="removeRecord(index)" />
                </a>
              </a-col>
            </a-row>
            <a-row :style="{display:'flex',justifyContent:'center'}"><a type="primary" @click="addRecord">
              <a-icon type="plus" />
            </a>
            </a-row>
          </div>
          <a-select
            v-else-if="this.answerForm.type === 'fill'"
            :defaultValue="'%.1f'"
            v-model="temp"
          >
            <a-select-option value="%.1f">
              1位小数
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          prop="defaultCondition"
          :rules="[{ required: true, message: '默认报警条件不能为空', trigger: 'change' }]"
          label="默认报警条件"
        >
          <a-select
            v-model="answerForm.defaultCondition"
            @change="()=>{
              this.$refs.answerForm.clearValidate('defaultCondition')
              this.$forceUpdate()
            }"
          >
            <a-select-option :value="'eq'">等于</a-select-option>
            <a-select-option :value="'ne'">不等于</a-select-option>
            <a-select-option v-if="isFill" :value="'gt'">大于</a-select-option>
            <a-select-option v-if="isFill" :value="'lt'">小于</a-select-option>
            <a-select-option v-if="isFill" :value="'out'">超过</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          :rules="[{ required: this.answerForm.defaultCondition !=='gt' && this.answerForm.defaultCondition !== undefined, message: '默认报警最小值不能为空', trigger: 'change' }]"
          label="默认报警最小值"
          v-show="this.answerForm.defaultCondition !=='gt' && this.answerForm.defaultCondition !== undefined"
          prop="defaultLowerThreshold"
        >
          <a-select
            v-show="(this.answerForm.defaultCondition === 'eq'||this.answerForm.defaultCondition === 'ne')&&this.answerForm.type === 'select'"
            v-model="answerForm.defaultLowerThreshold"
            @change="force"
          >
            <a-select-option
              v-if="answerForm.type === 'select' && f.alias !==null && f.alias!==undefined && f.alias !== ''"
              v-for="(f,index) in formatList"
              :key="index"
              :value="f.value.toString()"
            >
              {{ f.alias }}
            </a-select-option>

          </a-select>
          <a-input-number
            v-show="this.answerForm.defaultCondition !== 'gt'&&this.answerForm.type !== 'select'"
            :style="{width:'100%'}"
            v-model="answerForm.defaultLowerThreshold"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="defaultUpperThreshold"
          :rules="[{ required: true, message: '默认报警数值不能为空', trigger: 'change' }]"
          label="默认报警最大值"
          v-if="(this.answerForm.type!=='select'||this.answerForm.defaultCondition !=='lt')
            && this.answerForm.defaultCondition !== undefined
            && this.answerForm.defaultCondition !== 'eq'
            && this.answerForm.defaultCondition !== 'ne'"
        >
          <a-input-number
            :style="{width:'100%'}"
            v-model="answerForm.defaultUpperThreshold"
          >
          </a-input-number>
        </a-form-model-item>
        <a-form-model-item
          prop="defaultSeverity"
          :rules="[{ required: true, message: '默认报警条件不能为空', trigger: 'change' }]"
          label="默认报警等级"
        >
          <a-select
            v-model="answerForm.defaultSeverity"
          >
            <a-select-option
              v-for="a in 4"
              :key="a"
              :value="a.toString()"
            >
              L{{ a }}
            </a-select-option>

          </a-select>
        </a-form-model-item>

      </a-form-model>

    </a-modal>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="Object.values(this.answers)"
      :pagination="pagination"
      row-key="id"
      ref="table"
      :scroll="{x:1500,y:500}"
    >
      <template slot="format" slot-scope="text,record">
        <a-card
          size="small"
          v-if="record.type!=='fill'"
          :key="index"
          v-for="(a,index) in Object.values(JSON.parse(text))">
          <a-card-grid style="width: 50%;text-align: center;height: 15px">{{ a.alias }}</a-card-grid>
          <a-card-grid style="width: 50%;text-align: center;height: 15px">{{ a.value }}</a-card-grid>
        </a-card>
        <a-tag size="small" v-else>一位小数</a-tag>
      </template>
      <template slot="type" slot-scope="text">
        {{ text === 'select' ? '选择' : '填写' }}
      </template>
      <template slot="action" slot-scope="text,record">
        <a @click="() => edit(record)"><a-icon type="form" v-action:F010001003002/>编辑</a>
        <a-divider type="vertical" />
        <a @click="() => toRemove(record.id)"><a-icon type="delete" v-action:F010001003002/>删除</a>
      </template>
      <template slot="threshold" slot-scope="text,record">
        {{ translateThreshold(record) }}
      </template>
    </a-table>
  </div>
</template>

<script>
import { Confirm, List } from '@/components/Mixins'
import { dealQuery } from '@/utils/util'
import { sql, xungeng } from '@/utils/request'

export default {
  name: 'AnswerManagement',
  mixins: [Confirm, List],
  props: {},
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      data: [],
      answerForm: {},
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
          align: 'center',
          customRender: (value) => value !== 'NULL' ? 'L' + value : '无'
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
      temp: '',
      pagination: {},
      modalTitle: '',
      isNew: false,
      editId: null
    }
  },
  computed: {
    isFill: {
      get () {
        return this.answerForm.type === 'fill'
      }
    }
  },
  watch: {
    formatList: {
      handler (val) {
        if (this.answerForm.type === 'select') {
          this.answerForm.format = JSON.stringify(val)
        }
      },
      deep: true,
      immediate: true
    },
    'answerForm.type': {
      handler (val, oldVal) {
        if (val === 'select' && oldVal !== undefined && oldVal !== 'select') {
          this.formatList = [{
            value: null,
            alias: ''
          }]
          this.answerForm.defaultCondition = 'eq'
        } else if (val === 'fill') {
          this.answerForm.format = JSON.stringify({ format: '%.1f' })
          this.temp = '%.1f'
        }
        this.answerForm.defaultLowerThreshold = null
        this.answerForm.defaultUpperThreshold = null
        this.$forceUpdate()
      },
      immediate: true
    },
    'answerForm.defaultLowerThreshold': {
      handler (val, oldVal) {
        if (val) {
          console.log(val)
          this.$refs.answerForm.clearValidate(['defaultLowerThreshold'])
        }
        this.$forceUpdate()
      },
      immediate: true
    },
    temp: {
      handler (val) {
        this.answerForm.format = JSON.stringify({ format: val })
      },
      immediate: true
    }
  },
  created () {
    this.fetchAnswer()
  },
  mounted () {

  },
  methods: {
    isBlank (element) {
      return element && element !== ''
    },
    force () {
      console.log(this.answerForm.defaultLowerThreshold)
      if (this.isBlank(this.answerForm.defaultLowerThreshold)) {
        this.$refs.answerForm.validateField(['defaultLowerThreshold'])
      }
      this.$forceUpdate()
    },
    toRemove (item) {
      const that = this
      this.$confirm({
        title: '确定要删除该项吗',
        content: '删除后路径相关信息将变更',
        okText: '提交',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.remove(item)
        },
        onCancel () {}
      })
    },
    removeRecord (index) {
      if (this.formatList.length < 2) {
        return
      }
      this.formatList.splice(index, 1)
    },
    newSubmit () {
      this.$refs.answerForm.validate(async valid => {
        if (valid) {
          let threshold
          if (this.answerForm.type === 'fill') {
            this.answerForm.format = JSON.stringify({ 'format': '%.1f' })
          } else if (this.answerForm.type === 'select') {
            this.formatList = this.formatList.filter(item => item !== {
              value: null,
              alias: ''
            })
            if (this.formatList.length < 1) {
              this.$notification.error({
                message: '系统提示',
                description: '操作失败：具体内容不能为空！'
              })
              this.addRecord()
              return
            } else {
              this.answerForm.format = JSON.stringify(this.formatList)
            }
          }
          switch (this.answerForm.defaultCondition) {
            case 'out':
              threshold = {
                'defaultLowerThreshold': parseInt(this.answerForm.defaultLowerThreshold),
                'defaultUpperThreshold': parseInt(this.answerForm.defaultUpperThreshold)
              }
              break
            case 'gt':
              threshold = {
                'defaultUpperThreshold': parseInt(this.answerForm.defaultUpperThreshold)
              }
              break
            default:
              threshold = {
                'defaultLowerThreshold': parseInt(this.answerForm.defaultLowerThreshold)
              }
              this.formatList.forEach((_) => {
                _.value = parseInt(_.value)
              })
          }
          let url, postData
          if (this.isNew) {
            url = 'answer/add'
            postData = {
              'alias': this.answerForm.alias,
              'type': this.answerForm.type,
              'format': this.answerForm.format,
              'defaultCondition': this.answerForm.defaultCondition,
              ...threshold,
              'defaultSeverity': this.answerForm.defaultSeverity
            }
          } else {
            url = 'answer/edit'
            postData = {
              'id': this.editId,
              'alias': this.answerForm.alias,
              'type': this.answerForm.type,
              'format': this.answerForm.format,
              'defaultCondition': this.answerForm.defaultCondition,
              ...threshold,
              'defaultSeverity': this.answerForm.defaultSeverity
            }
          }
          const result = await xungeng.post(url, postData)
          if (result.code === 200) {
            this.$notification.success({
              message: '系统提示',
              description: this.isNew ? '新增检查值成功' : '编辑检查值成功'
            })
            this.visible = false
            this.answerForm = {}
            this.formatList = []
            await this.fetchAnswer()
          } else {
            this.$notification.error({
              message: '系统提示',
              description: '操作失败：' + result.msg.toString()
            })
          }
        }
      })
    },
    translateThreshold (record) {
      const obj = {}
      if (!record.format.includes('format')) {
        const j = JSON.parse(record.format)
        j.forEach((_) => {
          obj[_.value] = _
        })
      } else {
        obj[record.default_lower_threshold] = {}
        obj[record.default_lower_threshold].alias = record.default_lower_threshold
      }
      switch (record.default_condition) {
        case 'eq':
          return '值为"' + obj[record.default_lower_threshold].alias + '"则异常'
        case 'ne':
          return '值不为"' + obj[record.default_lower_threshold].alias + '"则异常'
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
      this.answerForm = {}
    },
    handleSearch () {
      this.form.validateFields((err, value) => {
        if (!err) {
          this.answers = {}
          let where = ''
          if (value.alias !== null && value.alias !== undefined && value.alias !== '') {
            where += ' and alias like \'%' + value.alias + '%\''
          }
          if (value.type !== null && value.type !== undefined && value.type !== '') {
            where += 'and type = \'' + value.type + '\''
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
      this.isNew = false
      this.editId = record.id
      this.answerForm = {
        'alias': record.alias,
        'type': record.type,
        'format': record.format
      }
      this.temp = record.type === 'select' ? '' : '%.1f'
      this.$nextTick(() => {
        this.answerForm = { ...this.answerForm,
          'defaultCondition': record.default_condition,
          'defaultSeverity': record.default_severity,
          'defaultLowerThreshold': record.default_lower_threshold,
          'defaultUpperThreshold': record.default_upper_threshold
        }
      })
      this.formatList = record.type === 'select' ? JSON.parse(record.format) : []
    },
    async remove (id) {
      const result = await xungeng.post('answer/delete', {
        'id': id
      })
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '删除检查值成功'
        })
        this.visible = false
        await this.fetchAnswer()
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
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
      this.loading = true
      let base_sql = 'select * from t_patrol_answer where 1=1 '
      if (where !== null && where !== undefined && where !== '') {
        base_sql += where
      }
      const data = dealQuery(await sql(base_sql))
      this.answers = {}
      for (let i = 0; i < data.length; i++) {
        const answer = data[i]
        this.answers[answer.id] = answer
      }
      this.loading = false
    }
  }
}
</script>

<style lang='less'>
</style>
