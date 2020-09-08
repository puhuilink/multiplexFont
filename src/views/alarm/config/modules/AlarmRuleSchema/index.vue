<template>
  <a-modal
    centered
    :title="title"
    :width="670"
    wrapClassName="AlarmRuleSchema__modal"
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
      <a-button @click="next" :loading="btnLoading" type="primary">{{ lastStep ? '提交' : '下一步' }}</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">

      <a-steps :current="stepIndex">
        <a-step title="告警基础设置" />
        <a-step title="告警合并" v-if="formModel.ruleType.includes('merge')" />
        <a-step title="告警升级" v-if="formModel.ruleType.includes('upgrade')" />
        <a-step title="告警消除" v-if="formModel.ruleType.includes('recover')" />
      </a-steps>

      <a-form-model
        ref="ruleForm"
        :model="formModel"
      >

        <transition-group>
          <div
            v-for="[type, component] in componentMapping"
            :key="type"
            class="AlarmRuleSchema__modal-content"
          >
            <component
              v-if="isCurrent(type)"
              :is="component"
              :formModel.sync="formModel"
            />
          </div>
        </transition-group>

      </a-form-model>

    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import {
  AlarmRuleModelFactory,
  ruleTypeMapping
} from './model'
import { AlarmRuleService } from '@/api-hasura'
import BasicForm from './BasicForm'
import RecoverForm from './RecoverForm'
import UpgradeForm from './UpgradeForm'
import MergeForm from './MergeForm'
import { formItemLayout } from './Mixin'

export default {
  name: 'AlarmRuleSchema',
  mixins: [Schema],
  components: {
    BasicForm,
    MergeForm,
    UpgradeForm,
    RecoverForm
  },
  data: () => ({
    componentMapping: new Map([
      ['basic', BasicForm],
      ['merge', MergeForm],
      ['upgrade', UpgradeForm],
      ['recover', RecoverForm]
    ]),
    formItemLayout,
    formModel: AlarmRuleModelFactory.create({}),
    ruleTypeMapping,
    spinning: false,
    stepIndex: 0,
    btnLoading: false
  }),
  computed: {
    currentRuleType () {
      if (this.stepIndex === 0) {
        return ''
      } else {
        return this.formModel.ruleType[this.stepIndex - 1]
      }
    },
    firstStep () {
      return this.stepIndex === 0
    },
    lastStep () {
      const {
        formModel: { ruleType: { length } },
        firstStep,
        stepIndex
      } = this
      return !firstStep && stepIndex === length
    }
  },
  methods: {
    isCurrent (type) {
      if (type === 'basic') {
        return this.stepIndex === 0
      } else {
        return this.formModel.ruleType[this.stepIndex - 1] === type
      }
    },
    hasType (type) {
      if (type === 'basic') return true
      return this.formModel.ruleType.includes(type)
    },
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
      const {
        lastStep,
        $refs: { ruleForm }
      } = this

      ruleForm.validate(passValidate => {
        if (!passValidate) return
        if (lastStep) {
          this.submit()
        } else {
          this.stepIndex++
        }
      })
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
.AlarmRuleSchema__modal {
  &-content {
    margin-top: 24px;
  }

  .enabled {
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
