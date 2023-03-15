<template>
  <div class="shieldRule" style="background: white">
    <div style="display: flex;flex-direction: row-reverse"><a-button icon="plus" type="primary" @click="openModal">新建屏蔽规则</a-button></div>
    <a-modal
      title="新建屏蔽规则"
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="50%"
      @ok="handleOk"
      @cancel="closeModal"
    >
      <a-form-model :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-form-model-item label="规则名称">
          <a-input v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="关联告警源">
          <a-select v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="规则内容">
          <div
            style="display: grid;
            grid-template-columns:1fr;
            grid-auto-columns: 1fr;"
            v-for="(map,index) in formState.strategy"
            :key="index">
            <div>
              <div style="display: flex;align-items: center;">
                规则之间的条件：<a-radio-group :options="options" v-model="map.relation" :default-value="1" />
                <div style="display: flex;flex-direction: revert"><a-icon type="delete" v-if="index !== 0"></a-icon></div>
              </div>
              <div v-for="(m,i) in map.rules" :key="i">
                <a-select v-model="m.column" style="width: 30%;margin-right: 5px"/>
                <a-select v-model="m.symbol" style="width: 30%;margin-right: 5px"/>
                <a-select v-model="m.trigger" style="width: 30%;margin-right: 5px"/>
                <div :style="{visibility: i>0?'default':'hidden',display: 'inline'}">
                  <a-icon type="delete" @click="deleteRuleByIndex(i)"></a-icon>
                  <a-divider type="vertical"/>
                </div>
                <a-icon type="plus" @click="addRule()"></a-icon>
              </div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="生效时间">
          <a-date-picker v-model="formState.name" />
        </a-form-model-item>
        <a-form-model-item label="失效时间">
          <a-date-picker v-model="formState.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-table
      :columns="columns"
      :pagination="pagination"
      :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template :slot="'content'" slot-scope="text,record">
        <div v-for="(ct,index) in record.content.content" :key="ct" style="margin-top: 5px" >
          <a-avatar class="gridContent" size="small" :style="{visibility:index !== 0?'none':'hidden'}" style="color: white; backgroundColor: rgb(44,139,240)">
            {{ record.content.relation }}
          </a-avatar>
          <a-select class="gridContent" :style="{width: 30+ct.column.length * 18 +'px'}" disabled v-model="ct.column" :show-arrow="false"/>
          <a-select class="gridContent" :style="{width: 30+ct.symbol.length * 18 +'px'}" disabled v-model="ct.symbol" :show-arrow="false"/>
          <a-select class="gridContent" :style="{width: 30+ct.trigger.length * 18 +'px'}" disabled v-model="ct.trigger" :show-arrow="false"/>
        </div>
      </template>
      <template :slot="'action'" slot-scope="text,record">
        <img
          :src="require(`@/assets/icons/svg/edit_icon.svg`)"
          width="20px"
          height="20px"
          title="编辑应用"
          @click="openModal(record)"
        />
        <a-divider type="vertical" />
        <a-switch :checked="record.status" size="small" />
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除此规则?"
          placement="left"
          @confirm="deleteShieldRule(record.accountId)"
          okText="确定"
          cancelText="取消"
        >
          <img
            :src="require(`@/assets/icons/svg/delete_icon.svg`)"
            width="20px"
            height="20px"
            title="删除应用"
          />
        </a-popconfirm>
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
import { judgeRoleToAlertView } from '@/utils/util'

const columns = [
  {
    title: '规则名称',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '关联告警源',
    align: 'center',
    dataIndex: 'dataSource'
  },
  {
    title: '规则内容',
    align: 'center',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '生效时间',
    align: 'center',
    dataIndex: 'startTime'
  },
  {
    title: '失效时间',
    align: 'center',
    dataIndex: 'endTime'
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
    name: '屏蔽规则001',
    content: {
      relation: '且',
      content: [
        {
          column: '告警级别',
          symbol: '等于',
          trigger: 'P1',
          useRegexp: true
        },
        {
          column: '告警级别',
          symbol: '等于',
          trigger: 'P1',
          useRegexp: true
        }
      ]
    },
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
  },
  {
    index: '2',
    name: '屏蔽规则001',
    content: [],
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
  },
  {
    index: '3',
    name: '屏蔽规则001',
    content: [],
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
  },
  {
    index: '4',
    name: '屏蔽规则001',
    content: [],
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
  },
  {
    index: '5',
    name: '屏蔽规则001',
    content: [],
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
  },
  {
    index: '6',
    name: '屏蔽规则001',
    content: [],
    dataSource: '北京pigoss001',
    startTime: '2022-08-01 10:16:12',
    endTime: '2023-08-01 10:16:12'
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
const originData = {
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
    }
  ]
}
export default {
  name: 'ShieldRule',
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
      visible: false,
      confirmLoading: false,
      selectedRowKeys: [],
      title: '压缩告警详情',
      options: [
        { label: '或', value: '或' },
        { label: '且', value: '且' }
      ],
      selectedColumns: [
        '告警标题',
        '告警内容',
        '告警级别',
        '主机',
        '告警对象',
        '服务',
        '上下文',
        '细节'
      ],
      formState: _.cloneDeep(originData),
      workTime: {
        startDay: '周一',
        endDay: '周五',
        startTime: '08：30',
        endTime: '17：30 '
      },
      days: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周天'
      ],
      times: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周天'
      ]
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
    openModal (record) {
      if (record) {
        this.formState = {}
      }
      this.visible = true
    },
    closeModal () {
      this.visible = false
      this.formState = _.cloneDeep(originData)
    },
    addRule () {
      if (this.formState.strategy[0].rules.length > 4) {
        this.$message.warn('最多只能添加5条！')
        return
      }
      this.formState.strategy[0].rules.push({
        column: '',
        symbol: '',
        trigger: []
      })
      this.$forceUpdate()
    },
    deleteRuleByIndex (index) {
      this.formState.strategy[0].rules.splice(index, 1)
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
  },
  mounted () {
    judgeRoleToAlertView()
  }
}
</script>

<style lang='less' scoped>
.recordContent{
  width: 100px;
}
.gridContent{
  margin-right: 5px;
}
.notifyRulesBasic{
  display: grid;
  background: #edf0f4;
  grid-template-columns: auto 400px;
  grid-gap: 30px;
  height: 100%;
  padding: 3px;
}
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
