/*
 * 前转告警
 */
<template>
  <div class="roll-forward">
    <a-modal
      title="告警前转"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :destroyOnClose="true"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            label="标题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="请输入标题"
              v-decorator="['title', { initialValue: forwardInfo.title }, {rules: [{required: true, message: '请输入标题！'}]}]"
            />
          </a-form-item>
          <a-form-item
            label="前转方式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group v-model="forwardInfo.forwardAction">
              <a-radio :value="'severity'">级别分类方式</a-radio>
              <a-radio :value="'user'">直接转给客户</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-show="forwardInfo.forwardAction=='severity'"
            label="级别选择"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="[
                'severity',
                { rules: [{
                  required: forwardInfo.forwardAction=='severity'?true:false,
                  message: '请选择'
                }] },
              ]"
              placeholder="请选择"
            >
              <a-select-option v-for="item in levelList" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-show="forwardInfo.forwardAction=='severity'"
            label="故障分类"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            optionFilterProp="children"
            :filterOption="filterType"
          >
            <a-select
              v-decorator="[
                'incidentType',
                { rules: [{
                  required: forwardInfo.forwardAction=='severity'?true:false,
                  message: '请选择故障分类'
                }] },
              ]"
              placeholder="请选择故障分类"
            >
              <a-select-option
                v-for="item in ITypeList"
                :key="item.type_id"
                :value="item.type_id">
                {{ item.type_title }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-show="forwardInfo.forwardAction=='user'"
            label="前转类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="[
                'forwardType',
                { rules: [{
                  required: forwardInfo.forwardAction=='user'?true:false,
                  message: '请选择'
                }] },
              ]"
              placeholder="请选择"
            >
              <a-select-option v-for="item in forwardType" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-show="forwardInfo.forwardAction=='user'"
            label="前转用户"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            optionFilterProp="children"
            :filterOption="filterType"
          >
            <a-select
              mode="multiple"
              v-decorator="[
                'target',
                { rules: [{
                  required: forwardInfo.forwardAction=='user'?true:false,
                  message: '不能为空'
                }] },
              ]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in userList"
                :key="item.user_id"
                :value="item.user_id"
              >
                {{ item.staff_name }} | {{ item.email }} | {{ item.mobile_phone }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="描述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea placeholder="请输入描述" :rows="4" v-decorator="['content']"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
const userQuery = gql`query MyQuery {
  t_user {
    auth_method
    createdate
    creator
    email
    user_id
    staff_name
    mobile_phone
  }
}`
const incidentTypeQuery = gql`query MyQuery {
  t_incident_type {
    parent_type_id
    comments
    parent_type_title
    type_id
    type_title
  }
}`

const update = gql`mutation update_t_alert ($idList: [numeric!] = [], $change: t_alert_set_input) {
  update_t_alert(
    where: {
      alert_id: {_in: $idList}
    },
    _set: $change
    ) {
    affected_rows
  }
}`

export default {
  name: 'RollForward',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      // 下拉框数据对象
      levelList: [
        {
          label: 'INFO',
          value: 0
        },
        {
          label: 'WARNING',
          value: 1
        },
        {
          label: 'MINOR',
          value: 2
        },
        {
          label: 'MAJOR',
          value: 3
        },
        {
          label: 'CRITICAL',
          value: 4
        }
      ],
      forwardType: [
        { value: 'EOMS', label: '运维系统' },
        { value: 'Email', label: '邮件' },
        { value: 'SMS', label: '短信' }
      ],
      form: this.$form.createForm(this),
      record: '',
      idList: '',
      forwardInfo: {
        title: '',
        forwardAction: 'severity'
      },
      userList: [],
      ITypeList: []
    }
  },
  created () {
    this.getUserList()
    this.getIncidentType()
  },
  methods: {
    open (idList, record) {
      this.visible = true
      this.idList = idList
      this.record = record
      this.forwardInfo.title = '[' + record[0].message + ']等' + record.length + '条告警被前转'
      // this.form.resetFields()
    },
    /**
     * 故障类型搜索过滤
     */
    filterType (input, option) {
      // return (
      //   option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // )
      console.log(input, option)
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.update(values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    async getUserList () {
      return apollo.clients.alert.query({
        query: userQuery
      }).then(r => {
        this.userList = r.data.t_user
      })
    },
    async getIncidentType () {
      return apollo.clients.alert.query({
        query: incidentTypeQuery
      }).then(r => {
        this.ITypeList = r.data.t_incident_type
      })
    },
    async update (values) {
      this.loading = true
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          idList: this.idList,
          change: {
            incident_id: values.incidentType,
            state: 10,
            comments: values.content
          }
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '告警前转成功'
        })
        this.$emit('ok')
        this.visible = false
        this.confirmLoading = false
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
