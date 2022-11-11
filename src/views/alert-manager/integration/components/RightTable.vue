<template>
  <a-table
    :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
    :columns="columns"
    :data-source="data"
    :row-key="(record) => record.id"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'detail'">
        <a>查看详情</a>
      </template>
      <template v-if="column.key === 'autoClose'"> {{ text }}分钟 </template>
      <template v-if="column.key === 'action'">
        <SvgIcon
          name="svg-编辑"
          width="20px"
          height="20px"
          style="margin-bottom: -5px"
          title="编辑应用"
        />
        <a-divider type="vertical" />
        <a-switch :checked="text.status" size="small" />
        <a-divider type="vertical" />
        <SvgIcon
          name="svg-删除"
          width="20px"
          height="20px"
          style="margin-bottom: -5px"
          title="删除应用"
        />
      </template>
      <template v-if="column.key === 'status'">
        <SvgIcon v-show="text.status" name="svg-绿@1.5x" />
        <SvgIcon v-show="!text.status" name="svg-红@1.5x" />
      </template>
    </template>
  </a-table>
</template>

<script>

import SvgIcon from '@/components/SvgIcon/index.vue'
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
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '30px',
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    width: '30px',
    align: 'center'
  },
  {
    title: '告警源名称',
    key: 'name',
    dataIndex: 'name',
    ellipsis: true,
    width: '50px',
    align: 'center'
  },
  {
    title: '告警源IP',
    key: 'ip',
    dataIndex: 'ip',
    width: '60px',
    align: 'center'
  },
  {
    title: '告警源端口',
    key: 'port',
    dataIndex: 'port',
    width: '48px',
    align: 'center'
  },
  {
    title: '告警源平台',
    key: 'platform',
    dataIndex: 'platform',
    width: '50px',
    align: 'center'
  },
  {
    title: 'AppKey',
    key: 'appKey',
    dataIndex: 'appKey',
    width: '150px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '自动关闭',
    key: 'autoClose',
    dataIndex: 'autoClose',
    width: '40px',
    align: 'center'
  },
  {
    title: '关联信息',
    key: 'detail',
    width: '40px',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: '80px',
    align: 'center'
  }
]

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    id: i,
    name: `Pigoss ${i}`,
    port: 3000,
    ip: `192.168.1.${i}`,
    platform: 'pigoss',
    appKey: '951ffcf82a2342c09571f567e2fd47a6',
    autoClose: 30,
    status: i % 2 === 0,
    ruleIds: []
  })
}
export default {
  name: 'RightTable',
  components: { SvgIcon },
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
    }
  },
  data () {
    return {
      data,
      columns,
      state: {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false
      }
    }
  }
}
</script>

<style scoped></style>
