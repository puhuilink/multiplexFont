<template>
  <div>
    <div>
      <a-form class="ant-advanced-search-form" :form="form">
        <div class="fold">
          <a-row :gutter="[8,8]">
            <a-col :style="{ textAlign: 'left' }" class="search_box">
              <label class="search_label">搜索条件</label>
              <a-button type="primary" @click="() => handleSearch()">
                查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
              </a-button>
            </a-col>
            <a-col
              :md="6"
              :sm="24"
            >
              <a-form-item >
                监控对象：
                <a-input
                  :style="{width:'63%'}"
                  v-decorator="[
                    `host_alias` ]"
                  placeholder="请输入关键字"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="24"
            >
              <a-form-item >
                监控实体：
                <a-input
                  :style="{width:'60%'}"
                  v-decorator="[
                    `endpoint_alias` ]"
                  placeholder="请输入关键字"
                />
              </a-form-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-item >
                检查项：
                <a-input
                  :style="{width:'60%'}"
                  v-decorator="[
                    `metric_alias`
                  ]"
                  placeholder="请输入关键字"
                />
              </a-form-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-item >
                检查值类型：
                <a-select
                  :style="{width:'60%'}"
                  v-decorator="[
                    `answer_type` ]"
                  placeholder="请选择类型"
                >
                  <a-select-option
                    value="fill">
                    填写
                  </a-select-option><a-select-option
                    value="select">
                    选择
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-item >
                告警等级：
                <a-select
                  :style="{width:'60%'}"
                  v-decorator="[
                    `level` ]"
                  placeholder="请选择告警等级"
                >
                  <a-select-option value="1">L1</a-select-option>
                  <a-select-option value="2">L2</a-select-option>
                  <a-select-option value="3">L3</a-select-option>
                  <a-select-option value="4">L4</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <div class="operation_box">
        <a-button
          type="primary"
          @click="()=>{
            this.visible=true
            this.isNew=true
            this.editForm = null
          }"><a-icon type="plus-circle"/>新增</a-button>
      </div>
      <ThresholdSchema
        v-if="visible"
        :visible="visible"
        :data-form="editForm"
        :is-new="isNew"
        @cancel="()=>{this.visible=false}"
        @ok="updateThreshold"
      />
    </div>
    <a-table
      :locale="{emptyText:' '}"
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :row-key="(record,index) => index"
      :pagination="{
        current: table.pageNumber,
        defaultPageSize: 10,
        total: this.total,
        onChange:(pageNumber) =>{
          table.pageNumber = pageNumber
          handleSearch(pageNumber)
        }
      }"
    >
      <template slot="host" slot-scope="value,record">{{ value }} <a-tag v-if="record.update_time =='NULL'" color="red">new</a-tag> </template>
      <template slot="endpoint" slot-scope="value,record">{{ record.visible==='t'?value:'虚拟实体' }}</template>
      <template slot="value" slot-scope="value,record">{{ translateThreshold(record) }}</template>
      <template slot="severity" slot-scope="value">{{ 'L'+value }}</template>
      <template slot="action" slot-scope="value,record">
        <a-button type="primary" @click="toUpdate(record)">编辑</a-button>
        <a-divider type="vertical"/>
        <a-button type="primary" @click="toRemove(record.id)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { dealQuery } from '@/utils/util'
import { sql, xungeng } from '@/utils/request'
import ThresholdSchema from '@/views/patrol/config/ThresholdConfig/modules/ThresholdSchema'

export default {
  name: 'PatrolThreshold',
  components: {
    ThresholdSchema
  },
  props: {},
  data () {
    return {
      delId: null,
      deleteVisible: false,
      table: {
        pageNumber: 1,
        pageSize: 10
      },
      queryParams: {},
      pagination: {},
      columns: [
        {
          title: '监控对象',
          dataIndex: 'host_alias',
          scopedSlots: { customRender: 'host' }
        },
        {
          title: '监控实体',
          dataIndex: 'endpoint_alias',
          scopedSlots: { customRender: 'endpoint' }
        },
        {
          title: '检查项',
          dataIndex: 'metric_alias',
          scopedSlots: { customRender: 'metric' }
        },
        {
          title: '检查值',
          dataIndex: 'answer_alias',
          scopedSlots: { customRender: 'answer' }
        },
        {
          title: '阈值',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '告警等级',
          dataIndex: 'severity',
          scopedSlots: { customRender: 'severity' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      loading: false,
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      editForm: {},
      visible: false,
      total: 0,
      isNew: false
    }
  },
  computed: {
    count () {
      return this.expand ? 11 : 7
    }
  },
  watch: {},
  created () {
    this.fetchThreshold({})
  },
  mounted () {
  },
  methods: {
    isBlank (element) {
      return element !== null && element !== undefined && element !== ''
    },
    toRemove (item) {
      const that = this
      this.$confirm({
        title: '确定要删除该项吗',
        content: '删除后路径相关信息将变更',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.deleteThreshold(item)
        },
        onCancel () {}
      })
    },
    handleSearch (pageNo = 1) {
      this.form.validateFields((err, value) => {
        if (!err) {
          let where = ''
          if (this.isBlank(value.host_alias)) {
            where += ' and host_alias like \'%' + value.host_alias + '%\''
          }
          if (this.isBlank(value.endpoint_alias)) {
            where += ' and endpoint_alias like \'%' + value.endpoint_alias + '%\''
          }
          if (this.isBlank(value.metric_alias)) {
            where += ' and metric_alias like \'%' + value.metric_alias + '%\''
          }
          if (this.isBlank(value.answer_type)) {
            where += ' and answer_type like \'%' + value.answer_type + '%\''
          }
          if (this.isBlank(value.level)) {
            where += ' and severity =' + value.level
          }
          if (where !== '') {
            this.fetchThreshold({ condition_sql: where, pageNo: pageNo })
          } else {
            this.fetchThreshold({ pageNo: pageNo })
          }
        }
      })
    },
    async fetchThreshold ({ condition_sql = null, pageNo = 1 }) {
      let base_sql = `select * from v_patrol_threshold where 1=1 `
      let base = `select count(1) as total from v_patrol_threshold where 1=1 `
      if (condition_sql !== null) {
        base_sql += condition_sql
        base += condition_sql
      }
      base_sql += ' order by create_time desc,update_time limit 10 offset ' + (pageNo - 1) * 10
      this.loading = true
      this.data = []
      const result = await sql(base_sql)
      const results = await sql(base)
      this.data = dealQuery(result)
      this.total = parseInt(dealQuery(results)[0]['total'])
      this.loading = false
    },
    handleReset () {
      this.form.resetFields()
    },

    toggle () {
      this.expand = !this.expand
    },
    translateThreshold (record) {
      switch (record.condition) {
        case 'eq':
          if (record.answer_type === 'fill') {
            return '值为"' + record.lower_threshold + '"则异常'
          } else {
            return '值为"' + JSON.parse(record.format)[record.lower_threshold].alias + '"则异常'
          }
        case 'ne':
          if (record.answer_type === 'fill') {
            return '值不为"' + record.lower_threshold + '"则异常'
          } else {
            return '值不为"' + JSON.parse(record.format)[record.lower_threshold].alias + '"则异常'
          }
        case 'out':
          return '值超出"' + record.lower_threshold + '~' + record.upper_threshold + '"范围则异常'
        case 'gt':
          return '值大于"' + record.upper_threshold + '"则异常'
        case 'lt':
          return '值小于"' + record.lower_threshold + '"则异常'
      }
    },
    toUpdate (record) {
      this.visible = true
      this.isNew = false
      this.editForm = { ...record }
    },
    async updateThreshold (data) {
      let result
      if (this.isNew) {
        result = await xungeng.post('threshold/add', {
          'hostId': data.hostId,
          'endpointId': data.endpointId,
          'metricId': data.metricId,
          'answerId': data.answerId,
          'condition': data.condition,
          'lowerThreshold': data.lowerThreshold,
          'upperThreshold': data.upperThreshold,
          'severity': data.severity
        })
      } else {
        result = await xungeng.post('threshold/edit', {
          'id': data.id,
          'condition': data.condition,
          'lowerThreshold': data.lowerThreshold,
          'upperThreshold': data.upperThreshold,
          'severity': data.severity
        })
      }
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: this.isNew ? '新增阈值成功' : '编辑阈值成功'
        })
        this.visible = false
        await this.fetchThreshold({ pageNo: this.table.pageNumber })
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
    },
    async deleteThreshold (id) {
      const result = await xungeng.post('threshold/delete', {
        'id': id
      })
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '删除阈值成功'
        })
        await this.fetchThreshold({ pageNo: this.table.pageNumber })
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
