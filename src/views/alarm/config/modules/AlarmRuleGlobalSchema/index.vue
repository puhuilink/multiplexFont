<template>
  <a-modal
    centered
    :title="title"
    :width="670"
    wrapClassName="AlarmRuleGlobalSchema__modal"
    v-model="visible"
    :afterClose="reset"
  >
    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item
        v-bind="{
          labelCol: { span: 5 },
          wrapperCol: { span: 17, offset: 1 }
        }"
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
      <a-button @click="update" :loading="btnLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="formModel" v-if="component">
        <component
          v-if="component"
          :formModel="formModel"
          :is="component"
        />
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import RecoverForm from '../AlarmRuleSchema/RecoverForm'
import UpgradeForm from '../AlarmRuleSchema/UpgradeForm'
import MergeForm from '../AlarmRuleSchema/MergeForm'
import { AlarmRuleService } from '@/api-hasura'
import { AlarmRuleModelFactory } from '../AlarmRuleSchema/model'

export default {
  name: 'AlarmRuleGlobalSchema',
  mixins: [Schema],
  components: {
    RecoverForm,
    UpgradeForm,
    MergeForm
  },
  props: {},
  data: () => ({
    btnLoading: false,
    formModel: {},
    spinning: false
  }),
  computed: {
    component () {
      const { ruleType = [] } = this.formModel
      switch (ruleType[0]) {
        case 'merge': return MergeForm
        case 'recover': return RecoverForm
        case 'upgrade': return UpgradeForm
        default: return null
      }
    }
  },
  methods: {
    edit (ruleType) {
      this.show('编辑全局告警规则')
      this.fetch(ruleType)
    },
    async fetch (ruleType) {
      try {
        this.spinning = true
        const model = await AlarmRuleService.global(ruleType)
        this.formModel = AlarmRuleModelFactory.create(model)
      } catch (e) {
        throw e
      } finally {
        this.spinning = false
      }
    },
    update () {
      const {
        $refs: { ruleForm }
      } = this
      if (!ruleForm) {
        this.cancel()
        return
      }
      ruleForm.validate(async passValidate => {
        if (!passValidate) return
        try {
          this.btnLoading = true
          const model = AlarmRuleModelFactory.serialize(this.formModel)
          await AlarmRuleService.update(model)
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less">
.AlarmRuleGlobalSchema__modal {
  .enabled {
    width: 100px;
  }
}
</style>
