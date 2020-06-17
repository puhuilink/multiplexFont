<template>
  <a-modal
    centered
    :title="title"
    :width="720"
    wrapClassName="ViewTitleSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select v-model="formModel.enabled" style="width: 80px">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="back" @disabled="submitLoading" v-show="stepIndex === 2">上一步</a-button>
      <a-button type="primary" :loading="submitLoading" @click="next">{{ stepIndex === 1 ? '下一步' : '提交' }}</a-button>
    </template>

    <a-spin :spinning="spinning">

      <a-steps :current="stepIndex">
        <a-step title="告警基础设置" />
        <a-step title="告警条件设置" />
      </a-steps>

      <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">
        <div v-show="stepIndex === 1" class="ViewTitleSchema__content">
          <BasicForm :formModel="formModel" />
        </div>

        <div v-show="stepIndex === 2" class="ViewTitleSchema__content">
          <component
            :formModel.sync="formModel"
            :is="formComponentMapping.get(formModel.rule_type)"
            v-if="formComponentMapping.get(formModel.rule_type)"
          />
        </div>
      </a-form-model>

    </a-spin>

  </a-modal>
</template>

<script>
import {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
} from '../../typing'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import { AlarmRuleService } from '@/api-hasura'
import BasicForm, { basicFormRules } from './BasicForm'
import RecoverForm, { recoverFormRules } from './RecoverForm'
import UpgradeForm, { upgradeFormRules } from './UpgradeForm'
import MergeForm, { mergeFormRules } from './MergeForm'
import ForwardForm, { forwardFormRules } from './ForwardForm'
import { formItemLayout } from './Mixin'
import { CONTENT_TYPE_COUNT, RuleFactory } from './model'

const ruleMapping = new Map([
  [ALARM_RULE_MERGE, mergeFormRules],
  [ALARM_RULE_UPGRADE, upgradeFormRules],
  [ALARM_RULE_FORWARD, forwardFormRules],
  [ALARM_RULE_RECOVER, recoverFormRules]
])

export default {
  name: 'AlarmRuleSchema',
  mixins: [Schema],
  components: {
    BasicForm,
    RecoverForm,
    UpgradeForm,
    MergeForm,
    ForwardForm
  },
  data: () => ({
    formComponentMapping: new Map([
      [ALARM_RULE_MERGE, MergeForm],
      [ALARM_RULE_UPGRADE, UpgradeForm],
      [ALARM_RULE_FORWARD, ForwardForm],
      [ALARM_RULE_RECOVER, RecoverForm]
    ]),
    formItemLayout,
    formModel: {
      enabled: 1,
      content: {
        type: CONTENT_TYPE_COUNT
      },
      rule_type: ALARM_RULE_UPGRADE
    },
    spinning: false,
    submitLoading: false,
    stepIndex: 1
  }),
  computed: {
    formRules () {
      const { formModel: { rule_type }, stepIndex } = this
      return _.cloneDeep(
        stepIndex === 1
          ? basicFormRules
          : Object.assign({}, basicFormRules, ruleMapping.get(rule_type) || {})
      )
    }
  },
  methods: {
    add () {
      this.show('新建告警规则')
      this.submit = this.insert
    },
    back () {
      this.stepIndex--
      this.$refs.ruleForm.clearValidate()
    },
    edit (id) {
      this.show('编辑告警规则')
      this.submit = this.update
      this.fetch(id)
    },
    async fetch (id) {
      try {
        this.spinning = true
        const model = await AlarmRuleService.detail(id)
        this.formModel = RuleFactory.deSerialization(model)
      } catch (e) {
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {
      try {
        this.submitLoading = true
        await AlarmRuleService.add(RuleFactory.serialize(this.model))
        this.notifyEditSuccess()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.submitLoading = false
      }
    },
    next () {
      if (this.stepIndex === 1) {
        this.$refs.ruleForm.validate(passValidate => passValidate && this.stepIndex++)
      } else {
        this.$refs.ruleForm.validate(passValidate => passValidate && this.submit())
      }
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async update () {
      try {
        this.submitLoading = true
        await AlarmRuleService.update(RuleFactory.serialize(this.model))
        this.notifyEditSuccess()
      } catch (e) {
        this.$notifyEditSuccess(e)
        throw e
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.ViewTitleSchema {
  &__content {
    margin-top: 24px;

    .p {
      text-align: center;
    }

    .inline_input {
      width: 90px;
    }
  }
}
</style>
