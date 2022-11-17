<template>
  <div class="unionAlarm">
    <a-tabs :activeKey="state" @change="onChangeState">
      <a-tab-pane :key="ALARM_STATE.unSolved" tab="待处理"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.closed" tab="已处理"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.unclaimed" tab="未认领"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.claimed" tab="已认领"></a-tab-pane>
    </a-tabs>
    <!--      查询-->
    <a-form layout="inline" class="form">
      <div class="fold">
        <a-row :gutter="[8,8]">
          <a-col v-bind="colLayout">
            <!--            告警级别-->
            <a-form-item :label="ALARM_QUERY_LABEL.level" v-bind="formItemLayout" class="wd">
              <a-select
                show-search
                placeholder="选择告警级别"
                option-filter-prop="children"
                :filter-option="filterOption"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option value="tom">
                  Tom
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="colLayout">
            <!--            告警来源-->
            <a-form-item :label="ALARM_QUERY_LABEL.source" v-bind="formItemLayout" class="wd">
              <a-select
                show-search
                placeholder="选择告警来源"
                option-filter-prop="children"
                :filter-option="filterOption"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option value="tom">
                  Tom
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          告警类型-->
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.type" v-bind="formItemLayout" class="wd">
              <a-input placeholder="请输入告警类型" allowclear></a-input>
            </a-form-item>
          </a-col>
          <!--          告警对象-->
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.object" v-bind="formItemLayout" class="wd">
              <a-input placeholder="请输入告警对象" allowclear></a-input>
            </a-form-item>
          </a-col>
          <!--          时间范围-->
          <a-col v-bind="colLayout">
            <a-form-item :label="ALARM_QUERY_LABEL.range" v-bind="formItemLayout" class="wd">
              <a-range-picker @change="onChange" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span class="collapse">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
      </span>
    </a-form>
    <!--        导出-->
    <a-button icon="export" :disabled="!hasSelected">导出</a-button>
    <!--        关闭按钮-->
    <a-popconfirm title="是否要关闭这些告警？" @confirm="() => closeAlarm(record)" >
      <a-button icon="check" :disabled="!hasSelected">关闭</a-button>
    </a-popconfirm>
    <a-table
      bordered
      :columns="columns"
      :pagination="pagination"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record" class="center">
        <a-button @click="showDetail">详情</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="是否要认领这条告警？" @confirm="() => claimAlarm(record)" >
          <a-button>认领</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm title="是否要关闭这条告警？" @confirm="() => closeAlarm(record)" >
          <a-button>关闭</a-button>
        </a-popconfirm>
      </span>
    </a-table>
    <DetailSchema ref="schema" @close="onClose"></DetailSchema>
  </div>
</template>

<script>
import { ALARM_QUERY_LABEL, ALARM_STATE } from '@/tables/unionAlarm/enum'
import List from '~~~/Mixins/Table/List'
import DetailSchema from './components/DetailSchema'
import '@/utils/utils.less'
const columns = [
  {
    title: '告警级别',
    dataIndex: 'level'
  },
  {
    title: '告警ID',
    dataIndex: 'id'
  },
  {
    title: '告警标题',
    dataIndex: 'label'
  },
  {
    title: '告警对象',
    dataIndex: 'object'
  },
  {
    title: '告警类型',
    dataIndex: 'type'
  },
  {
    title: '告警时间',
    dataIndex: 'alarm_time'
  },
  {
    title: '告警内容',
    dataIndex: 'content'
  },
  {
    title: '告警源',
    dataIndex: 'source'
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
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park'
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
  name: 'UnionAlarm',
  data () {
    return {
      state: ALARM_STATE.unSolved,
      ALARM_STATE,
      ALARM_QUERY_LABEL,
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
      selectedRowKeys: [],
      title: '压缩告警详情'
    }
  },
  mixins: [List],
  components: {
    DetailSchema
  },
  methods: {
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
