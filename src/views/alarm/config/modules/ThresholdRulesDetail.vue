/*
 * 阈值规则 详情/编辑/新建
 */
<template>
  <a-modal
    :title="mode=='New'?'新增':mode=='See'?'详情':'编辑'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="名称">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['title', { initialValue: record.title, rules: [{ required: true, message: '名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="数据域">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['domain', {
                initialValue: record.domain,
                rules: [{ required: true, message: '数据域不能为空!' }]
              }]"
            >
              <a-select-option
                v-for="item in queryList.domainList"
                :key="item.name_s"
              >
                {{ item.label_s }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="节点类型">
            <!-- :value="formData0.node_type" -->
            <CiModelSelect
              @input="onModelInput"
              v-decorator="['node_type', {
                initialValue: record.node_type,
                rules: [{ required: true, message: '节点类型不能为空!' }]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="节点过滤">
            <CiInstanceSelect
              v-decorator="['node_ids', {
                initialValue: record.node_ids
              }]"
              :parentNameS="formData0.node_type"
              @input="onInstanceInput"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="实例过滤">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['instance', { initialValue: record.instance }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="KPI类型">
            <KpiSelect
              placeholder
              :nodetypeS="formData0.node_type"
              v-decorator="['kpi_code', {
                initialValue: record.kpi_code,
                rules: [{ required: true, message: 'KPI类型不能为空!' }]
              }]"
              @input="onKpiInput"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警类型">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['alert_code', {
                initialValue: record.alert_code,
                rules: [{ required: true, message: '告警类型不能为空!' }]
              }]"
            >
              <a-select-opt-group
                v-for="(group,index) in queryList.alertList"
                :key="index"
                :label="group[0].parentname_s"
                :allowClear="true"
              >
                <template v-for="groupitem in group">
                  <a-select-option :value="groupitem.id_s" :key="groupitem.id_s">{{ groupitem.label_s }}</a-select-option>
                </template>
              </a-select-opt-group>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警级别">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['severity', {
                initialValue: record.severity,
                rules: [{ required: true, message: '告警级别不能为空!' }]
              }]"
            >
              <a-select-option
                v-for="item in screening.severityList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="是否启用">
            <a-radio-group
              v-decorator="[
                'enabled',
                { initialValue: record.enabled || true,
                  rules: [{ required: true, message: '启用不能为空!' }]
                }
              ]"
            >
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="是否忽略节点实例">
            <a-radio-group
              v-decorator="['ignore_instance', {
                initialValue: record.ignore_instance
              }]"
            >
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="阈值条件">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 24%;margin-right:1%"
              v-decorator="['condition', {
                initialValue: record.condition?record.condition:'compare(value,ref)=0',
                rules: [{ required: true, message: '不能为空!' }]
              }]"
            >
              <a-select-option v-for="item in conditionOptions" :key="item.name" :value="item.name">{{ item.label }}</a-select-option>
            </a-select>
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 24%;margin-right:1%"
              v-decorator="['threshold_type', {
                initialValue: record.threshold_type?record.threshold_type:'fixvalue'
              }]"
            >
              <a-select-option v-for="item in thresholdTypeOptions" :key="item.name" :value="item.name">{{ item.label }}</a-select-option>
            </a-select>
            <!-- <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 24%;margin-right:1%"
              v-decorator="['udapvalue_type', {
                initialValue: record.udapvalue_type?record.udapvalue_type:'top_line_value'
              }]"
            >
              <a-select-option v-for="item in udapvalueTypeOptions" :key="item.name" :value="item.name">{{ item.label }}</a-select-option>
            </a-select> -->
            <a-input
              style="width: 24%"
              :disabled="mode=='See'"
              v-decorator="['ref_value', { initialValue: record.ref_value, rules: [{ required: true, message: '不能为空!' }]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="计数条件">
            <template style="width: 24%;margin-right:1%">
              当满足
              <a-input-number
                :disabled="mode=='See'"
                v-decorator="['enter_count', { initialValue: record.enter_count?record.enter_count:1, rules: [{ required: true, message: '不能为空!' }] }]"
              />
              次时激活
            </template>
            <template style="width: 24%;margin-right:1%">
              以后每
              <a-input-number
                :disabled="mode=='See'"
                v-decorator="['keep_count', { initialValue: record.keep_count?record.keep_count:0, rules: [{ required: true, message: '不能为空!' }] }]"
              />
              次时重复发送
            </template>
            <template style="width: 24%;margin-right:1%">
              不满足
              <a-input-number
                :disabled="mode=='See'"
                v-decorator="['exit_count', { initialValue: record.exit_count?record.exit_count:1, rules: [{ required: true, message: '不能为空!' }] }]"
              />
              次时恢复
            </template>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="消息模板">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['message', { initialValue: record.message?record.message:message, rules: [{ required: true, message: '显示名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template slot="footer" >
      <a-button v-if="mode!=='See'" @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

  </a-modal>
</template>

<script>
import screening from '../../screening'
import queryList from '@/api/controller/AlarmqQueryList'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import {
  CiModelSelect,
  CiInstanceSelect,
  KpiSelect
} from '@/components/Common'

const query = gql`query MyQuery ($where: t_threshold_bool_exp! = {}) {
  data: t_threshold(where: $where) {
    title
    id
  }
}`

const insert = gql`mutation ($objects: [t_threshold_insert_input!]! = []) {
  insert_t_threshold (objects: $objects) {
    returning {
      id
    }
  }
}`

const update = gql`mutation update ($where: t_threshold_bool_exp!, $val: t_threshold_set_input) {
  update_t_threshold (
    where: $where,
    _set: $val
  ) {
      returning {
      id
    }
  }
}`

export default {
  name: 'ThresholdRulesDetail',
  components: {
    CiModelSelect,
    CiInstanceSelect,
    KpiSelect
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formData0: {},
      queryList: {},
      visible: false,
      loading: false,
      record: '',
      mode: '',
      screening,
      conditionOptions: [
        {
          id: 1,
          label: '等于',
          name: 'compare(value,ref)=0'
        },
        {
          id: 2,
          label: '不等于',
          name: 'compare(value,ref)!=0'
        },
        {
          id: 3,
          label: '大于',
          name: 'compare(value,ref)>0'
        },
        {
          id: 4,
          label: '大于等于',
          name: 'compare(value,ref)>=0'
        },
        {
          id: 5,
          label: '小于',
          name: 'compare(value,ref)<0'
        },
        {
          id: 6,
          label: '小于等于',
          name: 'compare(value,ref)<=0'
        },
        {
          id: 7,
          label: '包含',
          name: 'contains($value,ref)'
        },
        {
          id: 8,
          label: '不包含',
          name: '!contains($value,ref)'
        },
        {
          id: 9,
          label: '属于',
          name: 'contains(ref,$value)'
        },
        {
          id: 10,
          label: '不属于',
          name: '!contains(ref,$value)'
        },
        {
          id: 11,
          label: '匹配',
          name: 'matchs($value,ref)'
        },
        {
          id: 12,
          label: '不匹配',
          name: '!matchs($value,ref)'
        }
      ],
      thresholdTypeOptions: [
        {
          id: 1,
          label: '固定值',
          name: 'fixvalue'
        },
        {
          id: 2,
          label: '动态基线',
          name: 'udapvalue'
        }
      ],
      udapvalueTypeOptions: [
        {
          id: 1,
          label: '最大值',
          name: 'top_line_value'
        },
        {
          id: 2,
          label: '平均值',
          name: 'middle_line_value'
        },
        {
          id: 3,
          label: '最小值',
          name: 'bottom_line_value'
        }
      ],
      // eslint-disable-next-line no-template-curly-in-string
      message: "${thresholdName} - ${nodeType}[${nodeLabel}]${=iif(isNull(instance),'','['+instance+']')}${kpiLabel}:${valueStr} [${count}]"
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
  },
  beforeMount () {
  },
  methods: {
    async open (record, mode) {
      this.visible = true
      this.record = record
      this.mode = mode
      this.getqueryList()
    },
    /**
     * 获取筛选项的下拉列表的值
     */
    async getqueryList () {
      this.queryList.domainList = await queryList.domainList()
      this.queryList.alertList = await queryList.alertList()
    },
    onModelInput (str = '') {
      this.formData0 = {
        node_type: str,
        node_ids: [],
        kpi_code: []
      }
      this.form.setFieldsValue({
        node_type: str,
        node_ids: [],
        kpi_code: []
      })
    },
    onInstanceInput (arr = []) {
      // FIXME: 有时候抛出的 arr 是字符串？
      this.formData0.node_ids = Array.isArray(arr) ? arr : []
      // TODO: 重置 kpi ？
      this.form.setFieldsValue({
        node_ids: Array.isArray(arr) ? arr : []
      })
    },
    onKpiInput (arr = []) {
      this.formData0.kpi_code = Array.isArray(arr) ? arr : []
      this.form.setFieldsValue({
        kpi_code: Array.isArray(arr) ? arr : []
      })
    },
    /**
     * ci实例改变 筛选是否全选
     */
    CIInstanceChange (value) {
      this.queryParam.node_ids = screening.checkAll(value, this.queryList.CIInstance)
    },
    handleCancel (e) {
      this.visible = false
    },
    /**
     * 表单效验
     */
    async handleSubmit (e) {
      e.preventDefault()
      const info = this.form.getFieldsValue()
      const InfoExist = await this.queryInfoExist(info.title)
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log(values)
          if (this.mode === 'New') {
            if (InfoExist.length === 0) {
              values.id = screening.createUniqueId()
              values.kpi_code = Number(values.kpi_code[0])
              values.node_ids = values.node_ids[0]
              this.insert(values)
            } else {
              this.$notification.error({
                message: '系统提示',
                description: '该规则名称已存在，请更改名称'
              })
            }
          } else if (this.mode === 'Edit') {
            if (InfoExist.length === 0 || InfoExist.id === this.record.id) {
              this.update(values)
            }
          }
        }
      })
    },

    async queryInfoExist (e) {
      return apollo.clients.alert.query({
        query,
        variables: {
          where: {
            title: {
              _eq: e
            }
          }
        }
      }).then(res => res.data.data)
    },
    /**
     * 新增
     */
    async insert (values) {
      this.loading = true
      // FIXME: 数据库 rid 与 did 一致，did 不是外键？
      return apollo.clients.alert.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values
          }]
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '新增成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 编辑
     */
    async update (values) {
      this.loading = true
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          where: {
            'id': {
              '_eq': this.record.id
            }
          },
          val: {
            ...values
          }
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
