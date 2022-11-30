<template>
  <div style="display: flex;background: #edf0f4">
    <div class="unionAlarm" style="background: white">
      <div style="display: flex;flex-direction: row-reverse"><a-button icon="plus" type="primary" @click="openModal">新建通知策略</a-button></div>
      <a-modal
        title="新建通知策略"
        :visible="visible"
        :confirm-loading="confirmLoading"
        width="50%"
        @ok="handleOk"
        @cancel="closeModal"
      >
        <a-form-model :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-form-model-item label="告警状态">
            <a-input v-model="formState.name" />
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
            <a-checkbox @change="onChange">
              关闭时
            </a-checkbox>
            <a-checkbox @change="onChange">
              全选
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="告警级别">
            <a-checkbox @change="onChange">
              P1
            </a-checkbox>
            <a-checkbox @change="onChange">
              P2
            </a-checkbox>
            <a-checkbox @change="onChange">
              P3
            </a-checkbox>
            <a-checkbox @change="onChange">
              P4
            </a-checkbox>
            <a-checkbox @change="onChange">
              P5
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="通知方式">
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
            <a-checkbox @change="onChange">
              发生时
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="时间设置">
            <a-checkbox @change="onChange">
              任何时间
            </a-checkbox>
            <a-checkbox @change="onChange">
              工作时间
            </a-checkbox>
            <a-checkbox @change="onChange">
              非工作时间
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="延迟策略">
            <a-select v-model="formState.name" />
          </a-form-model-item>
          <a-form-model-item label="通知对象" style="display: flex;justify-content: space-between">
            <a-select v-model="formState.name" style="width: 35%"/><a-select style="width: 35%" v-model="formState.name" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-table
        bordered
        :columns="columns"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <a-table
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        >
          <span slot="status"> <a-badge status="success" />Finished </span>
          <span slot="operation" class="table-operation">
          </span>
        </a-table>
        <template :slot="'action'" slot-scope="text,record">
          <img
            :src="require(`@/assets/icons/svg/编辑.svg`)"
            width="20px"
            height="20px"
            title="编辑应用"
          />
          <a-divider type="vertical" />
          <a-switch :checked="record.status" size="small" />
          <a-divider type="vertical" />
          <img
            :src="require(`@/assets/icons/svg/删除.svg`)"
            width="20px"
            height="20px"
            title="删除应用"
          />
        </template>
      </a-table>
    <!--    <DetailSchema ref="schema" @close="onClose"></DetailSchema>-->
    </div>
    <div style="margin-left: 10px">
      <div style="height: 80px;background: white;border-radius: 2px;">
        <div style="display:flex;justify-content: space-between;width: 300px">
          <div style="font-size: 18px">工作时间</div> <a-button style="background: #58bb72;color: white">编辑</a-button>
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 10px">
          <div>
            <a-select v-model="a" style="width: 65px"/>～<a-select v-model="a" style="width: 65px"/>
          </div>
          <div>
            <a-select v-model="a" style="width: 65px"/>～<a-select v-model="a" style="width: 65px"/></div>
        </div>
      </div>
      <div style="margin-top: 20px;height: 35px;background: white;border-radius: 2px;">
        <div style="display:flex;justify-content: space-between;align-items: center;width: 300px">
          <div style="font-size: 18px">通知模板</div> <a-button style="background: #58bb72;color: white">前往配置</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
const innerColumns = [
  { title: '序号', dataIndex: 'date', key: 'date' },
  { title: '状态', dataIndex: 'name', key: 'name' },
  { title: '告警状态', key: 'state', scopedSlots: { customRender: 'status' } },
  { title: '通知条件', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: '通知方式', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const columns = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'index',
    width: '100px'
  },
  {
    title: '通知对象',
    align: 'center',
    width: '400px',
    dataIndex: 'name'
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
    name: '分派策略001',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '北京pigoss001'
  },
  {
    index: '2',
    name: '分派策略002',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '厦门pigoss001'
  },
  {
    index: '3',
    name: '分派策略003',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '北京pigoss002'
  },
  {
    index: '4',
    name: '分派策略004',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '厦门共济-01 '
  },
  {
    index: '5',
    name: '分派策略005',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '智慧云'
  }

]
const innerData = [
  {
    index: '1',
    name: '分派策略001',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '北京pigoss001'
  },
  {
    index: '2',
    name: '分派策略002',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '厦门pigoss001'
  },
  {
    index: '3',
    name: '分派策略003',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '北京pigoss002'
  },
  {
    index: '4',
    name: '分派策略004',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '厦门共济-01 '
  },
  {
    index: '5',
    name: '分派策略005',
    notify: '分派人  ：user01    升级给：admin',
    levelUp: true,
    dataSource: '智慧云'
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
export default {
  name: 'DeliverRules',
  data () {
    return {
      innerColumns,
      innerData,
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
      a: 0,
      visible: false,
      confirmLoading: false,
      selectedRowKeys: [],
      title: '压缩告警详情',
      options: [
        { label: '或', value: '或' },
        { label: '且', value: '且' }
      ],
      formState: {
        name: '',
        strategy: [
          {
            relation: '且',
            rules: [
              {
                column: '',
                tiaojian: '',
                value: ''
              }
            ]
          },
          {
            relation: '且',
            rules: [
              {
                column: '',
                tiaojian: '',
                value: ''
              }
            ]
          }
        ],
        notify: [
          {
            type: '立即',
            user: '王某某'
          },
          {
            type: '升级',
            user: '王某某'
          }
        ]
      }
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
    openModal () {
      this.visible = true
    },
    closeModal () {
      this.visible = false
      this.formState = {
        name: '',
        strategy: [
          {
            relation: '且',
            rules: [
              {
                column: '',
                tiaojian: '',
                value: ''
              }
            ]
          }
        ],
        notify: [
          {
            type: '立即',
            user: ''
          }
        ]
      }
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
    handleOk () {
      this.$message.success('新建成功！')
      this.closeModal()
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
    }
  },
  computed: {
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
  }
}
</script>

<style lang='less' scoped>
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
