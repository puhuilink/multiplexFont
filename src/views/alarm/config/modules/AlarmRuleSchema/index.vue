<template>
  <a-modal
    centered
    :title="title"
    :width="670"
    wrapClassName="ViewTitleSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select v-model="formModel.enabled" class="enabled">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="back" :disabled="btnLoading" v-show="!firstStep">上一步</a-button>
      <a-button @click="next" :loading="btnLoading" type="primary">{{ firstStep ? '下一步' : '提交' }}</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">

      <a-steps :current="stepIndex">
        <a-step title="告警基础设置" />
        <a-step title="告警条件设置" />
      </a-steps>

      <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">
        <div v-show="firstStep" class="content">
          <BasicForm :formModel.sync="formModel" />
        </div>

        <div v-show="!firstStep" class="content">
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
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import {
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER,
  CONTENT_TYPE_COUNT,
  AlarmRuleModelFactory
} from './model'
import { AlarmRuleService } from '@/api-hasura'
import BasicForm, { basicFormRules } from './BasicForm'
import RecoverForm, { recoverFormRules } from './RecoverForm'
import UpgradeForm, { upgradeFormRules } from './UpgradeForm'
import MergeForm, { mergeFormRules } from './MergeForm'
import ForwardForm, { forwardFormRules } from './ForwardForm'
import { formItemLayout } from './Mixin'

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
    BasicForm
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
      rule_type: ALARM_RULE_FORWARD
    },
    spinning: false,
    stepIndex: 1,
    btnLoading: false
  }),
  computed: {
    formRules () {
      const { formModel: { rule_type }, firstStep } = this
      return _.cloneDeep(
        firstStep ? basicFormRules : ruleMapping.get(rule_type)
      )
    },
    firstStep () {
      return this.stepIndex === 1
    }
  },
  methods: {
    add () {
      this.show('新建告警规则')
      this.submit = this.insert
    },
    back () {
      this.$refs.ruleForm.clearValidate()
      this.stepIndex--
    },
    edit (id) {
      this.fetch(id)
      this.show('编辑告警规则')
      this.submit = this.update
    },
    async fetch (id) {
      try {
        this.spinning = true
        const model = await AlarmRuleService.detail(id)
        this.formModel = AlarmRuleModelFactory.create(model)
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {
      try {
        this.btnLoading = true
        await AlarmRuleService.add(AlarmRuleModelFactory.serialize(this.formModel))
        this.$emit('addSuccess')
        this.notifyEditSuccess()
        this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    next () {
      if (this.firstStep) {
        this.$refs.ruleForm.validate(passValidate => passValidate && this.nextToSecond())
      } else {
        this.$refs.ruleForm.validate(passValidate => passValidate && this.submit())
      }
    },
    async nextToSecond () {
      try {
        this.btnLoading = true
        await AlarmRuleService.isUniqueConfig(this.formModel)
        this.stepIndex++
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.btnLoading = false
      }
    },
    reset () {
      this.$refs.ruleForm.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async update () {
      try {
        this.btnLoading = true
        console.log(AlarmRuleModelFactory.serialize(this.formModel))
        // TODO: 接口调试
        // const { id } = this.formModel
        // await AlarmRuleService.update(
        //   AlarmRuleModelFactory.serialize(this.formModel),
        //   { id }
        // )
        this.$emit('editSuccess')
        this.$notifyEditSuccess()
        // this.cancel()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="less">
.ViewTitleSchema__modal {
  .content {
    margin-top: 24px;
  }

  .enabled {
    width: 80px;
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
