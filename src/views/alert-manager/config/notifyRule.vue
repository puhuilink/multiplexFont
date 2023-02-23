<template>
  <div class="notifyRulesBasic">
    <div class="unionAlarm" style="background: white">
      <div style="display: flex;flex-direction: row-reverse;margin-top: 10px;margin-right: 10px"><a-button icon="plus" type="primary" @click="()=>openModal()">新建通知策略</a-button></div>
      <a-modal
        title="新建通知策略"
        :visible="visible"
        :confirm-loading="confirmLoading"
        width="50%"
        @ok="handleOk"
        @cancel="closeModal"
        @close="closeModal"
      >
        <a-form-model :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-model-item label="告警状态">
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
          <a-form-model-item label="告警级别">
            <a-checkbox :checked="levelChecked('1')" @change="changeLevel('1')">
              P1
            </a-checkbox>
            <a-checkbox :checked="levelChecked('2')" @change="changeLevel('2')">
              P2
            </a-checkbox>
            <a-checkbox :checked="levelChecked('3')" @change="changeLevel('3')">
              P3
            </a-checkbox>
            <a-checkbox :checked="levelChecked('4')" @change="changeLevel('4')">
              P4
            </a-checkbox>
            <a-checkbox :checked="levelChecked('5')" @change="changeLevel('5')">
              P5
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="通知方式">
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
          <a-form-model-item label="时间设置">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAllTime" @change="changeAlertTimeType('0')">
              任何时间
            </a-checkbox>
            <a-checkbox :checked="checkWorkTime" @change="changeAlertTimeType('1')">
              工作时间
            </a-checkbox>
            <a-checkbox :checked="checkUnWorkTime" @change="changeAlertTimeType('2')">
              非工作时间
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="延迟策略">
            <a-select style="width: 200px" v-model="formState.delay" :options="delayOptions"/>
          </a-form-model-item>
          <a-form-model-item label="通知对象" style="display: flex;justify-content: space-between">
            <a-select
              v-model="formState.notifyStaffType"
              style="width: 200px"
              :options="[
                {label:'通知组', value: '0'},
                {label:'通知人', value: '1'}
              ]"
            />
            <span>
              <a-select v-if="formState.notifyStaffType=== '1'" style="width: 200px" v-model="formState.userId" :options="user"/>
              <a-select v-else style="width: 200px" v-model="formState.groupId" :options="group"/>
            </span>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-table
        style="margin-top: 10px"
        :columns="columns"
        :pagination="pagination"
        :data-source="data">
        <a slot="accountId" slot-scope="text,record">{{ record.staffName }}</a>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <span slot="rule" slot-scope="text,record"> {{ notifyRuleMapping(record) }} </span>
          <span slot="state" slot-scope="text,record"> {{ alertStatusTypeMapping(record.alertStatusType) }} </span>
          <span slot="gateway" slot-scope="text,record">
            <span v-for="(t,index) in record.notifyWay" :key="t"><a-divider v-if="index!==0" type="vertical"/>{{ notifyWayMapping(t) }}</span>
          </span>
          <span slot="operation" class="table-operation" slot-scope="text,record">
            <img
              :src="require(`@/assets/icons/svg/edit_icon.svg`)"
              width="20px"
              height="20px"
              title="编辑应用"
              @click="openModal(record)"
            />
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除用户下所有策略?"
              placement="left"
              @confirm="deleteNotifyRule(record.accountId)"
              okText="确定"
              cancelText="取消"
            >
              <img
                :src="require(`@/assets/icons/svg/delete_icon.svg`)"
                width="20px"
                height="20px"
                title="删除应用"
              />
            </a-popconfirm>
          </span>
        </a-table>
        <template :slot="'action'" slot-scope="text,record">
          <a-popconfirm
            title="确定要删除此策略?"
            placement="left"
            @confirm="deleteSingleNotifyRule(record.id)"
            okText="确定"
            cancelText="取消"
          >
            <img
              :src="require(`@/assets/icons/svg/delete_icon.svg`)"
              width="20px"
              height="20px"
              title="删除应用"
            />
          </a-popconfirm>
        </template>
      </a-table>
    <!--    <DetailSchema ref="schema" @close="onClose"></DetailSchema>-->
    </div>
    <div >
      <div style="height: 120px;background: white;border-radius: 2px;">
        <div style="display:flex;justify-content: space-between;width: 400px;padding: 10px">
          <div style="font-size: 18px">工作时间</div>
          <span>
            <a-button v-if="watchFlag" style="background: #58bb72;color: white" @click="()=>{this.watchFlag = false}">编辑</a-button>
            <a-button v-else pirmary @click="saveTimeUpdate">保存</a-button>
          </span>
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 10px">
          <div>
            <a-select :disabled="watchFlag" v-model="workTime.weekStart" style="width: 80px" :options="days"/>
            ～
            <a-select :disabled="watchFlag" v-model="workTime.weekEnd" style="width: 80px" :options="days"/>
          </div>
          <div>
            <a-time-picker :disabled="watchFlag" v-model=" workTime.timeStart" style="width: 90px" format="HH:mm"/>
            ～
            <a-time-picker :disabled="watchFlag" v-model="workTime.timeEnd" style="width: 90px" format="HH:mm"/>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;height: 60px;background: white;border-radius: 2px; padding: 2px">
        <div style="display:flex;justify-content: space-between;align-items: center;width: 400px;padding: 10px">
          <div style="font-size: 18px">通知模板</div>  <a-popconfirm
            title="确定要前往模板配置页面？?"
            placement="left"
            @confirm="navigateToTemplate"
            okText="确定"
            cancelText="取消"
          >
            <a-button style="background: #58bb72;color: white">前往配置</a-button>
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
const innerColumns = [
  { title: '告警状态', dataIndex: 'state', scopedSlots: { customRender: 'state' } },
  { title: '通知条件', dataIndex: 'rule', scopedSlots: { customRender: 'rule' } },
  { title: '通知方式', dataIndex: 'gateway', scopedSlots: { customRender: 'gateway' } },
  {
    title: '操作',
    dataIndex: 'operation',
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
    align: 'center',
    width: '150px',
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
  pageSizeOptions: ['25', '30', '50', '100'],
  defaultCurrent: 1,
  pageSize: 25,
  defaultPageSize: 25,
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
  delay: 0,
  level: []
}
export default {
  name: 'NotifyRule',
  data () {
    return {
      innerColumns,
      innerData,
      groupId: '',
      userId: '',
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
      selectedRowKeys: [],
      title: '压缩告警详情',
      options: [
        { label: '或', value: '或' },
        { label: '且', value: '且' }
      ],
      delayOptions: [
        { label: '立刻', value: 0 },
        { label: '1分钟', value: 1 },
        { label: '2分钟', value: 2 },
        { label: '5分钟', value: 5 },
        { label: '10分钟', value: 10 },
        { label: '20分钟', value: 20 },
        { label: '30分钟', value: 30 }
      ],
      formState: _.cloneDeep(originalFormState),
      workTime: {
        weekStart: '1',
        weekEnd: '5',
        timeStart: moment('08：30', 'HH:mm'),
        timeEnd: moment('17：30 ', 'HH:mm')
      },
      days: [
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周天', value: '7' }
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
          return mapping[0]
        }
      } else if (content.includes('1')) {
        return mapping[1]
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
    notifyRuleMapping (record) {
      const timing = {
        '0': '任何时间',
        '1': '工作时间',
        '2': '非工作时间'
      }
      const levels = {
        '1': 'P1',
        '2': 'P2',
        '3': 'P3',
        '4': 'P4',
        '5': 'P5'
      }
      let l = ''
      record.level.forEach((ll, index) => {
        if (index === 0) {
          l += levels[ll]
        } else {
          l += '、' + levels[ll]
        }
      })
      let d
      if (record.delay === '0') {
        d = '立刻'
      } else {
        d = '延迟' + record.delay + '分钟'
      }
      return timing[record.alertTimeType] + '/' + l + '/' + d
    },
    async fetchNotifyList () {
      const { data } = await alarm.get('/api/configuration/notify/list')
      this.data = data
    },
    async fetchWorkTime () {
      const { data } = await alarm.get('/api/configuration/worktime/find')
      const { weekStart, weekEnd, timeStart, timeEnd } = data
      this.workTime = {
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
    changeAlertTimeType (data) {
      if (this.formState.alertTimeType === data) {
        this.formState.alertTimeType = ''
      } else {
        this.formState.alertTimeType = data
      }
    },
    changeAlertStatusType (data) {
      if (data === '2') {
        this.formState.alertStatusType = this.checkedAllStatus ? [] : ['0', '1']
      } else {
        this.isSelectedEntity(data, this.formState.alertStatusType)
      }
    },
    changeLevel (data) {
      this.isSelectedEntity(data, this.formState.level)
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
    closeModal () {
      console.log(this.formState)
      this.visible = false
      this.updateFlag = false
      this.groupId = ''
      this.userId = ''
      this.formState = { ..._.cloneDeep(originalFormState) }
    },
    addRecord () {
      this.formState.mapping.push(
        {
          here: 'p1',
          there: '1',
          key: this.formState.mapping.length
        }
      )
      this.$forceUpdate()
    },
    async handleOk () {
      if (this.formState.alertTimeType === '') {
        this.$message.warn('请选择告警时间！')
        return
      }
      let url
      const backup = _.cloneDeep(this.formState)
      if (this.updateFlag) {
        url = '/api/configuration/notify/update'
        if (this.groupId === '' && this.userId === '') {
          backup.accountId = encrypt(this.formState.accountId)
        } else {
          backup.accountId = encrypt(this.formState.notifyStaffType === '0' ? this.groupId : this.userId)
        }
      } else {
        url = '/api/configuration/notify/add'
        backup.accountId = encrypt(this.formState.notifyStaffType === '0' ? this.groupId : this.userId)
      }
      backup.delay = backup.delay.toString()
      const res = await alarm.post(url, { ...backup })
      if (res.code === 200) {
        this.$message.success('新建成功！')
        this.closeModal()
        await this.fetchNotifyList()
      } else {
        this.$message.error(res.msg)
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
        const r = await alarm.post('/api/configuration/notify/deleteAll', { 'accountId': id })
        res = r
      } catch (e) {
        res = {
          'code': 200,
          'msg': '删除成功！'
        }
      }
      if (res.code === 200) {
        this.$message.success('删除成功！')
      } else {
        this.$message.error('删除失败！请检查您的网络')
      }
    },
    async deleteSingleNotifyRule (id) {
      let res
      try {
        const r = await alarm.post('/api/configuration/notify/delete', { 'id': id })
        res = r
      } catch (e) {
        res = {
          'code': 200,
          'msg': '删除成功！'
        }
      }
      if (res.code === 200) {
        this.$message.success('删除成功！')
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
    checkAllTime () {
      return this.formState.alertTimeType === '0'
    },
    checkWorkTime () {
      return this.formState.alertTimeType === '0' || this.formState.alertTimeType === '1'
    },
    checkUnWorkTime () {
      return this.formState.alertTimeType === '0' || this.formState.alertTimeType === '2'
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
  }
}
</script>

<style lang='less' scoped>
.notifyRulesBasic{
  display: grid;
  background: #edf0f4;
  grid-template-columns: auto 400px;
  grid-gap: 30px;
  height: 100%;
  padding: 3px;
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
</style>
