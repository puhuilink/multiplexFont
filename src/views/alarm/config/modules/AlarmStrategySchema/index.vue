<template>
  <a-modal
    centered
    :title="title"
    :width="920"
    wrapClassName="AlarmStrategy__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item
        v-bind="{
          labelCol: { span: 4 },
          wrapperCol: { span: 1, offset: 1 }
        }"
        label="启用"
        :style="{
          float: 'left',
          width: '300px'
        }"
        class="AlarmStrategy__modal-footer-left"
      >
        <a-select class="enabled" :style="{ width: '100px' }" v-model="formModel.enable">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="formModel">

        <a-form-model-item
          label="阈值名称"
          v-bind="formItemLayout"
          prop="name"
          :rules="[
            { required: true, message: '请输入规则名称' },
            { max: 50, message: '最多输入50个字符' },
          ]"
        >
          <a-input v-model.trim="formModel.name" />
        </a-form-model-item>

        <ComplexSnippet v-bind="formItemLayout" v-model="formModel" />
        <a-row :gutter="[4, 8]" type="flex" align="middle">

          <a-col :span="5">
            <a-form-model-item
              label="阈值计算条件"
              v-bind="{
                labelCol: { span: 20, offset: 4 },
                wrapperCol: { span: 0 }
              }"
              :rules="[
                { required: true, message: '请填写阈值计算条件' }
              ]"
              prop="test"
            >
            </a-form-model-item>
          </a-col>

          <a-col :span="11" :offset="1">
            <span>单个采集周期为60秒，持续</span>
            <span>个采集周期，共计120秒内，当满足</span>
          </a-col>

          <a-col :span="4">
            <ThresholdConditionSelect
              v-bind="{
                labelCol: { span: 4 },
                wrapperCol: { span: 7 }
              }"
            />
          </a-col>

          <a-col :span="1">
            <span>时</span>
          </a-col>

        </a-row>

        <div class="AlarmStrategy__modal-opts">
          <a-row
            :gutter="[4, 8]"
            v-for="(opt, index) in formModel.exprs.opts"
            :key="index"
            ref="opts"
          >

            <a-col :span="9">
              <ThresholdOperatorSelect
                v-bind="{
                  labelCol: { span: 13 },
                  wrapperCol: { span: 8, offset: 3 }
                }"
                label="阈值条件"
                :rules="[{ required: true, message: '请选择阈值条件' }]"
                :prop="`exprs.opts.${index}.operator`"
                v-model="opt.operator"
              />
            </a-col>

            <a-col :span="4">
              <a-form-model-item
                :prop="`exprs.opts.${index}.threshold`"
                :rules="[{ required: true, message: '请选择阈值条件值' }]"
              >
                <a-input-number v-model="opt.threshold" />
              </a-form-model-item>
            </a-col>

            <a-col :span="7">
              <AlarmLevelSelect
                label="告警级别"
                v-bind="{
                  labelCol: { span: 14 },
                  wrapperCol: { span: 10 }
                }"
                :prop="`exprs.opts.${index}.alarm_level`"
                :rules="[{ required: true, message: '请选择告警级别' }]"
                v-model="opt.alarm_level"
              />
            </a-col>

            <a-col :span="2" :offset="1">
              <a-form-model-item>
                <a-button
                  v-show="formModel.exprs.opts.length > 1"
                  @click="removeExpressionOpt(index)"
                >删除</a-button>
              </a-form-model-item>
            </a-col>

          </a-row>

        </div>
        <a-row>
          <a-col :span="4" :offset="10">
            <a-button type="primary" @click="addExpressionOpts">添加</a-button>
          </a-col>
        </a-row>

      </a-form-model>

    </a-spin>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { StrategyService } from '@/api-hasura/index'
// import _ from 'lodash'
import { scrollTo } from '@/utils/util'
import { CombineSelect } from '@/components/Resource'
import {
  ThresholdOperatorSelect,
  ThresholdConditionSelect,
  AlarmLevelSelect
} from '~~~/Alarm'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'

const defaultOpt = {
  operator: '',
  threshold: '',
  frequency: 0,
  alarm_level: ''
}

export default {
  name: 'AlarmStrategySchema',
  mixins: [Schema],
  components: {
    CombineSelect,
    ThresholdOperatorSelect,
    ThresholdConditionSelect,
    AlarmLevelSelect,
    ComplexSnippet
  },
  props: {},
  data: () => ({
    formModel: {
      enable: 1,
      exprs: {
        opts: [
          {
            ...defaultOpt
          }
        ]
      }
    },
    // TODO: responsive
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    spinning: false,
    submitLoading: false
  }),
  computed: {},
  methods: {
    add () {
      this.show('新建阈值规则')
      this.submit = this.insert
    },
    async addExpressionOpts () {
      this.formModel.exprs.opts.push({ ...defaultOpt })
      await this.$nextTick()
      scrollTo(this.$refs.opts.scrollHeight, { getContainer: () => this.$refs.opts })
    },
    edit (id) {
      this.fetch(id)
      this.show('编辑阈值规则')
      this.submit = this.update
    },
    async fetch (id) {
      try {
        this.spinning = true
        this.formModel = await StrategyService.detail(id)
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        try {
          this.submitLoading = true
          await StrategyService.add(this.formModel)
          this.$emit('addSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    removeExpressionOpt (index) {
      this.formModel.exprs.opts.splice(index, 1)
    },
    update () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        try {
          this.submitLoading = true
          await StrategyService.update(this.formModel)
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.submitLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less">
.AlarmStrategy__modal {

  &-opts {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content {
    margin-top: 24px;
  }

  .enable {
    width: 100px;
  }

  .p {
    text-align: center;
  }

  .inline_input {
    display: inline-block;
    width: 120px;
  }
}
</style>
