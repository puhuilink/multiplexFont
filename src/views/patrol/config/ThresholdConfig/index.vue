<template>
  <div>
    <div>
      <a-form-model class="ant-advanced-search-form" :form="form">
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
              <a-form-model-item
                label="监控设备"
                prop="hostAlias"
              >
                <a-input
                  :style="{width:'63%'}"
                  v-model="form.hostAlias"
                  placeholder="请输入关键字"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="6"
              :sm="24"
            >
              <a-form-model-item
                label="监控实体"
                prop="endpointAlias"
              >
                <a-input
                  :style="{width:'60%'}"
                  v-model="form.endpointAlias"
                  placeholder="请输入关键字"
                />
              </a-form-model-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-model-item
                label="检查项"
                prop="metricAlias">
                <a-input
                  :style="{width:'60%'}"
                  v-model="form.metricAlias"
                  placeholder="请输入关键字"
                />
              </a-form-model-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-model-item
                label="检查值类型"
                prop="metricAlias">
                <a-select
                  :style="{width:'60%'}"
                  v-model="form.answerType"
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
              </a-form-model-item>
            </a-col><a-col
              :md="6"
              :sm="24"
            >
              <a-form-model-item
                label="告警等级"
                prop="severity">

                <a-select
                  :style="{width:'60%'}"
                  v-model="form.severity"
                  placeholder="请选择告警等级"
                >
                  <a-select-option value="1">L1</a-select-option>
                  <a-select-option value="2">L2</a-select-option>
                  <a-select-option value="3">L3</a-select-option>
                  <a-select-option value="4">L4</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <div class="operation_box">
        <a-button
          v-action:F010001001004001
          type="primary"
          @click="toBitchUpdate"><a-icon type="unordered-list"/>批量编辑</a-button>
      </div>
      <ThresholdSchema
        ref="editSchema"
        @refresh="fetchThreshold"
      />
      <BatchThresholdTable
        ref="batchTable"
        @refresh="fetchThreshold"
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
      <template slot="severity" slot-scope="value">{{ value?'L'+value:'无' }}</template>
      <template slot="action" slot-scope="value,record">
        <a @click="toUpdate(record)"><a-icon type="form" v-action:F010001001004002/>编辑</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { xungeng } from '@/utils/request'
import ThresholdSchema from '@/views/patrol/config/ThresholdConfig/modules/ThresholdSchema'
import _ from 'lodash'
import BatchThresholdTable from '@/views/patrol/config/ThresholdConfig/modules/BatchThresholdTable.vue'

export default {
  name: 'PatrolThreshold',
  components: {
    BatchThresholdTable,
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
          dataIndex: 'hostAlias',
          scopedSlots: { customRender: 'host' }
        },
        {
          title: '监控实体',
          dataIndex: 'endpointAlias',
          scopedSlots: { customRender: 'endpoint' }
        },
        {
          title: '检查项',
          dataIndex: 'metricAlias',
          scopedSlots: { customRender: 'metric' }
        },
        {
          title: '检查值',
          dataIndex: 'answerAlias',
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
      form: {
        groupId: '',
        pathId: '',
        answerType: '',
        severity: '',
        hostAlias: '',
        endpointAlias: '',
        metricAlias: ''
      },
      editForm: {},
      visible: false,
      total: 0,
      isNew: false,
      pathId: '',
      zoneId: ''
    }
  },
  computed: {
    count () {
      return this.expand ? 11 : 7
    }
  },
  watch: {},
  created () {
    this.dealRouter()
    this.fetchThreshold({})
  },
  mounted () {
  },
  methods: {
    dealRouter () {
      const query = this.$route.query
      this.pathId = query.pathId
      this.zoneId = query.zoneId
    },
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
    handleSearch () {
      this.fetchThreshold()
    },
    async fetchThreshold () {
      this.loading = true
      this.data = []
      const obj = _.cloneDeep(this.form)
      const { pathId, zoneId } = this
      Object.assign(obj, { pathId, zoneId }, { pageNum: this.table.pageNumber, pageSize: 10 })
      Object.keys(obj).forEach(key => {
        if (!this.isBlank(obj[key])) {
          delete obj[key]
        }
      })
      const result = await xungeng.get('/threshold/list', { params: obj })
      this.data = result.data.list
      this.total = result.data.total
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
          if (record.answerType === 'fill') {
            return '值为"' + record.lowerThreshold + '"则异常'
          } else {
            return '值为"' + JSON.parse(record.answerFormat)[record.lowerThreshold].alias + '"则异常'
          }
        case 'ne':
          if (record.answerType === 'fill') {
            return '值不为"' + record.lowerThreshold + '"则异常'
          } else {
            return '值不为"' + JSON.parse(record.answerFormat)[record.lowerThreshold].alias + '"则异常'
          }
        case 'out':
          return '值超出"' + record.lowerThreshold + '~' + record.upperThreshold + '"范围则异常'
        case 'gt':
          return '值大于"' + record.upperThreshold + '"则异常'
        case 'lt':
          return '值小于"' + record.lowerThreshold + '"则异常'
        default:
          return '无阈值'
      }
    },
    toUpdate (record) {
      this.$refs.editSchema.openModal(record)
    },
    toBitchUpdate () {
      this.$refs.batchTable.openModal(this.pathId)
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
