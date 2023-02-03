<template>
  <a-modal
    @cancel="cancel"
    :title="title"
    :visible="visible"
    :width="1160"
    :afterClose="reset"
    :destroyOnClose="true"
    centered>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
    </template>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :loading="loading"
      :pagination="{
        current: this.current,
        pageSize: 10,
        total: this.total,
        showTotal: (total,[start, end])=> `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onChange:(page) =>{
          this.current = page
          handleSearch(page, pageSize)
        },
      }">
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
                  告警对象：{{ main.device }}
                </a-col>
                <a-col :span="8">
                  告警标题：{{ main.title }}
                </a-col>
                <a-col :span="8">
                  告警级别：P{{ main.level }}
                </a-col>
              </a-row>
              <a-row type="flex" justify="space-between">
                <a-col :span="8">
                  告警编号：{{ main.event_id }}
                </a-col>
                <a-col :span="8">
                  告警发生时间：{{ main.last_time }}
                </a-col>
                <a-col :span="8">
                  告警源：{{ main.source_name }}
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
import { alarm } from '@/utils/request'
import moment from 'moment'
const columns = [
  {
    title: '级别',
    dataIndex: 'level',
    customRender: (text) => `P${text}`
  },
  {
    title: '告警编号',
    dataIndex: 'ID'
  },
  {
    title: '告警标题',
    dataIndex: 'title'
  },
  {
    title: '告警对象',
    dataIndex: 'device'
  },
  {
    title: '发生时间',
    dataIndex: 'start_time',
    customRender: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'last_time',
    customRender: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '告警详情',
    dataIndex: 'content'
  },
  {
    title: '告警源',
    dataIndex: 'source_name'
  }
]

const data = []
export default {
  name: 'DetailSchema',
  data () {
    return {
      data,
      columns,
      main: {},
      total: 1,
      current: 1,
      loading: false
    }
  },
  mixins: [Schema],
  methods: {
    handleCancel () {
      this.visible = false
    },
    show (title, text) {
      this.main = text
      this.visible = true
      this.title = title
      this.loadData()
    },
    async loadData (limit = 10, offset = 1) {
      this.loading = true
      const { data, page } = await alarm.post('/platform/alert/sub/list',
        { master_id: this.main.ID,
          limit: limit,
          offset: offset }
      )
      this.dataSource = data
      this.total = page.total
      this.loading = false
    },
    handleSearch (page, size) {
      this.loadData(10, page)
    }
  }
}
</script>

<style lang="less"scoped>
</style>
