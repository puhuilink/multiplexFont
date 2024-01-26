<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="1500"
    :afterClose="reset"
    okText="提交"
    @ok="submit"
    :confirmLoading="confirmLoading"
    centered>
    <a-row :gutter="8">

      <a-col span="8">
        <a-form-model
          ref="form"
          :model="formData"
          layout="inline"
        >
          <a-form-model-item
            label="排班名称"
            prop="name"
            :rules="[{ required: true, message: '排班名称必填' }]"
          >
            <a-input placeholder="请输入排班名称" v-model="formData.name"></a-input>
          </a-form-model-item>
          <a-divider />
          <a-collapse v-model="activeKey">
            <a-collapse-panel key="1" header="设置排班时间＆排班人">
              <template #extra>
                <a-form-model-item
                  prop="sendType"
                  :rules="[{ required: true, message: '排班方式必填', trigger: 'blur' }]"
                  style="margin-top: -8px"
                >
                  <a-radio-group v-model="formData.sendType" @change="changeSendWay">
                    <a-radio value="day">天</a-radio>
                    <a-radio value="week">周</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </template>
              <a-row
                :gutter="[4, 8]"
                v-for="(item, index) in formData.plan"
                :key="item.uuid"
              >
                <a-col :span="8">
                  <a-form-model-item
                    label="从"
                    :prop="`plan.${index}.startTime`"
                    :rules="[{ required: true, message: '开始时间必填', trigger: 'change' }]"
                    v-bind="{
                      labelCol: { span: 8 },
                      wrapperCol: { span: 16 }
                    }"
                  >
                    <a-time-picker
                      placeholder="选择时间"
                      @change="(time, change) => frontTime(time, change, index)"
                      v-model="item.startTime"
                      format="HH:mm"
                      :default-open-value="moment('00:00', 'HH:mm')"
                      style="width: 120%"></a-time-picker>
                  </a-form-model-item>
                </a-col>
                <a-col :span="8">
                  <a-form-model-item
                    label="到"
                    :prop="`plan.${index}.endTime`"
                    :rules="[{ required: true, message: '结束时间必填', trigger: 'change' }]"
                    v-bind="{
                      labelCol: { span: 8 },
                      wrapperCol: { span: 16 }
                    }"
                  >
                    <a-time-picker
                      placeholder="选择时间"
                      @change="(time, change) => backTime(time, change, index)"
                      v-model="item.endTime"
                      format="HH:mm"
                      :default-open-value="moment('00:00', 'HH:mm')"
                      style="width: 120%"></a-time-picker>
                  </a-form-model-item>
                </a-col>
                <a-col :span="6">
                  <a-form-model-item
                    :prop="`plan.${index}.account`"
                    :rules="[{ required: true, message: '值班人必填', trigger: 'blur' }]"
                    v-bind="{
                      wrapperCol: { span: 24 }
                    }"
                  >
                    <a-select @change="(value) => checkAccount(value, index)" v-model="item.account" allowClear placeholder="请选择值班人" style="width: 100px;margin-left: 2%;"><a-select-option v-for="({label, value}) in group" :key="label + '|||||||||' + value">
                      {{ label }}
                    </a-select-option></a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="2">
                  <a-icon @click="deleteItem(index)" type="delete" v-if="index!==0"/><a-divider type="vertical" v-if="index!==0"/><a-icon type="plus" @click="addItem"/>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item
                    v-if="formData.sendType === 'week'"
                    :prop="`plan.${index}.weekNumber`"
                    :rules="[{ required: true, message: '工作日期必填', trigger: 'blur' }]"
                    v-bind="{
                      wrapperCol: { span: 24 }
                    }"
                  >
                    <a-select v-model="item.weekNumber" mode="multiple" placeholder="请选择工作日期" :style="{'width': '430px', 'margin-left': '2%', 'margin-top': '2%' }">
                      <a-select-option v-for="(item1) in weekMap" :key="item1[0]">
                        {{ weekMap.get(item1[0]) }}
                      </a-select-option></a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="设置生效失效时间" :disabled="false">
              生效时间~失效时间：
              <a-range-picker
                :disabled-date="disabledDate"
                format="YYYY-MM-DD"
                style="width: 100%"
                :value="formData.rangeTime"
                @change="handleChange"
              ></a-range-picker>
            </a-collapse-panel>
          </a-collapse>
        </a-form-model>
      </a-col>
      <a-col span="16">
        <a-calendar
          :validRange="this.formData.rangeTime"
        >
          <ul slot="dateCellRender" slot-scope="value" class="events">
            <li v-for="item in checkCalendar(value)" :key="item.content" style="list-style: none">
              <a-popover trigger="hover">
                <a-badge :status="item.type" :text="item.content" />
                <template #content>
                  {{ item.title }}
                </template>
              </a-popover>
            </li>
          </ul>
        </a-calendar>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import moment from 'moment'
import singleDate from '@/views/work-manage/components/singleDate'
import { alarm } from '@/utils/request'
import { dealObject, weekMap } from './enum.js'
import _ from 'lodash'
import {
  addPropertyToArrayObjects,
  checkDuplicate,
  deletePropertyFromArrayObjects,
  judgeRoleToAlertView
} from '@/utils/util'
import uuid from 'uuid/v4'
export default {
  name: 'Schema',
  data () {
    return {
      weekMap,
      activeKey: ['1', '2'],
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      formData: {
        name: '',
        sendType: 'day',
        rangeTime: [moment().add(1, 'days'), moment().add(1, 'days')],
        plan: [{
          startTime: '',
          endTime: '',
          account: null,
          uuid: uuid()
        }]
      },
      group: [],
      task: []
    }
  },
  mixins: [Schema],
  components: {
    singleDate
  },
  methods: {
    moment,
    handleChange (value) {
      this.formData.rangeTime = value
    },
    handleCancel () {
      this.visible = false
    },
    async queryCurrent (id) {
      try {
        this.loading = true
        // eslint-disable-next-line no-unused-vars
        const { data: { task, schedule } } = await alarm.post('/api/configuration/schedule/detail', { id: id })
        this.visible = true
        this.formData.name = schedule.name
        this.formData.sendType = schedule.dataType
        this.formData.rangeTime = [moment(schedule.effectiveTime), moment(schedule.expireTime)]
        this.formData.plan = schedule.remarks.map(el => {
          el.endTime = moment(el.endTime)
          el.startTime = moment(el.startTime)
          return el
        })
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    edit (id) {
      this.query()
      this.show('编辑排班')
      this.queryCurrent(id)
      this.submit = () => this.onEdit(id)
    },
    onEdit (id) {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        this.confirmLoading = true
        try {
          const prams = dealObject(this.formData)
          const { schedule, task } = prams
          const { code, msg } = await alarm.post('/api/configuration/schedule/update', { schedule: { id: id, ...schedule }, task: task })
          if (code === 200) {
            this.$notifyEditSuccess()
            this.$emit('editSuccess')
            this.cancel()
          } else {
            this.$notification.error({
              description: '系统提示',
              message: msg
            })
          }
        } catch (e) {
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    add () {
      this.query()
      this.show('新建排班')
      this.submit = this.onAdd
    },
    onAdd () {
      this.$refs.form.validate(async isValid => {
        if (!isValid) return
        this.confirmLoading = true
        try {
          const prams = dealObject(this.formData)
          const { code, msg } = await alarm.post('/api/configuration/schedule/add', prams)
          if (code === 200) {
            this.$notifyAddSuccess()
            this.$emit('addSuccess')
            this.cancel()
          } else {
            this.$notification.error({
              description: '系统提示',
              message: msg
            })
          }
        } catch (e) {
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    async query () {
      try {
        const { data } = await alarm.get('/api/configuration/group/getAllUser')
        if (data && data.length) {
          this.group = data.map(el => ({
            label: _.get(el, 'accountName', ''),
            value: _.get(el, 'accountId', '')
          }))
        } else {
          this.$message.warning('暂无可分配用户')
        }
      } catch (e) {
        throw e
      }
    },
    show (title) {
      this.visible = true
      this.title = title
    },
    addItem () {
      const param = {
        startTime: '',
        endTime: '',
        account: null,
        uuid: uuid()
      }
      if (this.formData.plan.length < 10) {
        // TODO 添加一组
        if (this.formData.sendType === 'day') {
          this.formData.plan.push(param)
        } else {
          this.formData.plan.push({ ...param, weekNumber: [] })
        }
      } else {
        this.$message.warn('最多只能有十条排班！')
      }
    },
    deleteItem (index) {
      this.formData.plan.splice(index, 1)
    },
    frontTime (time, change, index) {
      if (this.formData.plan[index].endTime !== '' && moment(this.formData.plan[index].endTime).diff(time, 'second') <= 0) {
        this.$message.warning('开始时间超过结束时间，请重新填写')
        this.formData.plan[index].startTime = ''
      }
    },
    backTime (time, change, index) {
      if (this.formData.plan[index].startTime !== '' && time.diff(moment(this.formData.plan[index].startTime), 'second') <= 0) {
        this.$message.warning('结束时间低于开始时间，请重新填写')
        this.formData.plan[index].endTime = ''
      }
    },
    checkAccount (value, index) {
      this.formData.plan.map(el => el.account)
      if (checkDuplicate(this.formData.plan.map(el => el.account), value)) {
        this.$message.warning('排版人已存在，请重新填写')
        this.formData.plan[index].account = null
      }
    },
    judgeTime (time, front, back) {
      if (moment.isMoment(time)) {
        return time.diff(front, 'hour') >= 0 && back.diff(time, 'day') >= 0
      } else {
        return false
      }
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    checkCalendar (value) {
      const arr = []
      if (this.judgeTime(value, this.formData.rangeTime[0], this.formData.rangeTime[1])) {
        if (this.formData.sendType === 'day') {
          this.formData.plan.map(el => {
            if (el.account !== null) {
              arr.push({ type: 'success', content: el.account.split('|||||||||')[0], title: `${el.startTime.format('HH:mm')}~${el.endTime.format('HH:mm')}` })
            }
          })
        } else {
          this.formData.plan.map(el => {
            if (el.account !== null && el.weekNumber.includes(Number(value.format('d')))) {
              // console.log(el.weekNumber, Number(value.format('d')))
              arr.push({ type: 'success', content: el.account.split('|||||||||')[0], title: `${el.startTime.format('HH:mm')}~${el.endTime.format('HH:mm')}` })
            }
          })
        }
      }
      return arr
    },
    changeSendWay (e) {
      const value = e.target.value
      if (value === 'week') {
        this.formData.plan = addPropertyToArrayObjects(this.formData.plan, 'weekNumber', [])
      } else {
        this.formData.plan = deletePropertyFromArrayObjects(this.formData.plan, 'weekNumber')
      }
      this.activeKey.push('1')
      this.activeKey = _.uniq(this.activeKey)
    },
    reset () {
      this.$refs.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
  // beforeCreate () {
  //   judgeRoleToAlertView()
  // }
}
</script>

<style lang="less"scoped>
</style>
