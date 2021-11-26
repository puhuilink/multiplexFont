<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    @ok="validateOperation"
    @cancel="closeModal"
    @close="closeModal"
  >

    <a-form-model
      :model="editForm"
      ref="ruleForm"
      :rules="rules"
    >
      <div v-if="!isNew">
        <a-form-model-item label="阈值对象">
          <a-input disabled v-model="alias"></a-input>
        </a-form-model-item>
      </div>
      <div v-else>
        <a-form-model-item label="监控对象" ref="hostId" prop="hostId">
          <a-select
            show-search
            :filterOption="filterOption"
            @focus="()=>{ this.host = this.host_list}"

            :not-found-content="null"
            v-model="editForm.hostId"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in host" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="监控实体" ref="endpointId" prop="endpointId">
          <a-select
            v-model="editForm.endpointId"
            show-search
            :filterOption="filterOption"
            @focus="()=>{ this.endpoint = this.endpoint_list}"
            :not-found-content="null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in endpoint" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="检查项" ref="metricId" prop="metricId">
          <a-select
            v-model="editForm.metricId"
            show-search
            :filterOption="filterOption"
            @focus="()=>{ this.metric = this.metric_list}"
            :not-found-content="null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in metric" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="检查值" ref="answerId" prop="answerId">
          <a-select
            v-model="editForm.answerId"
            show-search
            :filterOption="filterOption"
            @focus="()=>{ this.answer = this.answer_list}"
            :not-found-content="this.fetching ? undefined : null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in answer" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <a-form-model-item label="阈值类型" ref="condition" prop="condition">
        <a-select
          v-model="editForm.condition">
          <a-select-option :value="'eq'">等于</a-select-option>
          <a-select-option :value="'ne'">不等于</a-select-option>
          <a-select-option v-show="isFill " :value="'gt'">大于</a-select-option>
          <a-select-option v-show="isFill" :value="'lt'">小于</a-select-option>
          <a-select-option v-show="isFill" :value="'out'">超过</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="阈值数值"
        ref="threshold"
        prop="lowerThreshold"
        v-if="this.isLowThresholdInput||this.isLowThresholdSelect">
        <a-input-number
          :style="{width:'100%'}"
          v-if="isLowThresholdInput"
          v-model="editForm.lowerThreshold"
          placeholder="请输入告警最小值"
        >
        </a-input-number>
        <a-select
          v-if="isLowThresholdSelect"
          v-model="editForm.lowerThreshold">
          <a-select-option v-for="option in this.answer_format" :key="option.value" :value="option.value.toString()">{{ option.alias }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="阈值数值"
        ref="threshold"
        prop="upperThreshold"
        v-if="isUpThreshold"
      >
        <a-input-number
          :style="{width:'100%'}"
          placeholder="请输入告警最大值"
          v-model="editForm.upperThreshold">
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item label="告警等级" ref="severity" prop="severity">
        <a-select
          v-model="editForm.severity">
          <a-select-option :value="'1'">L1</a-select-option>
          <a-select-option :value="'2'">L2</a-select-option>
          <a-select-option :value="'3'">L3</a-select-option>
          <a-select-option :value="'4'">L4</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import { sql } from '@/utils/request'
import { dealQuery } from '@/utils/util'

export default {
  name: 'ThresholdSchema',
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    },
    dataForm: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return {
      editForm: {
        hostId: '',
        endpointId: '',
        metricId: '',
        answerId: '',
        condition: '',
        lowerThreshold: '',
        upperThreshold: '',
        severity: ''
      },
      formItemLayout,
      modalTitle: this.isNew ? '新增阈值规则' : '编辑阈值规则',
      alias: '',
      fetching: false,
      host: [],
      endpoint: [],
      metric: [],
      answer: [],
      host_list: [],
      endpoint_list: [],
      metric_list: [],
      answer_list: [],
      rules: {
        hostId: [{ required: true, message: '监控对象不能为空！', trigger: 'blur' }],
        endpointId: [{ required: true, message: '监控实体不能为空！', trigger: 'blur' }],
        metricId: [{ required: true, message: '检查项不能为空！', trigger: 'blur' }],
        answerId: [{ required: true, message: '检查值不能为空！', trigger: 'blur' }],
        condition: [{ required: true, message: '阈值条件不能为空！', trigger: 'blur' }],
        severity: [{ required: true, message: '阈值等级不能为空！', trigger: 'blur' }],
        lowerThreshold: [{ required: true, message: '阈值数值不能为空！', trigger: 'blur' },
          { pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/, message: '必须填写数字！', trigger: 'change' }
        ],
        upperThreshold: [{ required: true, message: '阈值数值不能为空！', trigger: 'blur' },
          { pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/, message: '必须填写数字！', trigger: 'change' }]
      }
    }
  },
  computed: {
    answer_format () {
      if (this.isNew) {
        if (this.editData.answerId === undefined || this.editData.answerId === null || this.editData.answerId === '') {
          return []
        } else {
          const obj = this.answer_list.find((answer) => answer.id.toString() === this.editData.answerId.toString())
          if (obj.type === 'fill') {
            return []
          } else {
            return JSON.parse(obj.format.toString())
          }
        }
      } else {
        if (this.dataForm.answer_type === 'fill') {
          return []
        } else {
          return JSON.parse(this.dataForm.format.toString())
        }
      }
    },
    isLowThresholdInput () {
      if (this.isNew) {
        if (this.editData.answerId === undefined || this.editData.answerId === null || this.editData.answerId === '') {
          return false
        } else {
          const obj = this.answer_list.find((answer) => answer.id.toString() === this.editData.answerId.toString())
          if (obj.type === 'fill') {
            switch (this.editData.condition) {
              case 'eq':
                return true
              case 'ne':
                return true
              case 'out':
                return true
              case 'lt':
                return true
              default:
                return false
            }
          } else {
            return false
          }
        }
      } else {
        if (this.dataForm.answer_type === 'select') {
          return false
        } else {
          switch (this.editData.condition) {
            case 'eq':
              return true
            case 'ne':
              return true
            case 'out':
              return true
            default:
              return false
          }
        }
      }
    },
    isLowThresholdSelect () {
      if (this.isNew) {
        if (this.editData.answerId === undefined || this.editData.answerId === null || this.editData.answerId === '') {
          return false
        } else {
          const obj = this.answer_list.find((answer) => answer.id.toString() === this.editData.answerId.toString())
          if (obj.type === 'fill') {
            return false
          } else {
            switch (this.editData.condition) {
              case 'eq':
                return true
              case 'ne':
                return true
              default:
                return false
            }
          }
        }
      } else {
        if (this.dataForm.answer_type === 'fill') {
          return false
        } else {
          switch (this.editData.condition) {
            case 'eq':
              return true
            case 'ne':
              return true
            default:
              return false
          }
        }
      }
    },
    isUpThreshold () {
      if (this.isNew) {
        if (this.editForm.answerId === undefined || this.editForm.answerId === null || this.editForm.answerId === '') {
          return false
        } else {
          const obj = this.answer_list.find((answer) => answer.id.toString() === this.editForm.answerId.toString())
          if (obj.type === 'fill') {
            switch (this.editForm.condition) {
              case 'gt':
                return true
              case 'out':
                return true
              default:
                return false
            }
          } else {
            return false
          }
        }
      } else {
        if (this.dataForm.answer_type === 'fill') {
          switch (this.editData.condition) {
            case 'gt':
              return true
            case 'out':
              return true
            default:
              return false
          }
        } else {
          return false
        }
      }
    },
    editData () {
      return this.editForm
    },
    isFill () {
      if (this.editForm.answerId === undefined || this.editForm.answerId === '') {
        return false
      }
      const a = this.answer_list.find(_ => _.id === this.editForm.answerId)
      return a.type === 'fill'
    }
  },
  watch: {
    dataForm: {
      handler (oldValue, newValue) {
        if (!this.isNew) {
          this.appendAlias()
        }
      },
      immediate: true
    },
    'editForm.condition': {
      handler (oldValue, newValue) {
        this.editForm.lowerThreshold = null
        this.editForm.upperThreshold = null
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.fetchHost()
    this.fetchEndpoint()
    this.fetchMetric()
    this.fetchAnswer()
    this.appendAlias()
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    closeModal () {
      this.$refs.ruleForm.resetFields()
      this.$emit('cancel')
    },
    appendAlias () {
      if (this.isNew) {
        return
      }
      this.alias = ''
      this.alias += this.dataForm.host_alias + '/'
      this.alias += this.dataForm.endpoint_alias !== 'NULL' ? this.dataForm.endpoint_alias : '虚拟实体' + '/'
      this.alias += this.dataForm.metric_alias

      this.editForm = {
        'condition': this.dataForm.condition,
        'severity': this.dataForm.severity,
        'lowerThreshold': this.dataForm.lower_threshold === 'NULL' ? null : this.dataForm.lower_threshold,
        'upperThreshold': this.dataForm.upper_threshold === 'NULL' ? null : this.dataForm.upper_threshold
      }
    },
    validateOperation () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isNew) {
            this.$emit('ok', this.editForm)
          } else {
            const d = { ...this.editForm, 'id': this.dataForm.id }
            this.$emit('ok', d)
          }
        }
      })
    },
    async fetchHost () {
      this.host_list = []
      const base_sql = 'select id,alias from t_patrol_host where 1=1 '
      this.host_list = dealQuery(await sql(base_sql))
      this.$forceUpdate()
    },
    async fetchEndpoint () {
      this.endpoint_list = []
      const base_sql = 'select id,alias from t_patrol_endpoint where 1=1 '
      this.endpoint_list = dealQuery(await sql(base_sql))
    },
    async fetchMetric () {
      this.metric_list = []
      const base_sql = 'select id,alias from t_patrol_metric where 1=1 '
      this.metric_list = dealQuery(await sql(base_sql))
    },
    async fetchAnswer () {
      this.answer_list = []
      const base_sql = 'select id,alias,format,type from t_patrol_answer where 1=1 '
      this.answer_list = dealQuery(await sql(base_sql))
    }
  }
}
</script>

<style scoped lang="less">

</style>
