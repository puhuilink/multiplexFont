<template>
  <a-modal
    title="监控对象"
    wrapClassName="HostSchema"
    :visible="visible"
    @change="$emit('update:visible', $event)"
    @ok="handleOk"
  >
    <div>巡更点位: {{ xgModelPoint }}</div>
    <a-form-model ref="ruleForm" :model="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-form-model-item
        label="监控对象"
        prop="modalEndpointId"
        :rules="[{ required: true, message: '请输入监控对象' }]"
      >
        <a-input placeholder="请输入监控对象" v-model="form.modalEndpointId" />
      </a-form-model-item>

      <div class="HostSchema__content" ref="content">
        <div class="tablesStyle" v-for="(item, index) in form.shareParams" :key="index">
          <a-form-model-item
            label="监控实体"
            style="margin-bottom: 0"
            :prop="`shareParams.${index}.modelMetrics`"
            :rules="[{ required: true, message: '请输入监控实体' }]"
          >
            <a-input placeholder="请输入监控实体" v-model="item.modelMetrics" />
          </a-form-model-item>

          <a-form-model-item
            label="检查项"
            style="margin-bottom: 0"
            :prop="`shareParams.${index}.modalCheck`"
            :rules="[{ required: true, message: '检查项不能为空' }]"
          >
            <a-select v-model="item.modalCheck" placeholder="检查项不能为空">
              <a-select-option value="value1"> 运行状态 </a-select-option>
              <a-select-option value="value2"> 有无状态 </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="检查值" style="margin-bottom: 0">
            <a-form-model-item
              :prop="`shareParams.${index}.modalCheckValue`"
              :style="{
                display: 'inline-block',
                width: '100px',
                marginBottom: 0,
              }"
              :rules="[{ required: true, message: '检查值不能为空' }]"
            >
              <a-select v-model="item.modalCheckValue">
                <a-select-option value="value4"> 运行状态 </a-select-option>
                <a-select-option value="value5"> 有无状态 </a-select-option>
              </a-select>
            </a-form-model-item>

            <span> 或值</span>

            <a-form-model-item
              :prop="`shareParams.${index}.modalCheckId`"
              :style="{
                display: 'inline-block',
                width: '100px',
                marginBottom: 0,
              }"
              :rules="[{ required: true, message: '检查值不能为空' }]"
            >
              <a-select v-model="item.modalCheckId">
                <a-select-option value="value6"> 运行状态 </a-select-option>
                <a-select-option value="value7"> 有无状态 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model-item>

          <a-form-model-item label="则需异常告警" style="margin-bottom: 0">
            <a-form-model-item
              :prop="`shareParams.${index}.modalWarning`"
              :style="{
                display: 'inline-block',
                width: '100px',
                marginBottom: 0,
              }"
              :rules="[{ required: true, message: '检查值不能为空' }]"
            >
              <a-input placeholder="请输入监控对象" v-model="item.modalWarning" />
            </a-form-model-item>

            <span> - - </span>

            <a-form-model-item
              :prop="`shareParams.${index}.modalAbnormal`"
              :style="{
                display: 'inline-block',
                width: '100px',
                marginBottom: 0,
              }"
              :rules="[{ required: true, message: '检查值不能为空' }]"
            >
              <a-input placeholder="请输入监控对象" v-model="item.modalAbnormal" />
            </a-form-model-item>
          </a-form-model-item>

          <a-form-model-item
            label="告警级别"
            style="margin-bottom: 0"
            :prop="`shareParams.${index}.modalWarningLevel`"
            :rules="[{ required: true, message: '告警级别不能为空' }]"
          >
            <a-select v-model="item.modalWarningLevel">
              <a-select-option value="value8"> 运行状态 </a-select-option>
              <a-select-option value="value9"> 有无状态 </a-select-option>
            </a-select>
          </a-form-model-item>

          <div class="HostSchema__btn-remove" v-show="form.shareParams.length > 1">
            <a-button type="primary" @click="removeParam(index)"> 删除 </a-button>
          </div>
        </div>

      </div>
    </a-form-model>

    <div class="HostSchema__btn_group">
      <a-button type="primary" @click="addShareTable"> 添加 </a-button>
    </div>
  </a-modal>
</template>

<script>
import { scrollTo } from '@/utils/util'

export default {
  name: 'HostSchema',
  mixins: [],
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({
        modalEndpointId: '',
        shareParams: [
          {
            modelMetrics: '',
            modalCheck: '',
            modalCheckValue: '',
            modalCheckId: '',
            modalWarning: '',
            modalAbnormal: '',
            modalWarningLevel: ''
          }
        ]
      })
    },
    xgModelPoint: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
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
  computed: {},
  methods: {
    addShareTable () {
      this.form.shareParams.push({
        modelMetrics: '',
        modalCheck: '',
        modalCheckValue: '',
        modalCheckId: '',
        modalWarning: '',
        modalAbnormal: '',
        modalWarningLevel: ''
      })
      this.$nextTick(() => {
        scrollTo(this.$refs.content.scrollHeight, { getContainer: () => this.$refs.content })
      })
    },
    handleOk () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('update', this.form)
        }
      })
    },

    removeParam (index) {
      this.form.shareParams.splice(index, 1)
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
