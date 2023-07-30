<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    @change="$emit('update:visible', $event)"
    @ok="handleOk"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <a-form-model-item
        label="巡更点位"
        prop="checkpointId"
        :rules="[{ required: false, message: '请输入巡更点位' }]"
        v-if="formStatus!==4"
      >
        <a-select v-model="form.checkpointId" :disabled="formStatus<4">
          <a-select-option :value="form.checkpointId">{{ xgModelPoint.alias }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="巡更点位"
        prop="checkpointAlias"
        :rules="[{ required: true, message: '请输入巡更点位名称' }]"
        v-if="formStatus===4"
      >
        <a-input v-model="form.checkpointAlias"/>
      </a-form-model-item>
      <a-form-model-item
        v-if="!hNew"
        label="监控对象"
        prop="hostId"
        :rules="[{ required: formStatus>=3, message: '请选择监控对象' }]"
      >
        <a-select placeholder="请选择监控对象" v-model="form.hostId" :disabled="formStatus<3">
          <a-select-option v-for="h in Object.values(hosts)" :key="h.id" :value="h.id">{{ h.alias }}</a-select-option>
        </a-select>
        <a-button v-if="formStatus>=3" :style="{width:'60%'}" :disabled="formStatus<3" @click="loadNewHost">录入新监控对象
        </a-button>
      </a-form-model-item>
      <a-form-model-item
        v-else-if="hNew"
        label="监控对象"
        prop="hostAlias"
        :rules="[{ required: formStatus>=3, message: '请输入监控对象名称' }]"
      >
        <a-input placeholder="请输入监控对象名称" v-model="form.hostAlias" :disabled="formStatus<3">
        </a-input>
        <a-button :style="{width:'60%'}" :disabled="formStatus<3" @click="cancelNewHost">选择</a-button>
      </a-form-model-item>
      <a-form-model-item
        v-if="!eNew"
        label="监控实体"
        prop="endpointId"
        :rules="[{ required: formStatus>=2, message: '请选择监控实体' }]"
      >
        <a-select placeholder="请选择监控实体" v-model="form.endpointId" :disabled="formStatus<2">
          <a-select-option v-for="h in Object.values(endpoints)" :key="h.id" :value="h.id">
            {{ h.alias == '' ? '虚拟实体' : h.alias }}
          </a-select-option>
        </a-select>
        <a-button v-if="formStatus>=2" :style="{width:'60%'}" :disabled="formStatus<2" @click="loadNewEndpoint">
          录入新监控实体
        </a-button>
      </a-form-model-item>
      <a-form-model-item
        v-else-if="eNew"
        label="监控实体"
        prop="endpointAlias"
        :rules="[{ required: formStatus>=2&&form.visible, message: '请输入监控实体名称' }]"
      >
        <a-input placeholder="请输入监控实体" v-model="form.endpointAlias" :disabled="formStatus<2||isVirtual">
        </a-input>
        <a-button :style="{width:'60%'}" :disabled="formStatus<2" @click="cancelNewEndpoint">选择</a-button>
        <a-checkbox
          :style="{width:'38%',marginLeft: '2%'}"
          :disabled="formStatus<2"
          v-model="isVirtual">虚拟实体
        </a-checkbox>
      </a-form-model-item>
      <a-form-model-item
        label="检查项"
        prop="metricId"
        :rules="[{ required: formStatus>=0, message: '请输入检查项' }]"
      >
        <a-select placeholder="请选择检查项" v-model="form.metricId" :disabled="formStatus<0">
          <a-select-option v-for="value in Object.values(metrics)" :key="value.id" :value="value.id">{{ value.alias }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { xungeng } from '@/utils/request'
import MetricTable from '@/views/patrol/config/MetricTable/MetricTable'

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
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        hostId: '',
        hostAlias: '',
        endpointId: '',
        endpointAlias: '',
        isVirtual: false,
        metricId: ''
      })
    },
    xgModelPoint: {
      type: Object,
      default: () => ({ id: '', alias: '' })
    },
    // 0：编辑检查项 1：新增检查项。2：新增监控实体及检查项。3：新增监控对象、监控实体、检查项
    formStatus: {
      type: Number,
      default: 1
    },
    metrics: {
      type: Object,
      default: () => {
      }
    },
    endpoints: {
      type: Object,
      default: () => ({
        id: '',
        alias: '',
        metrics: []
      })
    },
    hosts: {
      type: Object,
      default: () => ({
        id: '',
        alias: '',
        endpoints: []
      })
    }
  },
  computed: {
    isVirtual: {
      get () {
        return !this.form.visible
      },
      set (value) {
        this.form.visible = !value
      }
    },
    modalTitle: {
      get () {
        switch (this.formStatus) {
          case 0:
            return '编辑检查项'
          case 1:
            return '新增检查项'
          case 2:
            return '新增监控实体'
          case 3:
            return '新增监控对象'
          default:
            return '新增监控对象'
        }
      }
    }
  },
  created () {
    this.eNew = false
    this.hNew = false
  },
  data () {
    return {
      hNew: false,
      eNew: false,
      tempHe: {
        hostId: '',
        endpointId: ''
      },
      originalMetric: {
        originalMetricId: '',
        originalAnswerId: ''
      },
      pagination: {
        // total: Object.values(this.metrics).length,
        pageSize: 10
      },
      isEditMetric: false,
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
    async editHost () {
      const sts = this.formStatus
      let result
      switch (sts) {
        case 3:
          result = await xungeng.post('host/addHost', this.form)
          break
        case 2:
          result = await xungeng.post('host/addEndpoint', this.form)
          break
        case 1:
          result = await xungeng.post('host/addMetric', this.form)
          break
        case 0:
          result = await xungeng.post('host/editMetric', { ...this.form, ...this.originalMetric })
      }
      if (result.code === 200) {
        this.$notification.success({
          message: '系统提示',
          description: '巡更路径变更成功'
        })
        this.$emit('fresh')
      } else {
        this.$notification.error({
          message: '系统提示',
          description: '操作失败：' + result.msg.toString()
        })
      }
    },
    loadNewHost () {
      this.hNew = true
      this.tempHe.hostId = this.form.hostId
      this.form.hostId = ''
      this.$forceUpdate()
    },
    cancelNewHost () {
      this.hNew = false
      this.form.hostId = this.tempHe.hostId
      this.$forceUpdate()
    },
    loadNewEndpoint () {
      this.eNew = true
      this.tempHe.endpointId = this.form.endpointId
      this.form.endpointId = ''
      this.$forceUpdate()
    },
    cancelNewEndpoint () {
      this.eNew = false
      this.form.endpointId = this.tempHe.endpointId
      this.$forceUpdate()
    },
    handleOk () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const aId = this.metrics[this.form.metricId].answer_id
          this.form.answerId = aId
          this.editHost()
          // this.$emit('update', this.form)
        }
      })
    }
  },
  watch: {
    'form.metricId': {
      handler (newValue, oldValue) {
        if (oldValue !== undefined) {
          this.originalMetric = {
            originalMetricId: oldValue,
            originalAnswerId: this.metrics[oldValue].answer_id
          }
        }
        this.form.answerId = this.metrics[newValue].answer_id
      },
      immediate: true
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
