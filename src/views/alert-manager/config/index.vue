<template>
  <div class="deliverRules">
    <div style="display: flex;flex-direction: row-reverse"><a-button icon="plus" type="primary" @click="openModal">新建分派策略</a-button></div>
    <a-modal
      title="新建分派策略"
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="1200px"
      @ok="handleOk"
      @cancel="closeModal"
    >
      <a-form-model :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-form-model-item label="分派策略名称">
          <a-input v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="告警源">
          <a-select v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="分派条件">
          <div
            style="display: grid;
            grid-template-columns: 220px 1fr;
            grid-auto-columns: 1fr;"
            v-for="(map,index) in formState.strategy"
            :key="index">
            <a-avatar :size="64" class="circle"> {{ index+1 }}</a-avatar >
            <div>
              <div style="display: flex;align-items: center;">
                规则之间的条件：<a-radio-group :options="options" v-model="map.relation" :default-value="1" />
                <div style="display: flex;flex-direction: revert">
                  <a-icon type="delete" v-if="index !== 0" @click="deleteStrategyByIndex(index)"/>
                </div>
              </div>
              <div v-for="(m,i) in map.rules" :key="i">
                <a-select v-model="m.column" style="width: 30%;margin-right: 5px"/>
                <a-select v-model="m.symbol" style="width: 30%;margin-right: 5px"/>
                <a-select v-model="m.trigger" style="width: 30%;margin-right: 5px"/>
                <div :style="{visibility: i>0?'default':'hidden',display: 'inline'}">
                  <a-icon type="delete" @click="deleteRuleByIndex(index,i)"/>
                  <a-divider type="vertical"/>
                </div>
                <a-icon type="plus" @click="addRule(index)"/>
              </div>
            </div>
          </div>
          <a-button style="width: 100px;background-color: #2BBC13;color: white" @click="addStrategy"> 增加</a-button>
        </a-form-model-item>
        <a-form-model-item label="分派人">
          <div
            style="display: grid;
            grid-template-columns: 220px 1fr;
            grid-auto-columns: 1fr;"
            v-for="(notice,index) in formState.notify"
            :key="index">
            <a-avatar :size="64" class="circle">{{ notice.type }}</a-avatar>
            <div v-if="index===0">
              <div>通知组或人 <a-select v-model="notice.user" style="width: 100px"/></div>
            </div>
            <div v-else style="display: flex;align-items: center">
              <div>
                <div>如果告警升级后 <a-input-number></a-input-number>分钟无人处理，则告警自动升级通知以下用户</div>
                <div>通知人 <a-select v-model="notice.user" style="width: 100px"/></div>
              </div>
              <a-icon type="delete" @click="notifyLevelDownByIndex(index)"></a-icon>
            </div>
          </div>
          <a-button style="width: 100px;background-color: #2BBC13;color: white" @click="notifyLevelUp"> 升级</a-button>
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
      <template :slot="'levelUp'" slot-scope="text,record">
        {{ record.levelUp?'是':'否' }}
      </template>
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
    </a-table>
    <!--    <DetailSchema ref="schema" @close="onClose"></DetailSchema>-->
  </div>
</template>

<script>
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
import _ from 'lodash'
const columns = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'index',
    width: '100px'
  },
  {
    title: '分派名称',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '关联数据源',
    align: 'center',
    dataIndex: 'dataSource'
  },
  {
    title: '分派人',
    align: 'center',
    dataIndex: 'notify'
  },
  {
    title: '是否升级',
    align: 'center',
    dataIndex: 'levelUp',
    scopedSlots: { customRender: 'levelUp' }
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
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
const originalData = {
  name: '',
  strategy: [
    {
      relation: '且',
      rules: [
        {
          column: '',
          symbol: '',
          trigger: []
        }
      ]
    },
    {
      relation: '且',
      rules: [
        {
          column: '',
          symbol: '',
          trigger: []
        }
      ]
    }
  ],
  notify: [
    {
      type: '立即',
      user: ''
    },
    {
      type: '升级',
      user: ''
    }
  ]
}
const originalRule = {
  column: '',
  symbol: '',
  trigger: []
}
const originalStrategy = {
  relation: '且',
  rules: [
    _.cloneDeep(originalRule)
  ]
}
export default {
  name: 'DeliverRules',
  data () {
    return {
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
      formState: _.cloneDeep(originalData)
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
      this.formState = _.cloneDeep(originalData)
    },
    addStrategy () {
      this.formState.strategy.push(
        _.cloneDeep(originalStrategy)
      )
    },
    deleteStrategyByIndex (index) {
      this.formState.strategy.splice(index, 1)
    },
    notifyLevelDownByIndex (index) {
      this.formState.notify.splice(index, 1)
    },
    deleteRuleByIndex (index, i) {
      this.formState.strategy[index].rules.splice(i, 1)
    },
    addRule (index) {
      this.formState.strategy[index].rules.push(
        _.cloneDeep(originalRule)
      )
    },
    notifyLevelUp () {
      this.formState.notify.push({
        type: '升级',
        user: ''
      })
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
  color: white;
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
