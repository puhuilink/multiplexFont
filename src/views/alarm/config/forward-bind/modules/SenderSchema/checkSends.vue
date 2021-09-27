<template>
  <fragment>
    <a-row>
      <a-col :span="8">
        <a-checkbox ref="sms" :checked="value | smsFilter" @input="toggleSMS">
          短信
        </a-checkbox>
      </a-col>
      <a-col :span="16">
        <a-form-model-item label="短信模板" prop="temp_sms_id" v-bind="nestedFormItemLayout">
          <a-select
            class="item1"
            allowClear
            :disabled="value | smsCheck"
            v-model="send.temp_sms_id"
          >
            <a-select-option v-for="{ id, title } in smsTempList" :key="id" :value="id">{{ title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-checkbox ref="email" :checked="value | emailFilter" @input="toggleEmail">
          邮箱
        </a-checkbox>
      </a-col>
      <a-col :span="16">
        <a-form-model-item label="邮箱模板" prop="temp_email_id" v-bind="nestedFormItemLayout">
          <a-select
            class="item1"
            allowClear
            :disabled="value | emailCheck"
            v-model="send.temp_email_id"
          >
            <a-select-option v-for="{ id, title } in emailTempList" :key="id" :value="id">{{ title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
  </fragment>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'CheckSends',
  props: {
    value: {
      type: String,
      default: ''
    },
    emailTempList: {
      type: Array,
      default: () => []
    },
    smsTempList: {
      type: Array,
      default: () => []
    },
    send: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    smsFilter (val) {
      const v = val.split('/')
      if (v.includes('SMS')) return true
      else return false
    },
    emailFilter (val) {
      const v = val.split('/')
      if (v.includes('EMAIL')) return true
      else return false
    },
    smsCheck (val) {
      const v = val.split('/')
      if (v.includes('SMS')) return false
      else return true
    },
    emailCheck (val) {
      const v = val.split('/')
      if (v.includes('EMAIL')) return false
      else return true
    }
  },
  data: () => ({
    nestedFormItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 16, offset: 1 }
    },
    rules: {}
  }),
  methods: {
    toggleSMS (e) {
      if (!e) {
        Reflect.deleteProperty(this.rules, 'temp_sms_id')
        this.send.methods = _.pull(this.send.methods.split('/'), 'SMS').join('/')
        this.send.temp_sms_id = null
        this.$emit('deleteStatus', 'temp_sms_id')
      } else {
        const rule = { temp_sms_id: [
          { required: true, message: '请选择短信联系人', trigger: 'blur' }
        ] }
        this.rules = { ...this.rules, ...rule }
        this.$emit('addStatus', this.rules)
        const arr = this.send.methods.split('/')
        arr.push('SMS')
        this.send.methods = _.compact(arr).join('/')
      }
    },
    toggleEmail (e) {
      if (!e) {
        Reflect.deleteProperty(this.rules, 'temp_email_id')
        this.send.methods = _.pull(this.send.methods.split('/'), 'EMAIL').join('/')
        this.send.temp_email_id = null
        this.$emit('deleteStatus', 'temp_email_id')
      } else {
        const rule = { temp_email_id: [
          { required: true, message: '请选择邮箱', trigger: 'blur' }
        ] }
        this.rules = { ...this.rules, ...rule }
        const arr = this.send.methods.split('/')
        arr.push('EMAIL')
        this.send.methods = _.compact(arr).join('/')
        this.$emit('addStatus', this.rules)
      }
    }
  }
}
</script>

<style scoped>

</style>
