<template>
  <a-modal
    centered
    :title="title"
    :width="700"
    wrapClassName="SenderSchema__modal"
    v-model="visible"
    :afterClose="reset"
    @ok="addSubmit"
  >
    <div
      class="SendForm"
      ref="content"
    >
      <a-form-model ref="form" :model="send" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" >
        <a-form-model-item
          label="封禁时间"
          prop="ban_time"
          :rules="[{ required: true, message: '封禁时间必填' }]"
        >
          <!--          <a-date-picker-->
          <!--            :mode="mode1"-->
          <!--            v-model="send.ban_time"-->
          <!--            :disabledDate="disabledBanDate"-->
          <!--            :show-time="{ defaultValue: moment('HH:mm:ss') }"-->
          <!--            @openChange="handleOpenChange1"-->
          <!--            @panelChange="handlePanelChange1"-->
          <!--            :showToday="false"-->
          <!--          />-->
          <a-date-picker
            v-model="send.ban_time"
            :disabled-date="disabledStartDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="封禁时间"
            @openChange="handleStartOpenChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="解封时间"
          prop="unseal_time"
          :rules="[{ required: true, message: '封禁时间必填' }]"
        >
          <!--          <a-date-picker-->
          <!--            style="width: 100px"-->
          <!--            :mode="mode1"-->
          <!--            v-model="send.unseal_time"-->
          <!--            :disabledDate="disabledUnsealDate"-->
          <!--            :show-time="{ defaultValue: moment('HH:mm:ss') }"-->
          <!--            @openChange="handleOpenChange1"-->
          <!--            @panelChange="handlePanelChange1"-->
          <!--          />-->
          <a-date-picker
            v-model="send.unseal_time"
            :disabled-date="disabledEndDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="解封时间"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="封禁目的IP"
          prop="ip"
        >
          <a-textarea v-model="send.ip" placeholder="请输入封禁目标ip，多个以英文格式的逗号，分号空格换行隔开。支持连续IP地址段录入"></a-textarea>
        </a-form-model-item>
        <a-form-model-item
          label="封禁原因"
          prop="remark"
        >
          <a-textarea v-model="send.remarks" placeholder="请输入封禁原因"></a-textarea>
        </a-form-model-item>
      </a-form-model>
      <!-- / 底部按钮 -->
      <template slot="footer">
        <a-button @click="localCancel">取消</a-button>
        <a-button @click="addSubmit">why</a-button>
        <a-button @click="addSubmit" :loading="btnLoading" type="primary">提交</a-button>
      </template>
    </div>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import moment from 'moment'
import { PatrolAccessBanService } from '@/api/service/patrolAccessBanService'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'

export default {
  name: 'BanList',
  mixins: [Schema],
  data () {
    return {
      btnLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      endOpen: false,
      send: {
        ban_time: '',
        unseal_time: '',
        ip: '',
        remarks: ''
      },
      mode1: 'time',
      rules: {
        ip: [
          { required: true, message: 'IP必填！', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            const ipList = value.split(/[\s\n]|,|;/)
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            ipList.map(el => {
              if (!reg.test(el)) { callback(new Error('输入格式有误')) }
            })
            callback()
          },
          trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    moment,
    disabledStartDate (startValue) {
      const endValue = this.send.unseal_time
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.send.ban_time
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    disabledBanDate (current) {
      return current && current < this.moment().endOf('day')
    },
    disabledUnsealDate (current) {
      return current < this.send.ban_time.endOf('day')
    },
    localCancel () {
      this.cancel()
      this.reset()
    },
    splitStr (str) {
      return str.split(/[\s\n]|,|;/)
    },
    handleOpenChange1 (open) {
      if (open) {
        this.mode1 = 'time'
      }
    },
    handleChange (value) {
      this.value = value
    },
    handlePanelChange1 (value, mode) {
      this.mode1 = mode
    },
    handlePanelChange2 (value, mode) {
      this.value = value
      this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    add () {
      this.show('封禁')
    },
    addSubmit () {
      this.$refs.form.validate(async value => {
        if (!value) return
        try {
          this.btnLoading = true
          const { ban_time, unseal_time, ...rest } = this.send
          await PatrolAccessBanService.add(
            {
              state: true,
              account: Vue.ls.get(USER).name,
              order_number: this.moment().format(this.formatDate),
              ban_time: ban_time.format(this.formatDate),
              unseal_time: unseal_time.format(this.formatDate),
              ...rest
            })
          this.$emit('addSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.btnLoading = false
        }
      })
    },
    show (title) {
      this.title = title
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
