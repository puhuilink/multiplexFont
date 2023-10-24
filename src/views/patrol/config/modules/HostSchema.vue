<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    width="800px"
    centered
    v-if="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="formState"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <a-form-model-item
        label="巡更楼层"
        prop="zoneAlias"
        v-if="operationArray[0].edit||operationArray[0].show"
        :rules="[{ required: operationArray[0].required, message: '请输入楼层名称',trigger:'blur' }]"
      >
        <a-input v-model="formState.zoneAlias" v-if="operationArray[0].edit"></a-input>
        <h5 style="color: grey" v-if="operationArray[0].show">{{ formState.zoneAlias }}</h5>
      </a-form-model-item>
      <a-form-model-item
        label="巡更点位"
        prop="checkpointAlias"
        v-if="operationArray[1].edit||operationArray[1].show"
        :rules="[{ required: operationArray[1].required, message: '请输入点位名称',trigger:'blur' }]"
      >
        <a-input v-model="formState.checkpointAlias" v-if="operationArray[1].edit"></a-input>
        <h5 style="color: grey" v-if="operationArray[1].show">{{ formState.checkpointAlias }}</h5>
      </a-form-model-item>
      <a-form-model-item
        label="设备信息"
        prop="hostAlias"
        v-if="operationArray[2].edit||operationArray[2].show"
        :wrapperCol="operationArray[2].show?{
          xs: { span: 24,offset:4 },
          sm: { span: 16 }
        }:{
          xs: { span: 10 },
          sm: { span: 12 }
        }"
        :rules="[{ required: operationArray[2].required, message: '请输入设备名称',trigger:'blur' }]"
      >
        <div v-if="operationArray[2].edit">
          <a-input v-model="formState.hostAlias" placeholder="设备名称，该项必填!"/>
          <a-input v-model="formState.container" placeholder="柜位"/>
          <a-input v-model="formState.hostType" placeholder="设备类型"/>
          <a-input v-model="formState.hostBrand" placeholder="设备品牌"/>
          <a-input v-model="formState.ipAddress" placeholder="IP地址"/>
          <a-input v-model="formState.sn" placeholder="SN号"/>
          <a-input v-model="formState.hostBelong" placeholder="归属单位"/>
        </div>
        <div v-if="operationArray[2].show">
          <h5 style="color: grey"></h5>
          <h5 style="color: grey">设备名称：{{ formState.hostAlias }}</h5>
          <h5 style="color: grey">柜位：{{ formState.container }}</h5>
          <h5 style="color: grey">设备类型：{{ formState.hostType }}</h5>
          <h5 style="color: grey">设备品牌：{{ formState.hostBrand }}</h5>
          <h5 style="color: grey">IP地址：{{ formState.ipAddress }}</h5>
          <h5 style="color: grey">SN号：{{ formState.sn }}</h5>
          <h5 style="color: grey">归属单位：{{ formState.hostBelong }}</h5>
        </div>
      </a-form-model-item>
      <a-form-model-item
        label="检查实体"
        prop="endpointAlias"
        v-if="operationArray[3].edit||operationArray[3].show"
        :rules="[{ required: operationArray[3].required, message: '请输入点位名称',trigger:'blur' }]"
      >
        <a-input v-model="formState.endpointAlias" v-if="operationArray[3].edit"></a-input>
        <h5 style="color: grey" v-if="operationArray[3].show">{{ formState.endpointAlias?formState.endpointAlias:'虚拟实体' }}</h5>
      </a-form-model-item>
      <a-form-model-item
        label="检查项"
        prop="metricAlias"
        v-if="operationArray[4].edit||operationArray[4].show"
        :rules="[{ required: operationArray[4].required, message: '请输入检查项名称',trigger:'blur' }]"
      >
        <a-input v-model="formState.metricAlias" v-if="operationArray[4].edit"></a-input>
        <h5 style="color: grey" v-if="operationArray[4].show">{{ formState.metricAlias }}</h5>
      </a-form-model-item>
      <a-form-model-item
        label="检查值"
        prop="answerId"
        v-if="operationArray[4].edit||operationArray[4].show"
        :rules="[{ required: operationArray[4].required, message: '请选择检查值',trigger:'blur' }]"
      >
        <a-select v-model="formState.answerId" v-if="operationArray[4].edit" :options="answerOptions"></a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { sql, xungeng } from '@/utils/request'
import MetricTable from '@/views/patrol/config/MetricTable/MetricTable'
import { formMap, operationMap, takeData, titleMap } from '@/views/patrol/config/js/schenaData'
import { dealQuery } from '@/utils/util'

export default {
  name: 'HostSchema',
  mixins: [],
  components: {
    MetricTable,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data () {
    return {
      formState: {},
      operationArray: [],
      visible: false,
      modalTitle: '',
      answerOptions: [],
      requestSubmit: () => {},
      labelCol: {
        xs: { span: 14 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 12 }
      }
    }
  },
  methods: {
    async fetchAnswer () {
      const base_sql = 'select id,alias from t_patrol_answer '
      const data = dealQuery(await sql(base_sql))
      this.answerOptions = []
      data.forEach(entity => {
        this.answerOptions.push({
          label: entity.alias,
          value: entity.id
        })
      })
    },
    infoConfig (actionType, recordData, pathId, zoneId) {
      this.visible = true
      this.operationArray = operationMap[actionType]
      this.modalTitle = titleMap[actionType]
      this.formState = formMap[actionType]
      Object.assign(recordData, { pathId, zoneId })
      Object.keys(recordData).forEach(key => {
        if (recordData[key] === 'NULL') {
          recordData[key] = null
        }
      })
      takeData(actionType, recordData, this.formState)
      this.fetchAnswer()
      if (actionType.indexOf('edit') !== -1) {
        this.requestSubmit = this.requestEdit
      } else {
        this.requestSubmit = this.requestNew
      }
    },
    async requestNew () {
      const result = await xungeng.post('/path/saveOnePath', this.formState)
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '巡更路径新建成功'
        })
        this.$emit('refresh')
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
      this.handleCancel()
    },
    async requestEdit () {
      const result = await xungeng.post('/path/editPath', this.formState)
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '巡更路径变更成功'
        })
        this.$emit('refresh')
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
      this.visible = false
    },
    handleOk () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.requestSubmit()
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="less">
.HostSchema {
  margin-left: 28px;
  font-weight: 500;
  font-size: 14px;

  &__content {
    height: 490px;
    overflow-y: auto;
  }

  &__btn {
    &_group {
      display: flex;
      width: 100%;
      justify-content: center;
      padding: 4px;
    }

    &-remove {
      position: absolute;
      top: 17px;
      right: 4px;
    }
  }
}

.tablesStyle {
  position: relative;
  margin-bottom: 10px;
  padding: 13px 0 18px 0;
  background-color: #ccc;
}
</style>
