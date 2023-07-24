<template>
  <div class="wrapper">
    <div>
      <a-form>
        <a-row type="flex" justify="left">

          <a-col
            :span="6"
          >
            <a-form-item >
              状态：
              <a-select
                :style="{width:'60%'}"
                v-decorator="[
                  `level` ]"
                placeholder="用户状态"
              >
                <a-select-option value="1">开启</a-select-option>
                <a-select-option value="2">关闭</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="6"
          >
            <a-form-item >
              创建时间：
              <a-range-picker
                :style="{width:'60%'}"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间', '结束时间']"
                v-decorator="[
                  `level` ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :style="{ textAlign: 'left' }">
            <a-button type="primary" @click="()=>handleSearch()">
              <a-icon type="search" />查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              <a-icon type="sync" />重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div style="margin-bottom: 1%">
      <a-button type="primary" @click="onAdd"><a-icon type="plus" />新建</a-button>
      <a-button @click="open" style="margin-left: 10px"><a-icon type="column-height" />展开</a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :data-source="data"
        :expandIcon="expandIcon"
        expandedRowsChange
        :expandedRowKeys="expandedRowKeys"
        @expand="expand"
        class="components-table-demo-nested">
        <template #operation="text, record">
          <a class="operator" @click="onAdd(text, record)"><a-icon type="plus"></a-icon>新增</a>
          <a class="operator" @click="onEdit(text, record)"><a-icon type="edit"></a-icon>编辑</a>
          <a class="operator" @click="onDelete(text, record)"><a-icon type="delete"></a-icon>删除</a>
        </template>
        <template #expandedRowRender="text">
          <a-table
            :columns="columns"
            :data-source="innerData"
            :pagination="false"
            :defaultExpandAllRows="spread"
          >
            <span slot="status"> <a-badge status="success" />Finished </span>
            <template #operation="text, record">
              <a class="operator" @click="onAdd(text, record)"><a-icon type="plus"></a-icon>新增</a>
              <a class="operator" @click="onEdit(text, record)"><a-icon type="edit"></a-icon>编辑</a>
              <a class="operator" @click="onDelete(text, record)"><a-icon type="delete"></a-icon>删除</a>
            </template>
          </a-table>
        </template>
      </a-table>
      <schema ref="schema"></schema>
    </div>
  </div>
</template>

<script>
import { removeArrayValue } from '@/utils/util'
import schema from '@/views/system/apartment/modules/schema'

const columns = [
  { title: '部门名称', dataIndex: 'name', key: 'name' },
  { title: '负责人', dataIndex: 'platform', key: 'platform' },
  { title: '排序', dataIndex: 'version', key: 'version' },
  { title: '状态', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
]

const data = []
for (let i = 0; i < 3; ++i) {
  data.push({
    key: i,
    name: 'Screem',
    platform: 'iOS',
    version: '10.3.4.5654',
    upgradeNum: 500,
    creator: 'Jack',
    createdAt: '2014-12-24 23:12:00'
  })
}

const innerColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state', scopedSlots: { customRender: 'status' } },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const innerData = []
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    date: '2014-12-24 23:12:00',
    name: 'This is production name',
    upgradeNum: 'Upgraded: 56'
  })
}

export default {
  name: 'Index',
  data () {
    return {
      data,
      columns,
      innerColumns,
      innerData,
      spread: true,
      expandedRowKeys: []
    }
  },
  components: { schema },
  methods: {
    handleSearch () {},
    handleReset () {},
    onAdd (text, record) {
      console.log(text, record, this.$refs.schema)
      this.$refs.schema.add()
    },
    onEdit (text, record) {
      console.log(text, record)
      this.$refs.schema.edit()
    },
    onDelete (text, record) {
      console.log(text, record)
    },
    open () {
      if (this.spread) {
        this.expandedRowKeys = innerData.map(el => el.key)
      } else {
        this.expandedRowKeys = []
      }
      this.spread = !this.spread
    },
    expandIcon (props) {
      if (props.expanded) {
        return (
          <span
            class="table-icon"
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            <a-icon type="down" class="icon"/>
          </span>
        )
      } else {
        return (
          <span
            class="table-icon"
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            <a-icon type="right" class="icon"/>
          </span>
        )
      }
    },
    expand (expand, record) {
      console.log('expand', expand, record)
      if (expand) {
        this.expandedRowKeys.push(record.key)
      } else {
        removeArrayValue(this.expandedRowKeys, record.key)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .icon:hover {
    transform: scale(1.2);
    transition: transform .3s;
    color: rgba(0, 0, 255, 0.98);
  }

  .operator {
    padding: 0 5px;
  }
</style>
