<template>
  <div class="unionAlarm">
    <!--      查询-->
    <!--    <a-form layout="inline" class="form" style="margin-top:5px">-->
    <!--      <div class="fold">-->
    <!--        <a-row :gutter="[8,8]">-->
    <!--          <a-col v-bind="colLayout">-->
    <!--            &lt;!&ndash;            工作组名称&ndash;&gt;-->
    <!--            <a-form-item label="工作组" v-bind="formItemLayout" class="wd">-->
    <!--              <a-input placeholder="填写通知组名称"></a-input>-->
    <!--            </a-form-item>-->
    <!--          </a-col>-->
    <!--          <a-col v-bind="colLayout">-->
    <!--            &lt;!&ndash;            管理员名称&ndash;&gt;-->
    <!--            <a-form-item label="管理员" v-bind="formItemLayout" class="wd">-->
    <!--              <a-input placeholder="填写管理员名称"></a-input>-->
    <!--            </a-form-item>-->
    <!--          </a-col>-->
    <!--          &lt;!&ndash;          有效标识&ndash;&gt;-->
    <!--          <a-col v-bind="colLayout">-->
    <!--            <a-form-item label="有效标识" v-bind="formItemLayout" class="wd">-->
    <!--              <a-select allowClear placeholder="请选择">-->
    <!--                <a-select-option :value="1">有效</a-select-option>-->
    <!--                <a-select-option :value="0">无效</a-select-option>-->
    <!--              </a-select>-->
    <!--            </a-form-item>-->
    <!--          </a-col>-->
    <!--        </a-row>-->
    <!--      </div>-->
    <!--      <span class="collapse">-->
    <!--        <QueryBtn @click="query" />-->
    <!--        <ResetBtn @click="resetQueryParams" />-->
    <!--      </span>-->
    <!--    </a-form>-->

    <!--    按钮-->
    <a-button class="marginLeft" @click="addGroup">新建</a-button>
    <a-button class="marginLeft" :disabled="!hasSelectedOne" @click="editGroup">编辑</a-button>
    <a-popconfirm title="是否要删除这些用户组？" @confirm="() => deleteGroup(selectedRows)">
      <a-button class="marginLeft" :disabled="!hasSelected">删除</a-button>
    </a-popconfirm>
    <a-table
      :columns="columns"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :loading="loading"
      rowKey="groupId"
      :data-source="dataSource"
      :pagination="{
        pageSizeOptions: ['10', '25', '30', '50', '100'],
        defaultCurrent: 1,
        pageSize: 10,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
      }"
    ></a-table>
    <GroupSchema
      ref="group"
      @success="() => fetch()"
    ></GroupSchema>
  </div>
</template>

<script>
import List from '~~~/Mixins/Table/List'
import schema from './components/assignSchema'
import GroupSchema from './components/groupSchema'
import { NotificationGroupService } from '@/api/service/index'
import _ from 'lodash'
const columns = [
  {
    title: '通知组名称',
    key: 'groupName',
    dataIndex: 'groupName'
  },
  {
    title: '管理员',
    key: 'accountName',
    dataIndex: 'accountName'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    width: 280,
    tooltip: true
  }
]
const data = []
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
      dataSource: data,
      selectedKey: '',
      loading: false
    }
  },
  methods: {
    addGroup () {
      this.$refs.group.onAdd('新建')
    },
    editGroup () {
      this.$refs.group.onEdit('编辑', this.selectedRows)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    async deleteGroup (record) {
      try {
        this.loading = true
        await NotificationGroupService.deleteGroup(record.map(el => _.get(el, 'groupId')))
        await this.fetch()
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: '删除失败'
        })
      } finally {
        this.loading = false
      }
    },
    async fetch () {
      // TODO 对接通知组请求
      // eslint-disable-next-line no-unused-vars
      let data = []
      try {
        this.loading = true
        data = await NotificationGroupService.getGroup()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
        this.dataSource = data
      }
    }
  },
  created () {
    this.fetch()
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
