<template>
  <div class="mainDisplay">
    <div class="topTitle">
      <h2 style="width: 93%">数据标签列表</h2>
      <a-button type="primary" style="width: 100px; height: 100%" @click="openModal" >新建</a-button>
    </div>
    <div class="mainBody" ref="mainBody">
      <div class="leftList">
        <a-collapse v-model="activeKey" accordion>
          <a-collapse-panel key="1" header="全局" @click="fetchSourceTags(null)">
            <p @click="fetchSourceTags(null)">全局</p>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="告警源">
            <p
              v-for="source in sourceList"
              :key="source.sourceId"
              @click="fetchSourceTags(source.sourceId)"
            >
              {{ source.sourceName }}
            </p>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="rightTable">
        <a-table
          bordered
          :columns="columns"
          :pagination="pagination"
          :data-source="data">
          <span slot="sourceName">{{ getSourceName(activeSourceId) }}</span>
          <span slot="type">{{ activeKey === '2'?'告警源':"全局" }}</span>
          <template :slot="'action'" slot-scope="text,record">
            <a-button @click="openModal(record)">编辑</a-button>
            <a-divider type="vertical" />
            <!--        <a-switch :checked="record.status" size="small" />-->
            <!--        <a-divider type="vertical" />-->
            <a-popconfirm
              title="确定要删除此标签?"
              placement="left"
              @confirm="deleteTag(record.id)"
              okText="确定"
              cancelText="取消"
              :disabled="!record.deleteFlag"
            >
              <a-button :disabled="!record.deleteFlag">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      :title="updateFlag?'修改映射信息':'新建映射信息'"
      :visible="visible"
      width="1100px"
      @ok="handleOk"
      @cancel="closeModal"
      @close="closeModal"
    >
      <a-form-model ref="ruleForm" :model="formState" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-form-model-item label="告警源字段" :rules="[{ required: true, message: '告警源字段必填', trigger: 'change' }]" prop="sourceField">
          <a-input v-model="formState.sourceField"/>
        </a-form-model-item>
        <a-form-model-item label="映射字段" :rules="[{ required: true, message: '映射字段必选', trigger: 'change' }]" prop="sourceField">
          <a-select v-model="formState.targetField" :options="mappingOptions" @change="targetChange"/>
        </a-form-model-item>
        <a-form-model-item label="说明" v-if="formState.targetField === 'uniqueKey'" :rules="[{ required: formState.targetField === 'uniqueKey', message: '告警源字段必填', trigger: 'change' }]" prop="sourceField">
          <a-input v-model="formState.remark"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { alarm } from '@/utils/request'
import _ from 'lodash'
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
      activeKey: ['1'],
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'id'
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
      data: [{
        'id': '328829073625321472',
        'sourceField': 'source',
        'targetField': 'uniqueKey',
        'targetType': 'string',
        'remark': 'BJ1',
        'deleteFlag': false,
        'updateFlag': false
      }],
      pagination: {},
      sourceList: [],
      activeSourceId: '',
      mappingList: [],
      mappingOptions: [],
      visible: false,
      updateFlag: false,
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
        this.updateFlag = true
        this.formState.mappingId = record.id
        this.formState.sourceField = record.sourceField
        this.formState.targetField = record.targetField
        this.formState.remark = record.remark
        delete this.formState.sourceId
        delete this.formState.targetType
      } else {
        this.formState.sourceId = this.activeSourceId
        delete this.formState.mappingId
      }
      this.visible = true
    },
    async deleteTag (mappingId) {
      try {
        const res = await alarm.post('/api/configuration/mapping/delete', { mappingId })
        if (res.data) {
          this.$message.success(res.data)
        } else {
          this.$message.error(res.msg)
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
        if (res.data) {
          this.$message.success(res.data)
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.$message.error('网络请求错误！')
      }
    },
    targetChange (e) {
      const entity = this.mappingList.find(m => m.fieldName === e)
      this.formState.targetField = entity.fieldName
      this.formState.targetType = entity.fieldType
    },
    closeModal () {
      this.visible = false
      this.updateFlag = false
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
        const op = []
        data.forEach(d => {
          op.push({
            key: d.fieldName,
            label: d.fieldName
          })
        })
        this.mappingoptions = op
      } catch (e) {
        this.$message.error('网络请求错误！')
        this.mappingList = []
      }
    },
    // 获取数据源对应的映射关系
    async fetchSourceTags (sourceId) {
      try {
        this.activeSourceId = sourceId
        const { data } = await alarm.post('/api/configuration/mapping/find', { sourceId })
        this.data = data.mapping
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
    this.getDivHeight()
    window.addEventListener('resize', this.getDivHeight)
    this.fetchSourceList()
    this.fetchMappingList()
  },
  destroyed () {
    window.removeEventListener('resize', this.getDivHeight, false)
  }
}
</script>

<style scoped>
.mainDisplay{
  margin-left: 10px;
  margin-right: 10px;
}
.topTitle{
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 10px;
}
.mainBody{
  display: flex;
  height: 0;
}
.leftList{
  height: 100%;
  width: 37%;
  margin-right: 2%;
  border: 1px solid grey;
}
.rightTable{
  height: 100%;
  width: 67%;
  margin-right: 2%;
  border: grey solid 1px;
}
</style>
