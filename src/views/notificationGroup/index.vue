<template>
  <div class="unionAlarm">
    <!--      查询-->
    <a-form layout="inline" class="form" style="margin-top:5px">
      <div class="fold">
        <a-row :gutter="[8,8]">
          <a-col v-bind="colLayout">
            <!--            工作组名称-->
            <a-form-item label="工作组" v-bind="formItemLayout" class="wd">
              <a-input placeholder="填写通知组名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="colLayout">
            <!--            管理员名称-->
            <a-form-item label="管理员" v-bind="formItemLayout" class="wd">
              <a-input placeholder="填写管理员名称"></a-input>
            </a-form-item>
          </a-col>
          <!--          有效标识-->
          <a-col v-bind="colLayout">
            <a-form-item label="有效标识" v-bind="formItemLayout" class="wd">
              <a-select allowClear placeholder="请选择">
                <a-select-option :value="1">有效</a-select-option>
                <a-select-option :value="0">无效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span class="collapse">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
      </span>
    </a-form>

    <!--    按钮-->
    <a-button class="marginLeft" @click="addGroup">新建</a-button>
    <a-button class="marginLeft" :disabled="!hasSelected" @click="editGroup">编辑</a-button>
    <popover title="是否要删除这些用户组？" @confirm="() => deleteGroup(record)">
      <a-button class="marginLeft" :disabled="!hasSelected">删除</a-button>
    </popover>
    <a-button class="marginLeft" @click="onShow">分配用户</a-button>
    <a-table
      :columns="columns"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :pagination="pagination"
      :data-source="data"
    ></a-table>
    <schema
      ref="schema"
      @close="onClose"
    ></schema>
    <GroupSchema
      ref="group"
    ></GroupSchema>
  </div>
</template>

<script>
import List from '~~~/Mixins/Table/List'
import schema from './components/assignSchema'
import GroupSchema from './components/groupSchema'
import { NotificationGroupService } from '@/api/service/index'
const columns = [
  {
    title: '通知组名称',
    dataIndex: 'group_name'
  },
  {
    title: '管理员',
    dataIndex: 'admin_name'
  },
  {
    title: '启用状态',
    dataIndex: 'enabled'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 280,
    tooltip: true
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
export default {
  name: 'Notification',
  mixins: [List],
  components: { schema, GroupSchema },
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
      columns,
      data
    }
  },
  methods: {
    addGroup () {
      this.$refs.group.onAdd('新建')
    },
    editGroup () {
      this.$refs.group.onEdit('编辑')
    },
    onShow () {
      this.$refs.schema.show('分配用户')
    },
    onClose () {

    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    deleteGroup (record) {
      // TODO 删除对应的通知组
    },
    async fetch () {
      const { data: { data } } = await NotificationGroupService.getGroup()
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

.marginLeft {
  margin: 3px;
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
