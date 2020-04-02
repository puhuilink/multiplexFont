/*
 * 故障前转路径管理 新建/编辑
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
          <a-form-item label="前转路径名称">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['forward_path_title', { initialValue: record.forward_path_title, rules: [{ required: true, message: '名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转类型">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['forward_type', {
                initialValue: record.forward_type,rules: [{ required: true, message: '前转类型不能为空!' }]
              }]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in screening.forwardType"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="系统前转目标">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['forward_user', {
                initialValue: record.forward_user,rules: [{ required: true, message: '系统前转目标不能为空!' }]
              }]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in queryList.userList"
                :key="item.user_id"
              >
                {{ item.user_id }}/{{ item.staff_name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="其他前转目标">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['forward_destination', {
                initialValue: record.forward_destination
              }]"
            />
          </a-form-item>
        </a-col>
        <!-- 需商议 -->
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转周期">
            <a-input-number
              style="width: 100%"
              :disabled="mode=='See'"
              :min="0"
              v-decorator="['send_cycle', { initialValue: record.send_cycle }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转周期单位">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['send_cycle_unit', {
                initialValue: record.send_cycle_unit
              }]"
              placeholder="请选择"
            >
              <a-select-option value="m">分钟</a-select-option>
              <a-select-option value="h">小时</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="发送标志">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['send_tag', {
                initialValue: record.send_tag,
              }]"
              placeholder="请选择"
            >
              <a-select-option value="0">封挡后发送</a-select-option>
              <!-- <a-select-option value="1">否</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="是否启用">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['enabled', {
                initialValue: record.enabled,
                rules: [{ required: true, message: '启用不能为空!' }]
              }]"
              placeholder="请选择"
            >
              <a-select-option value="true">是</a-select-option>
              <a-select-option value="false">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转模板">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['template_path', {
                initialValue: record.template_path,
              }]"
              placeholder="请选择"
            >
              <a-select-option value="0">模板</a-select-option>
              <!-- <a-select-option value="1">否</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="备注">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['forward_comment', { initialValue: record.forward_comment }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="过滤条件(选填)">
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="故障级别">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['incident_severity', {
                initialValue: record.incident_severity
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
          <a-form-item label="故障分类">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['incident_type', {
                initialValue: record.incident_type
              }]"
            >
              <a-select-option
                v-for="item in screening.levelList"
                :key="item.level"
                :value="item.level"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
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
import queryList from '@/api/alarm/queryList'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const insert = gql`mutation ($objects: [t_forward_path_insert_input!]! = []) {
  insert_t_forward_path (objects: $objects) {
    returning {
      forward_path_id
    }
  }
}`

const update = gql`mutation update ($where: t_forward_path_bool_exp!, $val: t_forward_path_set_input) {
  update_t_forward_path (
    where: $where,
    _set: $val
  ) {
      returning {
      forward_path_id
    }
  }
}`

export default {
  name: 'FMDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
      mode: '',
      screening,
      queryList: {}
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
    this.getqueryList()
  },
  beforeMount () {
  },
  methods: {
    async open (record, mode) {
      this.visible = true
      this.record = record
      this.mode = mode
    },
    async getqueryList () {
      this.queryList.userList = await queryList.userList()
      this.queryList.faultList = await queryList.faultList()
    },
    handleCancel (e) {
      this.visible = false
    },
    /**
     * 表单效验
     */
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.send_cycle = this.sendCycleStr(values.send_cycle, values.send_cycle_unit)
          delete (values.send_cycle_unit)
          if (this.mode === 'New') {
            values.forward_path_id = screening.createUniqueId()
            this.insert(values)
          } else if (this.mode === 'Edit') {
            this.update(values)
          }
        }
      })
    },
    /**
     * 前转周期时间处理
     */
    sendCycleStr (cycle, unit) {
      switch (unit) {
        case 'm':
          return cycle * 600000
        case 'h':
          return cycle * 3600000
        default:
          break
      }
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
            'name_S': {
              '_eq': this.record.name_s
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
