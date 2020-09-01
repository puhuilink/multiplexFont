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

        <!-- / 阈值名称 -->
        <a-form-model-item label="阈值名称" v-bind="formItemLayout" prop="name">
          <a-input v-model.trim="formModel.name" />
        </a-form-model-item>

        <CombineSelect v-bind="formItemLayout" />

        <!-- / 阈值计算条件 -->
        <a-form-model-item label="阈值计算条件" v-bind="formItemLayout">
          <ThresholdConditionSelect v-bind="formItemLayout" />
        </a-form-model-item>

        <!-- / 阈值条件 -->
        <div class="AlarmStrategy__modal-opts" ref="opts">
          <a-row
            class="ant-form-item"
            v-for="(opt, index) in formModel.exprs.opts"
            :key="index"
          >

            <a-col v-bind="formItemLayout.labelCol" class="ant-form-item-label">
              <label title="阈值条件">阈值条件</label>
            </a-col>

            <a-col v-bind="formItemLayout.wrapperCol">
              <a-row>
                <a-col :span="8">
                  <ThresholdOperatorSelect
                    class="fw"
                    v-bind="nestedFormItemLayout"
                    v-model="opt.operator"
                  />
                </a-col>

                <a-col :span="5">
                  <a-form-model-item v-bind="nestedFormItemLayout">
                    <a-input-number v-model="opt.threshold" />
                  </a-form-model-item>
                </a-col>

                <a-col :span="9">
                  <a-form-model-item label="告警级别" v-bind="nestedFormItemLayout">
                    <a-select
                      class="fw"
                      v-model="opt.alarm_level"
                    >
                      <a-select-option
                        v-for="level in [1, 2, 3, 4, 5]"
                        :key="level"
                        :value="level"
                      >{{ `L${level}` }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :span="2">
                  <a-form-model-item>
                    <a-button
                      v-show="formModel.exprs.opts.length > 1"
                      @click="removeExpressionOpt(index)"
                    >删除</a-button>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>

          </a-row>
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
import { ThresholdOperatorSelect, ThresholdConditionSelect } from '@/components/Alarm/Threshold'

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
    ThresholdConditionSelect
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
      labelCol: { span: 8 },
      wrapperCol: { span: 13, offset: 2 }
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
  &-opts{
    height: 300px;
    overflow: auto;
  }

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
