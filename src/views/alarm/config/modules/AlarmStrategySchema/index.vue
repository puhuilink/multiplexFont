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
        v-bind="formItemLayout"
        label="启用"
        class="fl"
      >
        <a-select class="enabled">
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
            { pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/, message: '仅支持中英文与数字' }
          ]"
        >
          <a-input v-model.trim="formModel.name" />
        </a-form-model-item>

        <ComplexSnippet v-bind="formItemLayout" v-model="formModel" />

      </a-form-model>

      <a-form-model :model="formModel" layout="inline" v-bind="nestedFormItemLayout">
        <div>
          <a-form-model-item
            label="阈值计算条件"
            :rules="[
              { required: true, message: '请填写阈值计算条件' }
            ]"
            prop="test"
          >
            <span>单个采集周期为60秒，持续</span>
            <span>个采集周期，共计120秒内，当满足</span>
            <ThresholdConditionSelect />
            <span>时</span>
          </a-form-model-item>
        </div>

        <div
          v-for="(opt, index) in formModel.exprs.opts"
          :key="index"
          ref="opts"
        >

          <ThresholdOperatorSelect
            label="阈值条件"
            v-model="opt.operator"
            :rules="[{ required: true, message: '123' }]"
          />

          <a-form-model-item
            :prop="`exprs.opts.${index}`.threshold"
            :rules="[{ required: true, message: '123' }]"
          >
            <a-input-number v-model="opt.threshold" />
          </a-form-model-item>

          <AlarmLevelSelect />

          <a-form-model-item>
            <a-button
              v-show="formModel.exprs.opts.length > 1"
              @click="removeExpressionOpt(index)"
            >删除</a-button>
          </a-form-model-item>
        </div>

        <a-row justify="center" type="flex">
          <a-col>
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
import _ from 'lodash'
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
    nestedFormItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 13, offset: 1 }
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
        const { data: { strategyList } } = await StrategyService.find({
          where: { id },
          fields: ['name', 'host_id', 'metric_id', 'endpoint_id', 'exprs', 'enable'],
          alias: 'strategyList'
        })
        this.formModel = _.first(strategyList)
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {
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
    },
    removeExpressionOpt (index) {
      this.formModel.exprs.opts.splice(index, 1)
    },
    async update () {
      try {
        this.submitLoading = true
        await StrategyService.update(this.formModel, { id: this.formModel.id })
        this.$emit('editSuccess')
        this.$notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.AlarmStrategy__modal {
  &-opts {
    // height: 300px;
    // overflow: auto;
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
