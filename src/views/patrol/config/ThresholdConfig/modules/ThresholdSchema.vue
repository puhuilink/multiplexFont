<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    @ok="validateOperation"
    @cancel="$emit('cancel',$event)"
    @close="$emit('cancel',$event)"
  >

    <a-form :form="editForm">
      <div v-if="!isNew">
        <a-form-item label="阈值对象">
          <a-input disabled v-model="alias"></a-input>
        </a-form-item>
      </div>
      <div v-else>
        <a-form-item label="监控对象">
          <a-select
            show-search
            @search="fetchHost"
            v-decorator="[
              'hostId',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
            :show-arrow="false"
            :not-found-content="this.fetching ? undefined : null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in host" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="监控实体">
          <a-select
            v-decorator="[
              'endpointId',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
            show-search
            @search="fetchEndpoint"
            :show-arrow="false"
            :not-found-content="this.fetching ? undefined : null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in endpoint" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="检查项">
          <a-select
            v-decorator="[
              'metricId',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
            show-search
            @search="fetchMetric"
            :show-arrow="false"
            :not-found-content="this.fetching ? undefined : null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in metric" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="检查值">
          <a-select
            v-decorator="[
              'answerId',
              { rules: [{ required: true, message: '默认报警条件不能为空' }] },
            ]"
            show-search
            @search="fetchAnswer"
            :show-arrow="false"
            :not-found-content="this.fetching ? undefined : null"
          >
            <a-spin v-if="this.fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="h in answer" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <a-form-item label="阈值类型">
        <a-select
          v-decorator="[
            'condition',
            { rules: [{ required: true, message: '默认报警条件不能为空' }] },
          ]">
          <a-select-option :value="'eq'">等于</a-select-option>
          <a-select-option :value="'ne'">不等于</a-select-option>
          <a-select-option :value="'gt'">大于</a-select-option>
          <a-select-option :value="'lt'">小于</a-select-option>
          <a-select-option :value="'out'">超过</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="阈值数值">
        <a-input
          v-if="this.dataForm.answer_type ==='fill'&&this.editForm.getFieldsValue().condition !== 'gt'"
          v-decorator="[
            'lowerThreshold',
            { rules: [{ required: true, message: '默认报警条件不能为空' }] },
          ]">
        </a-input>
        <a-select
          v-if="this.dataForm.answer_type ==='select'"
          v-decorator="[
            'lowerThreshold',
            { rules: [{ required: true, message: '默认报警条件不能为空' }] },
          ]">
          <a-select-option v-for="option in JSON.parse(this.dataForm.format)" :key="option.value" :value="option.value.toString()">{{ option.alias }}</a-select-option>
        </a-select>
        <a-input
          v-if="this.editForm.getFieldsValue().condition === 'gt' || editForm.getFieldsValue().condition === 'out'"
          v-decorator="[
            'upperThreshold',
            { rules: [{ required: true, message: '默认报警条件不能为空' }] },
          ]">
        </a-input>
      </a-form-item>
      <a-form-item label="告警等级">
        <a-select
          v-decorator="[
            'severity',
            { rules: [{ required: true, message: '默认报警条件不能为空' }] },
          ]">
          <a-select-option :value="1">L1</a-select-option>
          <a-select-option :value="2">L2</a-select-option>
          <a-select-option :value="3">L3</a-select-option>
          <a-select-option :value="4">L4</a-select-option>
          <a-select-option :value="5">L5</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
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
      editForm: this.$form.createForm(this, {
        name: 'editForm',
        data: {
          'condition': '',
          'lowerThreshold': '',
          'upperThreshold': '',
          'severity': ''
        }
      }),
      formItemLayout,
      modalTitle: this.isNew ? '新增阈值规则' : '编辑阈值规则',
      alias: '',
      fetching: false,
      host: [],
      endpoint: [],
      metric: [],
      answer: []
    }
  },
  computed: {},
  watch: {
    dataForm: {
      handler (oldValue, newValue) {
        this.appendAlias()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.appendAlias()
  },
  methods: {
    appendAlias () {
      this.alias = ''
      this.alias += this.dataForm.host_alias + '/'
      this.alias += this.dataForm.endpoint_alias !== 'NULL' ? this.dataForm.endpoint_alias : '虚拟实体' + '/'
      this.alias += this.dataForm.metric_alias
      this.$nextTick(() => {
        this.editForm.setFieldsValue({
          'condition': this.dataForm.condition })
        this.$nextTick(() => {
          this.editForm.setFieldsValue({
            'lowerThreshold': this.dataForm.lower_threshold,
            'upperThreshold': this.dataForm.upper_threshold,
            'severity': this.dataForm.severity
          })
        })
      })
    },
    validateOperation () {
      this.editForm.validateFields((err, val) => {
        if (!err) {
          if (this.isNew) {
            this.$emit('ok', val)
          } else {
            const d = { ...val, 'id': this.dataForm.id }
            this.$emit('ok', d)
          }
        }
      })
    },
    async fetchHost (value) {
      if (this.fetching) {
        return
      }
      this.host = []
      let base_sql = 'select id,alias from t_patrol_host where 1=1 '
      if (value !== '') {
        base_sql += 'and alias like \'%' + value + '%\''
      }
      this.fetching = true
      this.host = dealQuery(await sql(base_sql))
      this.$forceUpdate()
      this.fetching = false
    },
    async fetchEndpoint (value) {
      this.endpoint = []
      let base_sql = 'select id,alias from t_patrol_endpoint where 1=1 '
      if (value !== '') {
        base_sql += 'and alias like \'%' + value + '%\''
      }
      this.fetching = true
      this.endpoint = dealQuery(await sql(base_sql))
      this.fetching = false
    },
    async fetchMetric (value) {
      this.metric = []
      let base_sql = 'select id,alias from t_patrol_metric where 1=1 '
      if (value !== '') {
        base_sql += 'and alias like \'%' + value + '%\''
      }
      this.fetching = true
      this.metric = dealQuery(await sql(base_sql))
      this.fetching = false
    },
    async fetchAnswer (value) {
      this.answer = []
      let base_sql = 'select id,alias from t_patrol_answer where 1=1 '
      if (value !== '') {
        base_sql += 'and alias like \'%' + value + '%\''
      }
      this.fetching = true
      this.answer = dealQuery(await sql(base_sql))
      this.fetching = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
