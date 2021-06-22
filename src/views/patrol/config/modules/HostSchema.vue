<template>
  <a-modal
    title="监控对象"
    wrapClassName="HostSchema"
    :visible="visible"
    @change="$emit('update:visible', $event)"
    @ok="handleOk"
  >
    <div>巡更点位: {{ xgModelPoint.alias }}</div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <a-form-model-item
        label="监控对象"
        prop="hostId"
        :rules="[{ required: true, message: '请输入监控对象' }]"
      >
        <a-select placeholder="请输入监控对象" v-model="form.hostId" :disabled="!isNew">
          <a-select-option v-for="h in Object.values(hosts)" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <div class="HostSchema__content" ref="content">
        <div class="tablesStyle" v-for="(item, index) in form.endpoints" :key="index">
          <a-form-model-item
            label="监控实体"
            style="margin-bottom: 0"
            :prop="`endpoints.${index}.endpointId`"
            :rules="[{ required: !item.isVirtual, message: '监控实体不能为空' }]"
          >
            <a-select
              mode="default"
              placeholder="请输入监控实体"
              style="width: 160px"
              v-model="item.endpointId"
              :disabled="form.endpoints[index].isVirtual"
              :show-arrow="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="endpoint in Object.values(endpoints)" :key="endpoint.id" :value="endpoint.id">{{ endpoint.alias
              }}({{ endpoint.id }})
              </a-select-option>
            </a-select>
            <a-checkbox
              style="margin-left: 10px"
              @change="()=>{
                form.endpoints[index].isVirtual = !form.endpoints[index].isVirtual
                if(form.endpoints[index].isVirtual){
                  form.endpoints[index].endpointId = null
                }
              }">虚拟
            </a-checkbox>
          </a-form-model-item>
          <div class="tablesStyle" v-for="(element, i) in item.metric" :key="i">
            <a-form-model-item
              label="检查项"
              style="margin-bottom: 0"
              :prop="`endpoints.${index}.metrics.${i}.metricId`"
              :rules="[{ required: true, message: '检查项不能为空' }]"
            >
              <a-select v-model="element.metricId" placeholder="检查项不能为空">
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0;" />
                  <div
                    style="padding: 4px 8px; cursor: pointer;"
                    @mousedown="e => e.preventDefault()"
                    @click="navigatorToEditMetric"
                  >
                    <a-icon type="edit" />
                    编辑
                  </div>
                </div>
                <a-select-option v-for="(metric,id) in metrics" :key="id" :value="id">{{ metric.metric_alias }}
                </a-select-option>
              </a-select>
              <a-modal
                title="编辑检查项"
                wrapClassName="MetricSchema"
                :visible="isEditMetric"
                @cancel="popEditMetric"
                @close="popEditMetric"
                @ok="popEditMetric"
              >
                <a-table
                  :data-source="Object.values(metrics)"
                  :pagination="pagination"
                  :columns="metricColumns"
                >
                  <template slot="answer" slot-scope="text, record">
                    <span v-if="record.editable">
                      <a-select v-model="record['answer_id']">
                        <a-select-option v-for="a in Object.values(answers)" :key="a.id" :value="a.id">{{ a.alias
                        }}</a-select-option>
                      </a-select>
                    </span>
                    <span v-else>
                      {{ answers[record['answer_id']].alias }}
                    </span>
                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <span v-if="record.editable">
                        <a @click="() => save(record.key)">保存</a>
                        <a-popconfirm title="确认取消?" @confirm="() => cancel(record.key)">
                          <a>取消</a>
                        </a-popconfirm>
                      </span>
                      <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                        <a-divider type="vertical" />
                        <a :disabled="editingKey !== ''" @click="() => delete(record.key)">删除</a>
                      </span>
                    </div>
                  </template>

                </a-table>
              </a-modal>
            </a-form-model-item>

            <a-form-model-item label="阈值设置" style="margin-bottom: 0" :rules="[{ required: true, message: '检查项不能为空' }]">
              <a-form-model-item
                :prop="`endpoints.${index}.metric.${i}.threshold.condition`"
                :style="{
                  // display: 'inline-block',
                  // width: '70px',
                  marginBottom: 0,
                }"
                :rules="[{ required: true, message: '检查值不能为空' }]"
              >
                <a-select v-model="element.threshold.condition">
                  <a-select-option
                    value="eq"
                    v-if="element.metricId!=null
                      ?metrics[element.metricId] != null
                        ?answers[metrics[element.metricId].answer_id].type === 'select'
                        :false
                      :false"
                  > 等于
                  </a-select-option>
                  <a-select-option
                    value="lt"
                    v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'fill':false:false"
                  > 小于
                  </a-select-option>
                  <a-select-option
                    value="gt"
                    v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'fill':false:false"
                  > 大于
                  </a-select-option>
                  <a-select-option
                    value="out"
                    v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'fill':false:false"
                  > 超出
                  </a-select-option>
                  <a-select-option
                    value="ne"
                    v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'select':false:false"
                  > 不等于
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :prop="`endpoints.${index}.metric.${i}.threshold.lowerThreshold`"
                :style="{
                  // display: 'inline-block',
                  // width: '70px',
                  marginBottom: 0
                }"
                :rules="[{ required: true, message: '阈值不能为空' }]"
                v-if="element.threshold.condition !=='gt'"
              >
                <a-input-number
                  placeholder="请输入阈值"
                  v-model="element.threshold.lowerThreshold"
                  v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'fill':false:false"
                  :min="0"
                  :step="0.1"
                ></a-input-number>
                <a-select
                  :default-value="element.threshold.condition === 'ne'? '请选择非异常项' : '请选择异常项'"
                  v-model="element.threshold.lowerThreshold"
                  v-if="element.metricId!=null?metrics[element.metricId] != null?answers[metrics[element.metricId].answer_id].type === 'select':false:false"
                >
                  <a-select-option
                    v-for="m in answers[metrics[element.metricId].answer_id].format"
                    :key="m.value"
                    :value="m.value">
                    {{ m.alias }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :prop="`endpoints.${index}.metrics.${i}.threshold.upperThreshold`"
                :style="{
                  // display: 'inline-block',
                  // width: '70px',
                  marginBottom: 0
                }"
                :rules="[{ required: true, message: '阈值不能为空' }]"
                v-if="element.threshold.condition === 'out'||element.threshold.condition === 'gt'"
              >
                <span v-show="element.threshold.condition ==='out'">---</span>
                <a-input-number placeholder="请输入阈值" v-model="element.threshold.upperThreshold"></a-input-number>
              </a-form-model-item>
            </a-form-model-item>
            <a-form-model-item
              label="告警级别"
              style="margin-bottom: 0"
              :prop="`endpoints.${index}.metrics.${i}.threshold.severity`"
              :rules="[{ required: true, message: '告警级别不能为空' }]"
            >
              <a-select v-model="element.threshold.severity">
                <a-select-option :value="1"> L1(紧急告警)</a-select-option>
                <a-select-option :value="2"> L2(主要告警)</a-select-option>
                <a-select-option :value="3"> L3(次要告警)</a-select-option>
                <a-select-option :value="4"> L4(一般告警)</a-select-option>
              </a-select>
            </a-form-model-item>
            <div style="display: block;float: right" v-show="form.endpoints[index].metric.length > 1">
              <a-button type="primary" @click="removeMetric(index,i)" icon="delete"></a-button>
            </div>
          </div>
          <div class="HostSchema__btn-remove">
            <a-button type="primary" @click="removeParam(index)"> 删除</a-button>
          </div>
          <div class="HostSchema__btn_group">
            <a-button type="primary" @click="addMetric(index)" icon="plus"></a-button>
          </div>
        </div>
        <div class="HostSchema__btn_group">
          <a-button type="primary" @click="addEndpoint"> 添加</a-button>
        </div>
      </div>
    </a-form-model>
  </a-modal>
</template>

<script>
import { scrollTo } from '@/utils/util'
import Template from '@/views/design/modules/template/index'
import TagSelectOption from '~~~/TagSelect/TagSelectOption'
import { xungeng } from '@/utils/request'

export default {
  name: 'HostSchema',
  mixins: [],
  components: {
    TagSelectOption,
    Template,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        hostId: '',
        hostAlias: '',
        endpoints: [
          {
            endpointId: '',
            endpointAlias: '',
            isVirtual: false,
            metric: [
              {
                metricId: '',
                answerId: '',
                threshold: {
                  condition: '',
                  lowerThreshold: '',
                  upperThreshold: '',
                  severity: 4
                }
              }
            ]
          }
        ]
      })
    },
    xgModelPoint: {
      type: Object,
      default: () => ({ id: '', alias: '' })
    },
    isNew: {
      type: Boolean,
      default: false
    },
    metrics: {
      type: Object,
      default: () => {}
    },
    answers: { type: Object,
      default: () => {} },
    endpoints: {
      type: Object,
      default: () => ({
        id: '',
        alias: '',
        metrics: [] })

    },
    hosts: {
      type: Object,
      default: () => ({ id: '',
        alias: '',
        endpoints: [] })

    },
    thresholds: { type: Array,
      default: () => ([{
        host_id: '',
        endpoint_id: '',
        metric_id: '',
        answer_id: '',
        lower_threshold: '',
        severity: '',
        upper_threshold: ''
      }]) }
  },
  computed: {},
  created () {

  },
  data () {
    return {
      editingKey: '',
      metricColumns: [
        {
          title: '',
          dataIndex: 'metric_alias',
          width: '25%',
          scopedSlots: { customRender: 'metric_alias' }
        },
        {
          title: '',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tempAnswer: {
        id: '',
        alias: '',
        format: ''
      },
      pagination: {
        // total: Object.values(this.metrics).length,
        pageSize: 10
      },
      isEditMetric: false,
      labelCol: {
        xs: { span: 14 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 12 }
      }
    }
  },
  methods: {
    async editHost () {
      await xungeng.post('/host/edit', { checkpointId: this.xgModelPoint.id, ...this.form })
    },
    addEndpoint () {
      this.form.endpoints.push({
        endpointId: '',
        endpointAlias: '',
        isVirtual: false,
        metric: [
          {
            metricId: '',
            answerId: '',
            threshold: {
              condition: '',
              lowerThreshold: '',
              upperThreshold: '',
              severity: 4
            }
          }
        ]
      })
      this.$nextTick(() => {
        scrollTo(this.$refs.content.scrollHeight, { getContainer: () => this.$refs.content })
      })
    },
    addMetric (index) {
      this.form.endpoints[index].metric.push({
        metricId: '',
        answerId: '',
        threshold: {
          condition: '',
          lowerThreshold: '',
          upperThreshold: '',
          severity: 4
        }
      })
      this.$nextTick(() => {
        scrollTo(this.$refs.content.scrollHeight, { getContainer: () => this.$refs.content })
      })
    },
    handleOk () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('update', this.form)
        }
      })
    },
    removeParam (index) {
      this.form.endpoints.splice(index, 1)
    },
    removeMetric (index, i) {
      this.form.endpoints[index].metrics.splice(i, 1)
    },
    navigatorToEditMetric () {
      this.pagination = {
        total: Object.values(this.metrics).length,
        size: 'small',
        pageSize: 10
      }
      console.log(Object.values(this.metrics))
      this.isEditMetric = true
    },
    popEditMetric () {
      this.isEditMetric = false
    },
    transformForm (value) {
      if (this.fetching) {
        return
      }
      this.form.hostAlias = this.hosts[value].alias
      this.form.endpoints = []
      console.log(this.hosts[value])
      this.hosts[value].endpoints.forEach((e) => {
        console.log('endpoints:')
        console.log(e.toString())
        console.log(this.endpoints[e])
        if (this.endpoints[e] === null) {
          return
        }
        const eObj = {
          endpointId: e,
          endpointAlias: this.endpoints[e].alias,
          metric: []
        }
        this.endpoints[e].metrics.forEach((m) => {
          console.log('metrics:')
          console.log(m.toString())
          console.log(this.metrics)
          console.log(this.metrics[m])
          if (this.metrics[m] === null) {
            return
          }
          const t = this.thresholds.find(th => {
            return th.host_id === value && th.endpoint_id === e && th.metric_id === m && th.answer_id === this.metrics[m].answer_id
          })
          if (t === null) {
            return
          }
          eObj.metric.push({
            metricId: m,
            answerId: this.metrics[m].answer_id,
            threshold: {
              lowerThreshold: t.lower_threshold,
              upperThreshold: t.upper_threshold,
              severity: t.severity
            }
          })
        })
        this.form.endpoints.push(eObj)
      })
      console.log('form')
      console.log(this.form)
    }
  },
  watch: {
    'form.hostId': {
      handler (value) {
        setTimeout(this.transformForm(value), 5000)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less">
.HostSchema {
  margin-left: 28px;
  font-weight: 500;
  font-size: 14px;

  &__content {
    height: 490px;
    overflow-y: auto;
  }

  &__btn {
    &_group {
      display: flex;
      width: 100%;
      justify-content: center;
      padding: 4px;
    }

    &-remove {
      position: absolute;
      top: 17px;
      right: 4px;
    }
  }
}

.tablesStyle {
  position: relative;
  margin-bottom: 10px;
  padding: 13px 0 18px 0;
  background-color: #ccc;
}
</style>
