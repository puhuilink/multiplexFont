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
      <a-form-model-item
        v-bind="formItemLayout"
        label="启用"
        class="fl"
        prop="enabled"
      >
        <a-select v-model="formModel.enabled" class="enabled">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="back" :disabled="btnLoading" v-show="!firstStep">上一步</a-button>
      <a-button @click="next" :loading="btnLoading" type="primary" :disabled="!isSubmit">{{ lastStep ? '提交' : '下一步' }}</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">

      <a-steps :current="stepIndex">
        <a-step title="告警基础设置" />
        <a-step v-for="(t,index) in formModel.ruleType" :key="index" :title="titleMapping[t]"/>
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
              :ruleType="ruleType"
              v-if="isCurrent(type)"
              :is="component"
              :formModel.sync="formModel"
              :isEdit="isEdit"
              :isAdd="isAdd"
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
import { AlarmRuleService } from '@/api'
import BasicForm from './BasicForm'
import RecoverForm from './RecoverForm'
import UpgradeForm from './UpgradeForm'
import MergeForm from './MergeForm'
import ForwardForm from './ForwardForm'
import { formItemLayout } from './Mixin'
import _ from 'lodash'

export default {
  name: 'AlarmRuleSchema',
  mixins: [Schema],
  components: {
    BasicForm,
    MergeForm,
    UpgradeForm,
    RecoverForm,
    ForwardForm
  },
  props: {
    ruleType: {
      type: Array,
      default: () => ['merge', 'upgrade', 'recover', 'forward']
    }
  },
  data: () => ({
    btnLoading: false,
    componentMapping: new Map([
      ['basic', BasicForm],
      ['merge', MergeForm],
      ['upgrade', UpgradeForm],
      ['recover', RecoverForm],
      ['forward', ForwardForm]
    ]),
    titleMapping: {
      'merge': '告警合并',
      'upgrade': '告警升级',
      'recover': '告警消除',
      'forward': '告警通知'
    },
    formItemLayout,
    formModel: AlarmRuleModelFactory.create({}),
    isEdit: false,
    isAdd: false,
    ruleTypeMapping,
    spinning: false,
    stepIndex: 0
  }),
  computed: {
    currentRuleType () {
      if (this.stepIndex === 0) {
        return ''
      } else {
        return this.formModel.ruleType[this.stepIndex - 1]
      }
    },
    isSubmit () {
      return this.formModel.ruleType.includes('merge') || this.formModel.ruleType.includes('upgrade') || this.formModel.ruleType.includes('recover') || this.formModel.ruleType.includes('forward')
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
    /**
     * @param {String[]} ruleType 要新增的规则类型
     */
    add (ruleType = []) {
      this.show('新建告警规则')
      this.formModel = AlarmRuleModelFactory.create()
      this.submit = this.insert
      this.isEdit = false
      this.isAdd = true
      this.formModel = AlarmRuleModelFactory.create({ ruleType })
    },
    back () {
      this.$refs.ruleForm.clearValidate()
      this.stepIndex--
    },
    edit (id) {
      this.fetch(id)
      this.show('编辑告警规则')
      this.submit = this.update
      this.isEdit = true
      this.isAdd = false
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
        if (_.isEmpty(this.formModel.hostId)) {
          Reflect.deleteProperty(this.formModel, 'hostId')
        }
        await AlarmRuleService.add(AlarmRuleModelFactory.serialize(this.formModel))
        this.$emit('addSuccess')
        this.$notifyAddSuccess()
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
    reset () {
      this.$refs.ruleForm.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    async update () {
      try {
        this.btnLoading = true
        await AlarmRuleService.update(
          AlarmRuleModelFactory.serialize(this.formModel)
        )
        this.$emit('editSuccess')
        this.$notifyEditSuccess()
        this.cancel()
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
    width: 80px;
  }
}
</style>
