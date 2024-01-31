<template>
  <a-table
    :columns="columns"
    :locale="locale"
    :data-source="data"
    :row-key="(record) => record.id"
    :pagination="{
      pageSizeOptions: ['5', '10', '20', '30'],
      defaultCurrent: 1,
      pageSize: 10,
      defaultPageSize: 10,
      hideOnSinglePage: false,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
    }"
  >
    <template :slot="'autoClose'" slot-scope="text"> {{ text }}分钟 </template>
    <template :slot="'action'" slot-scope="text, record">
      <a-tooltip title="编辑">
        <a-icon style="color: #5b8ff9" @click="updateAlertSource(record)" type="edit" />
      </a-tooltip>
      <a-divider type="vertical" />
      <a-tooltip title="删除">
        <a-popconfirm
          title="确定要删除该数据源?"
          placement="left"
          @confirm="deleteAlertSource(record.sourceId)"
          okText="提交"
          cancelText="取消"
        >
          <a-icon style="color: #5b8ff9" type="delete" />
        </a-popconfirm>
      </a-tooltip>
    </template>
    <template :slot="'status'" slot-scope="text, record">
      <img v-show="record.sourceStatus" :src="require(`@/assets/icons/svg/successLight.svg`)" />
      <img v-show="!record.sourceStatus" :src="require(`@/assets/icons/svg/errorLight.svg`)" />
    </template>
    <template :slot="'autoClose'" slot-scope="text, record">
      {{ record.autoCloseInterval ? (record.autoClose ? record.autoCloseInterval + '分钟自动关闭' : '否') : '--' }}
    </template>
  </a-table>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
import { alarm } from '@/utils/request'

// type Key = string | number
//
// interface DataType {
//   id: Key
//   name: string
//   port: number
//   ip: string
//   status: boolean
//   autoClose: number
//   appKey: string
//   platform: string
//   ruleIds: Array<string>
// }

const columns = [
  {
    title: '状态',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    width: '100px',
    align: 'center'
  },
  {
    title: '告警源名称',
    key: 'name',
    dataIndex: 'sourceName',
    ellipsis: true,
    width: '100px',
    align: 'center'
  },
  {
    title: '告警源IP',
    key: 'ip',
    dataIndex: 'sourceIp',
    width: '100px',
    align: 'center'
  },
  {
    title: '告警源端口',
    key: 'port',
    dataIndex: 'sourcePort',
    width: '100px',
    align: 'center'
  },
  {
    title: '告警源平台',
    key: 'platform',
    dataIndex: 'platName',
    width: '100px',
    align: 'center'
  },
  {
    title: '所属用户组',
    key: 'appKey',
    dataIndex: 'groupName',
    width: '100px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '自动关闭',
    key: 'autoClose',
    dataIndex: 'autoClose',
    scopedSlots: { customRender: 'autoClose' },
    width: '100px',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
    width: '170px',
    align: 'center'
  }
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    id: i.toString(),
    sourceName: `Pigoss ${i}`,
    sourcePort: 3000,
    platType: 'pigoss',
    sourceIp: `192.168.1.${i}`,
    platform: 'pigoss',
    group: `运维${i}组`,
    autoClose: 30,
    sourceStatus: i % 2 === 0,
    ruleIds: []
  })
}
export default {
  name: 'RightTable',
  components: { SvgIcon },
  props: {
    platformId: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasSelected () {
      return this.state.selectedRowKeys.length > 0
    }
  },
  methods: {
    start () {
      this.state.loading = true
      const that = this
      setTimeout(() => {
        that.state.loading = false
        that.state.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.state.selectedRowKeys = selectedRowKeys
    },
    showDetail (id) {
      console.log(id)
    },
    async updateAlertSource (record) {
      let pp
      try {
        const { data } = await alarm.post('/api/integration/platform/find', { platformId: record.platformId })
        pp = data
        const res = await alarm.post('/api/integration/source/find', { sourceId: record.sourceId })
        pp.url = '/view_thumbnail' + pp.url
        await this.$router.push({
          name: 'UpdateAlertSource',
          query: { plat: pp, record: res.data.source }
        })
      } catch (e) {
        this.$message.error('请求失败！请检查网络连接！')
      }
    },
    async deleteAlertSource (id) {
      let res
      try {
        res = await alarm.post('/api/integration/source/delete', { sourceId: id })
      } catch (e) {
        // res = {
        //   'code': 200,
        //   'msg': '删除成功！'
        // }
      }
      if (res.code === 200) {
        this.$message.success('删除成功！')
        await this.initialData()
      } else {
        this.$message.error('删除失败！请检查您的网络')
      }
    },
    async initialData () {
      let res
      try {
        res = await alarm.post('/api/integration/source/list', {
          params: { platformId: this.platformId },
          paging: { limit: 10, offset: 0 }
        })
      } catch (e) {
        console.log(e)
        res = {
          code: 200,
          msg: 'success',
          data: {
            total: 0,
            value: []
          }
        }
      }
      this.data = res.data.value
    }
  },
  watch: {
    platformId: {
      handler (e) {
        this.initialData()
      }
    }
  },
  data () {
    return {
      data,
      columns,
      locale: {
        emptyText: <a-empty> </a-empty>
      },
      state: {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false
      }
    }
  },
  mounted () {
    this.initialData()
  }
}
</script>

<style scoped></style>
