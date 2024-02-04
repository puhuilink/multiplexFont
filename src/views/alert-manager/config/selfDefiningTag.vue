<template>
  <div class="mainDisplay">
    <div class="topTitle">
      <h2 style="width: 93%">数据标签列表</h2>
      <a-button type="primary" :class="data.length < 7?'':'btn_disabled'" :disabled="data.length>=7" style="width: 100px; height: 100%" @click="openModal(false)">新建</a-button>
    </div>
    <div class="mainBody" ref="mainBody">
      <div class="leftList">
        <a-collapse v-model="activeKey" accordion>
          <a-collapse-panel key="1" header="告警源"  style="font-weight: bold">
            <a v-for="source in sourceList" :key="source.sourceId" @click="fetchSourceTags(source.sourceId)" class="collapse-box" :class=" selectedSource === source.sourceId?'bold-text':'no-bold-text' ">
              {{ source.sourceName }}<br><br>
            </a>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="rightTable">
        <a-table
          bordered
          :columns="columns"
          :locale="locale"
          :pagination="pagination"
          :data-source="data">
          <span :slot="'index'" slot-scope="text,record,index" >{{ index }}</span>
          <span slot="sourceName">{{ getSourceName(activeSourceId) }}</span>
          <span slot="type">告警源</span>
          <template :slot="'action'" slot-scope="text,record">
            <a-button @click="openModal(record)">编辑</a-button>
            <a-divider type="vertical" />
            <!--        <a-switch :checked="record.status" size="small" />-->
            <!--        <a-divider type="vertical" />-->
            <a-popconfirm
              title="确定要删除此标签?"
              placement="left"
              @confirm="deleteTag(record.id)"
              okText="确认"
              cancelText="取消"
              :disabled="!record.deleteFlag">
              <a-button :disabled="!record.deleteFlag">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      :title="updateFlag ? '修改映射信息' : '新建映射信息'"
      :visible="visible"
      width="1100px"
      @ok="handleOk"
      @cancel="closeModal"
      @close="closeModal">
      <a-form-model
        ref="ruleForm"
        :model="formState"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol">
        <a-form-model-item
          label="告警源字段"
          :rules="[{ required: true, message: '告警源字段必选', trigger: 'change' }]"
          prop="sourceField">
          <a-select v-model="formState.sourceField" :options="sourceOptions" @change="sourceChange" />
        </a-form-model-item>
        <a-form-model-item
          label="映射字段"
          :rules="[{ required: true, message: '映射字段必选', trigger: 'change' }]"
          prop="targetField">
          <a-select
            v-model="formState.targetField"
            :options="mappingOptions"
            @change="targetChange"
            :disabled="targetFlag" />
        </a-form-model-item>
        <a-form-model-item
          label="说明"
          v-if="formState.targetField === 'uniqueKey'"
          :rules="[{ required: formState.targetField === 'uniqueKey', message: '告警源字段必填', trigger: 'change' }]"
          prop="sourceField">
          <a-input v-model="formState.remark" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { alarm } from '@/utils/request'
import _ from 'lodash'
import notification from 'ant-design-vue/lib/notification'

const originalFormData = {
  sourceId: '',
  mappingId: '',
  sourceField: '',
  targetField: '',
  targetType: '',
  remark: ''
}
export default {
  name: 'SelfDefiningTag',
  data () {
    return {
      selectedSource: null,
      op: [],
      op1: [],
      activeKey: ['1'],
      sampleData: {},
      locale: {
        emptyText: <a-empty></a-empty>
      },
      columns: [
        {
          title: '序号',
          align: 'center',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '告警源',
          align: 'center',
          dataIndex: 'source_name',
          scopedSlots: { customRender: 'sourceName' }
        },
        {
          title: '预留字段',
          align: 'center',
          dataIndex: 'targetField'
        },
        {
          title: 'Key',
          align: 'center',
          dataIndex: 'sourceField'
        },
        {
          title: '数据类型',
          align: 'center',
          dataIndex: 'targetType'
        },
        {
          title: '说明',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      mappingLabels: {
        'uniqueKey': '唯一标识符',
        'device': '告警设备',
        'title': '告警标题',
        'content': '告警内容',
        'level': '告警级别',
        'event_id': '事件id',
        'device_type': '设备类别'
      },
      data: [{
        'id': '328829073625321472',
        'sourceField': 'source',
        'targetField': 'uniqueKey',
        'targetType': 'string',
        'remark': 'BJ1',
        'deleteFlag': false,
        'updateFlag': false
      }],
      pagination: {
        pageSizeOptions: ['5', '10', '20', '30'],
        defaultCurrent: 1,
        pageSize: 10,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`
      },
      sourceList: [],
      activeSourceId: '',
      mappingList: [],
      mappingOptions: [],
      sourceOptions: [],
      visible: false,
      updateFlag: false,
      targetFlag: false,
      formState: _.cloneDeep(originalFormData),
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
      }
    }
  },
  methods: {
    openModal (record) {
      if (record) {
        // 编辑映射字段
        this.mappingOptions = this.op.filter(opItem => {
          // 排除传入的数据
          if (record.targetField === opItem.key) {
            return true
          }
          return !this.data.some(dataItem => dataItem.targetField === opItem.key)
        })
        // 编辑告警源字段
        this.sourceOptions = this.op1.filter(opItem => {
          // 排除传入的数据
          if (record.sourceField === opItem.key) {
            return true
          }
          return !this.data.some(dataItem => dataItem.sourceField === opItem.key)
        })

        this.updateFlag = true
        this.formState.mappingId = record.id
        this.formState.sourceField = record.sourceField
        this.formState.targetField = record.targetField
        this.formState.remark = record.remark
        delete this.formState.sourceId
        delete this.formState.targetType
        this.targetFlag = !record.updateFlag
      } else {
        // 新增
        this.mappingOptions = this.op.filter(opItem => !this.data.some(dataItem => dataItem.targetField === opItem.key))
        this.sourceOptions = this.op1.filter(opItem => !this.data.some(dataItem => dataItem.sourceField === opItem.key))
        this.formState.sourceId = this.activeSourceId
        delete this.formState.mappingId
      }
      this.visible = true
    },
    async deleteTag (mappingId) {
      try {
        const res = await alarm.post('/api/configuration/mapping/delete', { mappingId })
        if (res.code === 200) {
          await this.fetchSourceList()
          await this.fetchMappingList()
          notification.success({
            message: '系统提示',
            description: res.msg
          })
        } else {
          notification.success({
            message: '系统提示',
            description: res.msg
          })
        }
      } catch (e) {
        this.$message.error('网络请求错误！')
      }
    },
    async handleOk () {
      let flag = false
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.error('请检查您的表单项是否都填写完毕！')
          flag = true
        }
      })
      if (flag) {
        return
      }
      const formData = _.cloneDeep(this.formState)
      let baseUrl
      if (this.updateFlag) {
        baseUrl = '/api/configuration/mapping/update'
      } else {
        baseUrl = '/api/configuration/mapping/add'
      }
      try {
        const res = await alarm.post(baseUrl, formData)
        if (res.code === 200) {
          await this.fetchSourceList()
          await this.fetchMappingList()
          notification.success({
            message: '系统提示',
            description: res.msg
          })
          this.closeModal()
        } else {
          notification.error({
            message: '系统提示',
            description: res.msg
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    sourceChange (e) {
      if (this.formState.targetField === 'uniqueKey') {
        this.formState.remark = this.sampleData[e]
      }
    },
    targetChange (e) {
      const entity = this.mappingList.find(m => m.fieldName === e)
      this.formState.targetField = entity.fieldName
      this.formState.targetType = entity.fieldType
      // this.$refs.ruleForm.clearValidate('targetField')
    },
    closeModal () {
      this.visible = false
      this.updateFlag = false
      this.targetFlag = false
      this.$refs.ruleForm.resetFields()
      this.formState = _.cloneDeep(originalFormData)
    },
    getSourceName (id) {
      const source = this.sourceList.find((s) => s.sourceId === id)
      if (source) {
        return source.sourceName
      } else {
        return ''
      }
    },
    // 获取所有数据源 用于展示
    async fetchSourceList () {
      try {
        const { data } = await alarm.get('/api/configuration/mapping/getSource')
        this.sourceList = data
        await this.fetchSourceTags(data[0].sourceId)
        await this.fetchMappingList()
      } catch (e) {
        this.$message.error('网络请求错误！')
        this.sourceList = []
      }
    },
    // 获取映射字段
    async fetchMappingList () {
      try {
        const { data } = await alarm.get('/api/integration/source/preadd')
        this.mappingList = data
        this.op = []
        data.forEach(d => {
          this.op.push({
            key: d.fieldName,
            label: this.mappingLabels[d.fieldName]
          })
        })
      } catch (e) {
        this.$message.error('网络请求错误！')
        this.mappingList = []
      }
    },
    // 获取数据源对应的映射关系
    async fetchSourceTags (sourceId) {
      this.selectedSource = sourceId
      try {
        this.activeSourceId = sourceId
        const { data } = await alarm.post('/api/configuration/mapping/find', { sourceId })
        this.data = data.mapping
        this.op1 = []
        const sample = JSON.parse(data.sampleData.sampleData)
        this.sampleData = sample
        Object.keys(sample).forEach(s => {
          this.op1.push({
            key: s,
            label: s
          })
        })
      } catch (e) {
        this.$message.error('网络请求错误！')
        this.data = []
      }
    },
    getDivHeight () {
      const screenHeight = window.innerHeight
      this.$refs.mainBody.style.height = screenHeight - 200 + 'px'
    }
  },
  computed: {},
  mounted () {
    // this.getDivHeight()
    window.addEventListener('resize', this.getDivHeight)
    this.fetchSourceList()
  },
  destroyed () {
    window.removeEventListener('resize', this.getDivHeight, false)
  }
}
</script>

<style scoped>
.mainDisplay {
  margin-left: 10px;
  margin-right: 10px;
}

.topTitle {
  display: flex;
  width: 97%;
  align-items: center;
  height: 40px;
  margin: 0 auto 10px;
}
.btn_disabled {
  color: rgba(0,0,0,.25) !important;
  background-color: #F5F5F5 !important;
  border-color: #d9d9d9 !important;
}
.mainBody {
  display: flex;
  width: 97%;
  height: auto;
  justify-content: space-between;
  margin: 0 auto;
}

.leftList {
  height: 100%;
  width: 13%;
  /* margin-right: 2%; */
  /* border: 1px solid grey; */
}

.rightTable {
  height: 100%;
  width: 85%;
  /* margin-right: 2%; */
  /* border: grey solid 1px; */
}
.ant-table-wrapper{
  padding: 0;
}
.collapse-box{
  /*font-weight: bold;*/
  color: #000;
}
.bold-text {
  font-weight: bold;
}
.no-bold-text {
  font-weight: 400;
}
</style>
