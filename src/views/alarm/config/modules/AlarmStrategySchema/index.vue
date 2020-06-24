<template>
  <a-modal
    centered
    :title="title"
    :width="720"
    wrapClassName="AlarmStrategy__modal"
    v-model="visible"
    :afterClose="reset"
  >

    <!-- / 底部按钮 -->
    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select v-model="formModel.enable" class="enable">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">提交</a-button>
    </template>

    <!-- / 正文 -->
    <a-spin :spinning="spinning">
      <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">

        <a-form-model-item label="阈值名称" v-bind="formItemLayout" prop="name">
          <a-input v-model.trim="formModel.name" />
        </a-form-model-item>

      </a-form-model>
    </a-spin>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { StrategyService } from '@/api-hasura/index'
import _ from 'lodash'

export default {
  name: 'AlarmStrategySchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    formModel: {
      enable: 1
    },
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    spinning: false,
    submitLoading: false
  }),
  computed: {
    formRules () {
      return {
        title: [
          { required: true, message: '请输入阈值名称' },
          { max: 50, message: '最多输入50个字符' },
          { pattern: /^[\\Sa-zA-Z0-9\u4e00-\u9fa5]+$/, message: '仅支持中英文与数字' }
        ]
      }
    }
  },
  methods: {
    add () {
      this.show('新建阈值规则')
      this.submit = this.insert
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
  .content {
    margin-top: 24px;
  }

  .enable {
    width: 90px;
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
