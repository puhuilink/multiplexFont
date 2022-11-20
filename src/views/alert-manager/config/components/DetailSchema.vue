<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="820"
    :afterClose="reset"
    centered>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
    </template>
    <a-table :columns="columns" :data-source="data" bordered>
      <template slot="title">
        <table width="100%">
          <tr align="center">
            <th >主告警</th>
          </tr>
          <hr/>
          <tr>
            <td>
              <a-row type="flex" justify="space-between">
                <a-col :span="8">
                  告警对象：192.168.2.4
                </a-col>
                <a-col :span="8">
                  告警标题：内存利用率 > 60%
                </a-col>
                <a-col :span="8">
                  告警级别：P1
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between">
                <a-col :span="8">
                  告警编号：10209766
                </a-col>
                <a-col :span="8">
                  告警发生时间：08-18 10:16
                </a-col>
                <a-col :span="8">
                  告警源：Pigoss-001
                </a-col>
              </a-row>
            </td>
          </tr>
          <hr/>
          <tr align="center">
            <th >压缩告警</th>
          </tr>
        </table>
      </template>
    </a-table>
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
  name: 'DetailSchema',
  data () {
    return {
      data,
      columns
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
    }
  }
}
</script>

<style lang="less"scoped>
.gird {

}
</style>
