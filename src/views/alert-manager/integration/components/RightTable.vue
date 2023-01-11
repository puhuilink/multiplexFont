<template>
  <a-table
    :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
    :columns="columns"
    :data-source="data"
    :row-key="(record) => record.id"
  >
    <template :slot="'detail'" slot-scope="text,record">
      <a @click="showDetail(record.id)">查看详情</a>
    </template>
    <template :slot="'autoClose'" slot-scope="text"> {{ text }}分钟 </template>
    <template :slot="'action'" slot-scope="text,record">
      <img
        :src="require(`@/assets/icons/svg/edit_icon.svg`)"
        width="20px"
        height="20px"
        title="编辑应用"
      />
      <a-divider type="vertical" />
      <a-switch :checked="record.status" size="small" />
      <a-divider type="vertical" />
      <img
        :src="require(`@/assets/icons/svg/delete_icon.svg`)"
        width="20px"
        height="20px"
        title="删除应用"
      />
    </template>
    <template :slot="'status'" slot-scope="text, record">
      <img v-show="record.status" :src="require(`@/assets/icons/svg/successLight.svg`)" />
      <img v-show="!record.status" :src="require(`@/assets/icons/svg/errorLight.svg`)" />
    </template>
  </a-table>
</template>

<script>

import SvgIcon from '@/components/SvgIcon/index.vue'
import axios from 'axios'

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
    scopedSlots: { customRender: 'status' },
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
    scopedSlots: { customRender: 'detail' },
    width: '40px',
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
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
    },
    showDetail (id) {
      axios.get('http://127.0.0.1:3000/mock/11/knowledge/query/getAllRelationRule')
      console.log(id)
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
