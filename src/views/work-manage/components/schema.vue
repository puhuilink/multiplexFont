<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="1500"
    :afterClose="reset"
    okText="提交"
    @ok="submit"
    centered>
    <template slot="footer">
      <a-button type="primary">提交</a-button>
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
    </template>
    <a-row :gutter="8">
      <a-col span="8">
        <a-input placeholder="请输入排班名称"></a-input>
        <a-divider />
        <a-collapse v-model="activeKey">
          <a-collapse-panel key="1" header="设置排班时间＆排版人">
            <div
              v-for="(item, index) in plan"
              :key="index"
            >
              从<a-time-picker :default-open-value="moment('00:00', 'HH:mm')" style="width: 20%;margin-left: 2%;"></a-time-picker>   到<a-time-picker :default-open-value="moment('00:00', 'HH:mm')" style="width: 20%;margin-left: 2%;"></a-time-picker>
              <a-select placeholder="请选择值班人" style="width: 20%;margin-left: 2%;"><a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option></a-select> <a-icon @click="deleteItem(index)" type="delete" v-if="index!==0"/><a-divider type="vertical" v-if="index!==0"/><a-icon type="plus" @click="addItem"/>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="设置生效开始时间" :disabled="false">
            <a-date-picker /> <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')"/>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
      <a-col span="16">
        <a-calendar>
          <ul slot="dateCellRender" slot-scope="value" class="events">
            <li v-for="item in getListData(value)" :key="item.content">
              <a-badge :status="item.type" :text="item.content" />
            </li>
          </ul>
          <template slot="monthCellRender" slot-scope="value">
            <div v-if="getMonthData(value)" class="notes-month">
              <section>{{ getMonthData(value) }}</section>
              <span>Backlog number</span>
            </div>
          </template>
        </a-calendar>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import moment from 'moment'
import singleDate from '@/views/work-manage/components/singleDate'
import _ from 'lodash'
export default {
  name: 'Schema',
  data () {
    return {
      activeKey: ['1', '2'],
      labelCol: { span: 8 },
      plan: ['0'],
      wrapperCol: { span: 8 },
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mixins: [Schema],
  components: {
    singleDate
  },
  methods: {
    moment,
    handleCancel () {
      this.visible = false
    },
    show (title) {
      this.visible = true
      this.title = title
    },
    getListData (value) {
      let listData
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        case 10:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        case 15:
          listData = [
            { type: 'warning', content: '张三' },
            { type: 'success', content: '张三' }
          ]
          break
        default:
      }
      return listData || []
    },

    getMonthData (value) {
      if (value.month() === 8) {
        return 1394
      }
    },
    submit () {
      // TODO 提交表单
    },
    addItem () {
      this.plan.push('1')
    },
    deleteItem (index) {
      this.plan.splice(index, 1)
    }
  }
}
</script>

<style lang="less"scoped>
</style>
