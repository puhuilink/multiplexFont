<template>
  <div class="notifyRulesBasic">
    <div class="unionAlarm" style="background: white">
      <div class="in-title"><a-button icon="plus" type="primary" @click="()=>openModal()">新建通知策略</a-button></div>
      <a-modal
        title="新建通知策略"
        :visible="visible"
        :confirm-loading="confirmLoading"
        width="50%"
        @ok="handleOk"
        @cancel="closeModal"
        @close="closeModal"
      >
        <a-form-model ref="ruleForm" :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-model-item
            label="告警状态"
            :prop="`alertStatusType`"
            :rules="[{ type:'array',required: true, message: '告警状态必填', trigger: 'change' }]">
            <a-checkbox :checked="statusChecked('1')" @change="changeAlertStatusType('1')" >
              发生时
            </a-checkbox>
            <a-checkbox :checked="statusChecked('0')" @change="changeAlertStatusType('0')">
              关闭时
            </a-checkbox>
            <a-checkbox :indeterminate="notAll" :checked="notAll" @change="changeAlertStatusType('2')">
              全选
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item
            label="通知方式"
            :rules="[{ type:'array',required: true, message: '通知方式必填', trigger: 'change' }]"
            :prop="`notifyWay`">
            <a-checkbox :checked="notifyWayChecked('0')" @change="changeNotifyWay('0')">
              短信
            </a-checkbox>
            <a-checkbox :checked="notifyWayChecked('1')" @change="changeNotifyWay('1')">
              交建通
            </a-checkbox>
            <a-checkbox :checked="notifyWayChecked('4')" @change="changeNotifyWay('4')">
              企业微信
            </a-checkbox>
            <a-checkbox :checked="notifyWayChecked('3')" @change="changeNotifyWay('3')">
              邮件
            </a-checkbox>
            <a-checkbox :checked="notifyWayChecked('2')" @change="changeNotifyWay('2')">
              工单
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item
            label="时间设置"
            :rules="[{ required: true, message: '时间设置必选', trigger: 'change' }]"
            prop="alertTimeType">
            <a-radio-group v-model="formState.alertTimeType">
              <a-radio :value="'0'">任何时间</a-radio>
              <a-radio :value="'1'">工作时间</a-radio>
              <a-radio :value="'2'">非工作时间</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            label="延迟策略"
            :rules="[{ required: true,message: '延迟策略必选', trigger: 'change' }]"
            prop="delay">
            <a-select style="width: 200px" v-model="formState.delay" :options="delayOptions"/>
          </a-form-model-item>
          <a-form-model-item
            label="通知对象"
            style="display: flex;justify-content: space-between"
            :rules="[{required:true, validator: notifyAccountPass, trigger: 'change' }]"
            prop="notifyStaffType"
          >
            <a-select
              v-model="formState.notifyStaffType"
              style="width: 200px"
              :options="[
                {label:'通知组', value: '0'},
                {label:'通知人', value: '1'}
              ]"
            />
            <span>
              <a-select v-if="formState.notifyStaffType=== '1'" style="width: 200px" v-model="userId" :options="user" @change="clearV"/>
              <a-select v-else style="width: 200px" v-model="groupId" :options="group" @change="clearV"/>
            </span>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal
        title="修改通知策略"
        :visible="updateVisible"
        :confirm-loading="confirmLoading"
        width="50%"
        @ok="handleUpdate"
        @cancel="closeUpdateModal"
        @close="closeUpdateModal"
      >
        <a-form-model :model="updateFormState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-model-item
            label="告警状态"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <a-select style="width: 200px" v-model="updateFormState.alertStatusType" >
              <a-select-option :value="'1'">发生时</a-select-option>
              <a-select-option :value="'0'">关闭时</a-select-option>
              <a-select-option :value="'2'">任何情况</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="通知方式"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <a-select style="width: 200px" v-model="updateFormState.notifyWay">
              <a-select-option :value="'0'">短信</a-select-option>
              <a-select-option :value="'1'">交建通</a-select-option>
              <a-select-option :value="'2'">工单</a-select-option>
              <a-select-option :value="'3'">邮件</a-select-option>
              <a-select-option :value="'4'">企业微信</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="时间设置"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <a-select style="width: 200px" v-model="updateFormState.alertTimeType">
              <a-select-option :value="'0'">任何时间</a-select-option>
              <a-select-option :value="'1'">工作时间</a-select-option>
              <a-select-option :value="'2'">非工作时间</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="延迟策略"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <a-select style="width: 200px" v-model="updateFormState.delay" :options="delayOptions"/>
          </a-form-model-item>
          <a-form-model-item
            label="通知对象"
            style="display: flex;justify-content: space-between"
            :rules="[{ required: true, trigger: 'change' }]"
            prop="notifyStaffType"
          >
            <a-select
              v-model="updateFormState.notifyStaffType"
              style="width: 200px"
              :options="[
                {label:'通知组', value: '0'},
                {label:'通知人', value: '1'}
              ]"
            />
            <span>
              <a-select v-if="updateFormState.notifyStaffType=== '1'" style="width: 200px" v-model="userId" :options="user" />
              <a-select v-else style="width: 200px" v-model="groupId" :options="group" />
            </span>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-table
        style="margin-top: 10px"
        :columns="columns"
        :pagination="pagination"
        :data-source="data"
        :expanded-row-keys="expandedRowKeys"
        @expandedRowsChange="expandRowEvent"
        @expand="expandEvent"
      >
        <a slot="accountId" slot-scope="text,record">{{ record.staffName }}</a>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <span slot="rule" slot-scope="text,record"> {{ notifyRuleMapping(record) }} </span>
          <span slot="No" slot-scope="text,record,index"> {{ index+1 }} </span>
          <span slot="state" slot-scope="text,record"> {{ alertStatusTypeMapping(record.alertStatusType) }} </span>
          <span slot="gateway" slot-scope="text,record">
            <span v-for="(t,index) in record.notifyWay" :key="t"><a-divider v-if="index!==0" type="vertical"/>{{ notifyWayMapping(t) }}</span>
          </span>
          <span slot="operation" class="table-operation" slot-scope="text,record">
            <a-button @click="openUpdateModal(record)">修改</a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除此策略?"
              placement="left"
              @confirm="deleteSingleNotifyRule(record.id)"
              okText="提交"
              cancelText="取消"
            >
              <a-button>删除</a-button>
            </a-popconfirm>
          </span>
        </a-table>
        <template :slot="'action'" slot-scope="text,record">
          <span style="visibility: hidden">
            <a-button>修改</a-button>
            <a-divider type="vertical" />
          </span>
          <a-popconfirm
            title="确定要删除用户下所有策略?"
            placement="left"
            @confirm="deleteNotifyRule(record.accountId)"
            okText="提交"
            cancelText="取消"
          >
            <a-button>删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    <!--    <DetailSchema ref="schema" @close="onClose"></DetailSchema>-->
    </div>

    <!--    右边配置区域-->
    <div class="total-container">
      <div class="container">
        <div class="title">
          <span>工作时间</span>
          <span>
            <a-button v-if="watchFlag" type="primary" @click="()=>{this.watchFlag = false}">编辑</a-button>
            <a-button v-else primary @click="saveTimeUpdate">提交</a-button>
          </span>
        </div>
        <div class="content">
          <a-select :disabled="watchFlag" v-model="workTime.weekStart" style="width: 120px" :options="days"/>
          ～
          <a-select :disabled="watchFlag" v-model="workTime.weekEnd" style="width: 120px" :options="days"/>

        </div>
        <div class="content">
          <a-time-picker :disabled="watchFlag" v-model=" workTime.timeStart" style="width: 120px" format="HH:mm"/>
          ～
          <a-time-picker :disabled="watchFlag" v-model="workTime.timeEnd" style="width: 120px" format="HH:mm"/>
        </div>
      </div>
      <div class="sub-container">
        <div class="title">
          <span>通知模板</span>
          <a-popconfirm
            title="确定要前往模板配置页面？?"
            placement="left"
            @confirm="navigateToTemplate"
            okText="提交"
            cancelText="取消"
          >
            <a-button type="primary">前往配置</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
import { alarm } from '@/utils/request'
import _ from 'lodash'
import { ApSourceService } from '@/api/service/ApSourceService'
import { decrypt, encrypt } from '@/utils/aes'
import { judgeRoleToAlertView } from '@/utils/util'

const innerColumns = [
  { title: '序号', scopedSlots: { customRender: 'No' } },
  { title: '告警状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
  { title: '通知条件', dataIndex: 'rule', scopedSlots: { customRender: 'rule' } },
  { title: '通知方式', dataIndex: 'gateway', scopedSlots: { customRender: 'gateway' } },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    align: 'right',
    width: '200px',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const columns = [
  {
    title: '通知对象',
    align: 'left',
    width: '70%',
    dataIndex: 'accountId',
    scopedSlots: { customRender: 'accountId' }
  },
  {
    title: '操作',
    key: 'action',
    align: 'right',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]
const data = [
  {
    index: '1',
    accountId: '运维一组',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '北京pigoss001'
  }

]
const innerData = [
  {
    id: '',
    'accountId': 'jsHtO0h1lRqGoJxjYHeGBQ==',
    'alertStatusType': ['0', '1'],
    'notifyWay': ['0', '1', '2', '3'],
    'level': ['1', '2', '3'],
    'notifyStaffType': '0',
    'alertTimeType': '1',
    'delay': '0'
  }
]
const pagination = {
  pageSizeOptions: [ '5', '10', '20', '30' ],
  defaultCurrent: 1,
  pageSize: 10,
  defaultPageSize: 10,
  hideOnSinglePage: false,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
}
const originalFormState = {
  notifyStaffType: '0',
  alertTimeType: '0',
  alertStatusType: [],
  notifyWay: [],
  delay: '0'
}
const originalUpdateFormState = {
  notifyStaffType: '0',
  alertTimeType: '0',
  alertStatusType: '',
  notifyWay: '',
  delay: '0'
}
export default {
  name: 'NotifyRule',
  data () {
    return {
      innerColumns,
      innerData,
      groupId: '',
      userId: '',
      expandedRowKeys: [],
      group: [],
      user: [],
      updateFlag: false,
      watchFlag: true,
      colLayout: {
        xl: 8,
        md: 12,
        sm: 24
      },
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 8 }, xxl: { span: 4 } },
        wrapperCol: {
          xs: { span: 10, offset: 0 },
          md: { span: 14, offset: 0 },
          xl: { span: 14, offset: 2 },
          xxl: { span: 20, offset: 0 }
        }
      },
      data,
      columns,
      pagination,
      visible: false,
      confirmLoading: false,
      updateVisible: false,
      selectedRowKeys: [],
      updateFormState: {},
      title: '压缩告警详情',
      options: [
        { label: '或', value: '或' },
        { label: '且', value: '且' }
      ],
      delayOptions: [
        { label: '立刻', value: '0' },
        { label: '1分钟', value: '1' },
        { label: '2分钟', value: '2' },
        { label: '5分钟', value: '5' },
        { label: '10分钟', value: '10' },
        { label: '20分钟', value: '20' },
        { label: '30分钟', value: '30' }
      ],
      formState: _.cloneDeep(originalFormState),
      workTime: {
        id: '',
        weekStart: 1,
        weekEnd: 5,
        timeStart: moment('08：30', 'HH:mm'),
        timeEnd: moment('17：30 ', 'HH:mm')
      },
      days: [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周天', value: 7 }
      ],
      times: [

      ]
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
    clearV (value) {
      if (!value) {
        return
      }
      this.$refs.ruleForm.clearValidate('notifyStaffType')
    },
    notifyAccountPass (rule, value, callback) {
      const flag = value === '1' ? this.userId === '' : this.groupId === ''
      console.log(value)
      console.log(this.userId)
      console.log(this.groupId)
      console.log(flag)
      if (flag) {
        callback(new Error('必须选择通知对象！'))
      } else {
        callback()
      }
    },
    async saveTimeUpdate () {
      this.watchFlag = true
      const {
        timeStart
        , timeEnd
      } = this.workTime
      this.workTime.timeStart = timeStart.format('HH:mm')
      this.workTime.timeEnd = timeEnd.format('HH:mm')
      const res = await alarm.post('/api/configuration/worktime/update', this.workTime)
      if (res.code === 200) {
        this.$message.success('修改成功！')
      } else {
        this.$message.error(res.msg)
      }
      await this.fetchWorkTime()
    },
    alertStatusTypeMapping (content) {
      const mapping = ['发生时', '关闭时', '任何情况']
      if (content.includes('0')) {
        if (content.includes('1')) {
          return mapping[2]
        } else {
          return mapping[1]
        }
      } else if (content.includes('1')) {
        return mapping[0]
      }
    },
    notifyWayMapping (key) {
      const mapping = {
        '0': '短信',
        '1': '交建通',
        '2': '工单',
        '3': '邮件',
        '4': '企业微信'
      }
      return mapping[key]
    },
    async expandEvent (expanded, record) {
      this.innerData = []
      const { accountId } = record
      const { data } = await alarm.post('/api/configuration/notify/listWay', { accountId })
      this.innerData = data
    },
    expandRowEvent (expandedRowKeys) {
      if (this.expandedRowKeys.length < 1) {
        this.expandedRowKeys = expandedRowKeys
      } else {
        this.expandedRowKeys = expandedRowKeys.filter((x) => !this.expandedRowKeys.some((item) => x === item))
      }
    },
    notifyRuleMapping (record) {
      const timing = {
        '0': '任何时间',
        '1': '工作时间',
        '2': '非工作时间'
      }
      let d
      if (record.delay === '0') {
        d = '立刻'
      } else {
        d = '延迟' + record.delay + '分钟'
      }
      return timing[record.alertTimeType] + '/' + d
    },
    async fetchNotifyList () {
      this.expandedRowKeys = []
      const { data } = await alarm.get('/api/configuration/notify/list')
      this.data = data
    },
    async fetchWorkTime () {
      const { data } = await alarm.get('/api/configuration/worktime/find')
      const { weekStart, weekEnd, timeStart, timeEnd, id } = data
      this.workTime = {
        id,
        weekStart,
        weekEnd,
        timeStart: moment(timeStart, 'HH:mm'),
        timeEnd: moment(timeEnd, 'HH:mm')
      }
    },
    async fetchGroup () {
      const res = await ApSourceService.fetchGroupList()
      this.group = []
      res.forEach(r => {
        this.group.push(
          {
            label: r.name,
            value: r.id
          }
        )
      })
    },
    async fetchUser () {
      const res = await ApSourceService.fetchUserList()
      this.user = []
      res.forEach(r => {
        this.user.push(
          {
            label: r.staff_name,
            value: r.user_id
          }
        )
      })
    },
    changeAlertStatusType (data) {
      if (data === '2') {
        this.formState.alertStatusType = this.checkedAllStatus ? [] : ['0', '1']
      } else {
        this.isSelectedEntity(data, this.formState.alertStatusType)
      }
    },
    isSelectedEntity (data, arr) {
      const isin = arr.indexOf(data)
      if (isin === -1) {
        arr.push(data)
      } else {
        arr.splice(isin, 1)
      }
    },
    changeNotifyWay (data) {
      this.isSelectedEntity(data, this.formState.notifyWay)
    },
    openModal (record) {
      if (record) {
        this.formState = { ..._.cloneDeep(record) }
        this.formState.accountId = decrypt(this.formState.accountId)
        this.updateFlag = true
      }
      this.visible = true
    },
    openUpdateModal (record) {
      if (record) {
        this.updateFormState = { ..._.cloneDeep(record) }
        this.updateFormState.accountId = decrypt(this.updateFormState.accountId)
        this.groupId = this.updateFormState.notifyStaffType === '0' ? this.updateFormState.accountId : ''
        this.userId = this.updateFormState.notifyStaffType === '1' ? this.updateFormState.accountId : ''
        this.updateFlag = true
      }
      this.updateVisible = true
    },
    closeModal () {
      this.visible = false
      this.updateFlag = false
      this.groupId = ''
      this.userId = ''
      this.$refs.ruleForm.resetFields()
      this.formState = { ..._.cloneDeep(originalFormState) }
    },
    closeUpdateModal () {
      this.updateVisible = false
      this.groupId = ''
      this.userId = ''
      this.updateFormState = { ..._.cloneDeep(originalUpdateFormState) }
    },
    addRecord () {
      this.formState.mapping.push(
        {
          here: '1',
          there: 'L1',
          key: this.formState.mapping.length
        }
      )
      this.$forceUpdate()
    },
    async handleOk () {
      let flag = false
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.error('请检查您的表单项是否都填写完毕！')
          flag = true
        }
      })
      if (flag) {
        return
      }
      const backup = _.cloneDeep(this.formState)
      const url = '/api/configuration/notify/add'
      backup.accountId = encrypt(this.formState.notifyStaffType === '0' ? this.groupId : this.userId)
      backup.delay = backup.delay.toString()
      let res
      try {
        res = await alarm.post(url, { ...backup })
        if (res.code === 200) {
          this.$message.success('新建成功！')
          this.closeModal()
          await this.fetchNotifyList()
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    async handleUpdate () {
      const backup = _.cloneDeep(this.updateFormState)
      const url = '/api/configuration/notify/update'
      if (this.groupId === '' && this.userId === '') {
        backup.accountId = encrypt(this.updateFormState.accountId)
      } else {
        backup.accountId = encrypt(this.updateFormState.notifyStaffType === '0' ? this.groupId : this.userId)
      }
      backup.delay = backup.delay.toString()
      let res
      try {
        res = await alarm.post(url, { ...backup })
        if (res.code === 200) {
          this.$message.success('修改成功！')
          this.closeUpdateModal()
          await this.fetchNotifyList()
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error(e.response.data.msg)
      }
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    onChangeState (activeKey) {
      this.state = activeKey
    },
    async deleteNotifyRule (id) {
      let res
      try {
        res = await alarm.post('/api/configuration/notify/deleteAll', { 'accountId': id })
      } catch (e) {
        // res = {
        //   'code': 200,
        //   'msg': '删除成功！'
        // }
      }
      if (res.code === 200) {
        this.$message.success('删除成功！')
        await this.fetchNotifyList()
      } else {
        this.$message.error('删除失败！请检查您的网络')
      }
    },
    async deleteSingleNotifyRule (id) {
      let res
      try {
        res = await alarm.post('/api/configuration/notify/delete', { 'id': id })
      } catch (e) {
        // res = {
        //   'code': 200,
        //   'msg': '删除成功！'
        // }
      }
      if (res.code === 200) {
        this.$message.success('删除成功！')
        await this.fetchNotifyList()
      } else {
        this.$message.error('删除失败！请检查您的网络')
      }
    },
    query () {
      // TODO 查询
    },
    resetQueryParams () {
      // TODO 重置查询
    },
    // 认领告警
    claimAlarm (record) {
      console.log('认领', record)
    },
    // 关闭或批量关闭告警
    closeAlarm (record) {

    },
    showDetail () {
      this.$refs.schema.show('压缩告警详情')
      // TODO 交互详情内容
    },
    onClose () {
      console.log('关闭')
      this.visible = false
    },
    notifyWayChecked (value) {
      return this.formState.notifyWay.includes(value)
    },
    levelChecked (value) {
      return this.formState.level.includes(value)
    },
    statusChecked (value) {
      return this.formState.alertStatusType.includes(value)
    },
    async navigateToTemplate () {
      await this.$router.push({ name: 'notice-template' })
    }
  },
  computed: {
    checkedAllStatus () {
      const { alertStatusType } = this.formState
      return alertStatusType.includes('1') && alertStatusType.includes('0')
    },
    notAll () {
      return this.formState.alertStatusType.length !== 0 && !this.checkedAllStatus
    },
    indeterminate () {
      return this.formState.alertTimeType !== '' && this.formState.alertTimeType !== '0'
    },
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
    this.fetchNotifyList()
    this.fetchWorkTime()
    this.fetchUser()
    this.fetchGroup()
  },
  beforeCreate () {
    judgeRoleToAlertView()
  }
}
</script>

<style lang='less' scoped>
.notifyRulesBasic{
  display: grid;
  background: #edf0f4;
  grid-template-columns: auto 400px;
  grid-gap: 20px;
  height: 100%;
}
.circle{
  background: #208DFF;
  width: 50px;
  height: 50px;
  font-size: 24px;
  color: white;
  border-radius: 50%;
  grid-column: 1/2;
}
* {
  marigin: 0px;
  //background-color: #EFF3F7;
}

.header {
  //padding: 10px;
  width: 100%;
}

.left {
  float: left;
  width: 40%;
}
-
.wd {
  width: 100%;
}

.hg {
  height: 100%;
}

.form {
  margin-right: 10px;
  .fold {
    flex: 1;
    display: inline-block;
    width: calc(100% - 216px);
  }
  .collapse {
    float: right;
    overflow: hidden;
    transform: translateY(3.5px);
  }
}

.right {
  float: right;
  width: 75%;

  &_range_picker {
    width: 160px;
  }

  &_input {
    width: 120px;
  }
}

.center {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.container {
  background: white;
  margin-top: 20px;
}

.title {
  span {
    font-size: 14px;
    font-family: "PingFang SC";
    font-weight: bold;
  }
  display: flex;
  width: 367px;
  justify-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 380px;
  height: 10px;
  line-height: 10px;
}

.total-container {
  background: #FFFFFF;
  padding: 5px 10px;
}

.content {
  display: flex;
  justify-content: center;
  width: 367px;
  margin-top: 10px;
  div {
    display: block;
  }
}

.sub-container {
  margin-top: 20px;
  height: 60px;
  background: white;
  padding: 2px;
}

.in-title {
  margin: 0 auto;
  width: 95%;
  padding: 10px 24px;
  border-radius: 5px;
  background-color: rgba(229, 235, 243, 1);
}
</style>
