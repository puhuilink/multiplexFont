<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="1680"
    :afterClose="reset"
    centered>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
    </template>
    <a-row :gutter="8">
      <a-col span="6">
        <a-collapse v-model="activeKey">
          <a-collapse-panel key="1" header="分组1">
            <a-form-model :model="form">
              <a-form-model-item label="选择值班组">
                <a-input v-model="form.name" />
              </a-form-model-item>
              <a-checkbox @change="onChange">
                设置轮询时间
              </a-checkbox>
              <a-form-model-item label="设置排班日期和值班人">
                <a-select v-model="form.region" placeholder="选择值班人">
                  <a-select-option value="shanghai">
                    Zone one
                  </a-select-option>
                  <a-select-option value="beijing">
                    Zone two
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="Activity time">
                <a-date-picker
                  v-model="form.date1"
                  show-time
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%;"
                />
              </a-form-model-item>
              <a-form-model-item label="设置开始时间">
                <a-date-picker
                  v-model="form.date1"
                  show-time
                  type="date"
                  placeholder="请选择开始时间"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-form-model>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="分组2" :disabled="false">
            <p>{{ text }}</p>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="分组3" disabled>
            <p>{{ text }}</p>
          </a-collapse-panel>
        </a-collapse>
        <a-button type="primary" style="margin-left: 35%; margin-top: 5%">添加分组</a-button>
      </a-col>
      <a-col span="18">
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
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park'
  }
]
export default {
  name: 'Schema',
  data () {
    return {
      data,
      columns,
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1'],
      labelCol: { span: 8 },
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
  methods: {
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
    }
  }
}
</script>

<style lang="less"scoped>
</style>
