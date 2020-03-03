<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="域选择"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'domain',
            { initialValue: record.domain,
              rules: [{ required: true, message: '请选择域' }]
            },
          ]"
          placeholder="请选择域"
        >
          <a-select-option
            v-for="item in queryList.domainList"
            :key="item.name_s"
          >
            {{ item.label_s }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'node_type',
            { initialValue: record.node_type,
              rules: [{ required: true, message: '请选择类型' }] },
          ]"
          placeholder="请选择类型"
        >
          <a-select-opt-group
            v-for="(group,index) in queryList.typeList"
            :key="index"
            :label="group[0].parentname_s"
            :allowClear="true"
          >
            <template v-for="(groupitem,indexs) in group">
              <a-select-option :value="groupitem.name_s" :key="indexs">{{ groupitem.label_s }}</a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="告警类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          placeholder="请选择告警类型"
          v-decorator="[
            'alertCode',
            {
              initialValue: record.alertCode
            }
          ]"
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
      <a-form-item
        label="告警级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          allowClear
          placeholder="请选择告警级别"
          v-decorator="[
            'severityFilter',
            {
              initialValue: record.severity
            }
          ]"
        >
          <!-- @change="alarmLevelChange" -->
          <!-- <a-select-option value="checkall" key="checkall">全选</a-select-option> -->
          <a-select-option
            v-for="item in screening.severityList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'
import queryList from '@/api/alarm/queryList'

export default {
  name: 'Rules',
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      screening,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      queryList: {}
    }
  },
  created () {
    this.getqueryList()
    const severity = this.record.severityFilter ? this.record.severityFilter.split(',') : []
    this.record.severity = severity.map(Number)
  },
  methods: {
    async getqueryList () {
      this.queryList.domainList = await queryList.domainList()
      this.queryList.typeList = await queryList.typeList()
      this.queryList.alertList = await queryList.alertList()
    },
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep', values)
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
