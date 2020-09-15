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
        <a-select
          class="enabled"
          :style="{ width: '100px' }"
          :disabled="isDetail"
          :value="~~formModel.enabled"
          @select="formModel.enabled = !!$event"
        >
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button @click="cancel">取消</a-button>
      <a-button @click="submit" :loading="submitLoading" type="primary">{{ isEdit ? '提交' : '确定' }}</a-button>
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
          <a-input :disabled="isDetail" v-model.trim="formModel.name" />
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
            >
            </a-form-model-item>
          </a-col>

          <a-col :span="5" :offset="1">
            <p class="ant-form-item">单个采集周期为60秒，持续</p>
          </a-col>

          <a-col :span="3">
            <a-form-model-item
              v-bind="{
                labelCol: { span: 24 }
              }"
              prop="exprs.cycle"
              :rules="[
                { required: true, message: '请输入采集周期' }
              ]"
            >
              <a-input-number :disabled="isDetail" v-model.number="formModel.exprs.cycle" />
            </a-form-model-item>
          </a-col>

          <a-col :span="6">
            <p class="ant-form-item">个采集周期，共计{{ (formModel.exprs.cycle || 0) * 60 }}秒内，</p>
          </a-col>

          <a-col :span="2" :offset="6">
            <p class="ant-form-item">当满足</p>
          </a-col>

          <a-col :span="6">
            <ThresholdConditionSelect
              v-bind="{
                disabled: isDetail,
                labelCol: { span: 0 },
                wrapperCol: { span: 23 }
              }"
              prop="exprs.trigger_condition"
              :rules="[
                { required: true, message: '请选择触发条件' }
              ]"
              v-model="formModel.exprs.trigger_condition"
            />
          </a-col>

          <a-col :span="3">
            <a-form-model-item
              v-bind="{
                labelCol: { span: 24 }
              }"
              prop="exprs.trigger_value"
              :rules="[
                { required: true, message: '请输入触发值' }
              ]"
            >
              <a-input-number :disabled="isDetail" v-model="formModel.exprs.trigger_value" />
            </a-form-model-item>
          </a-col>

          <a-col :span="1">
            <p class="ant-form-item">时</p>
          </a-col>

        </a-row>

        <transition-group
          name="transition-flip"
          tag="div"
          class="AlarmStrategy__modal-opts"
          id="AlarmStrategy__modal-opts"
          ref="opts"
        >
          <a-row
            ref="opt"
            class="transition-flip"
            :gutter="[4, 8]"
            v-for="(opt, index) in formModel.exprs.opts"
            :key="opt.uuid"
          >

            <a-col :span="10">
              <ThresholdOperatorSelect
                v-bind="{
                  disabled: isDetail,
                  labelCol: { span: 12 },
                  wrapperCol: { span: 8, offset: 2 }
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
                :rules="[{ required: true, message: '请输入阈值条件值' }]"
              >
                <a-input-number :disabled="isDetail" v-model="opt.threshold" />
              </a-form-model-item>
            </a-col>

            <a-col :span="5">
              <AlarmLevelSelect
                label="告警级别"
                v-bind="{
                  disabled: isDetail,
                  labelCol: { span: 9 },
                  wrapperCol: { span: 14, offset: 1 }
                }"
                :prop="`exprs.opts.${index}.alarm_level`"
                :rules="[{ required: true, message: '请选择告警级别' }]"
                v-model="opt.alarm_level"
              />
            </a-col>

            <a-col :span="2" :offset="1">
              <a-form-model-item>
                <transition name="transition-scale">
                  <a-button
                    class="transition-scale"
                    v-if="isEdit"
                    v-show="formModel.exprs.opts.length > 1"
                    @click="removeExpressionOpt(index)"
                  >删除</a-button>
                </transition>
              </a-form-model-item>
            </a-col>

          </a-row>
        </transition-group>

        <a-row>
          <a-col :span="4" :offset="11">
            <a-button v-show="isEdit" type="primary" @click="addExpressionOpts">添加</a-button>
          </a-col>
        </a-row>

      </a-form-model>

    </a-spin>

  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { StrategyService } from '@/api-hasura/index'
import { CombineSelect } from '@/components/Resource'
import {
  ThresholdOperatorSelect,
  ThresholdConditionSelect,
  AlarmLevelSelect
} from '~~~/Alarm'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'
import anime from 'animejs'
import _ from 'lodash'
import uuid from 'uuid/v4'

const makeOpt = () => ({
  // 用于为 transition 元素绑定唯一 key
  // TODO: 数据传输时删除该属性
  uuid: uuid(),
  operator: '',
  threshold: '',
  frequency: 0,
  alarm_level: undefined
})

export default {
  name: 'AlarmStrategySchema',
  mixins: [Schema],
  provide () {
    return {
      ctx: this
    }
  },
  components: {
    CombineSelect,
    ThresholdOperatorSelect,
    ThresholdConditionSelect,
    AlarmLevelSelect,
    ComplexSnippet
  },
  props: {},
  data: () => ({
    addBtnLoading: false,
    formModel: {
      deviceType: 'test',
      deviceBrand: '',
      deviceModel: '',
      endpointModelId: '',
      metricModelId: '',
      hostId: [],
      enabled: 1,
      exprs: {
        cycle: 1,
        trigger_condition: '',
        trigger_value: undefined,
        opts: [
          {
            ...makeOpt()
          }
        ]
      }
    },
    // TODO: responsive
    formItemLayout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 }
    },
    isEdit: false,
    isDetail: false,
    spinning: false,
    submitLoading: false
  }),
  computed: {
    editAbleProps () {
      return {
        disabled: !!this.isEdit || this.isDetail
      }
    },
    model () {
      const { exprs, ...rest } = _.cloneDeep(this.formModel)
      exprs.opts = exprs.opts.map(opt => {
        Reflect.deleteProperty(opt, 'uuid')
        return opt
      })
      return {
        ...rest,
        exprs
      }
    }
  },
  methods: {
    add () {
      this.show('新建阈值规则')
      this.submit = this.insert
    },
    addExpressionOpts: _.throttle(async function () {
      const container = this.$refs.opts.$el
      this.formModel.exprs.opts.push({ ...makeOpt() })
      await this.$nextTick()
      if (container.scrollHeight <= 300) {
        return
      }
      anime({
        targets: [container],
        scrollTop: container.scrollHeight,
        duration: 150
      })
    }, 500),
    detail (id) {
      this.fetch(id)
      this.show('查看阈值规则')
      this.submit = this.cancel
      this.isDetail = true
    },
    edit (id) {
      this.fetch(id)
      this.show('编辑阈值规则')
      this.submit = this.update
      this.isEdit = true
    },
    async fetch (id) {
      try {
        this.spinning = true
        const formModel = await StrategyService.detail(id)
        formModel.exprs.opts.forEach(opt => {
          opt['uuid'] = uuid()
        })
        this.formModel = formModel
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
          await StrategyService.add(this.model)
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
    async removeExpressionOpt (index) {
      const container = this.$refs.opts.$el
      // if (container.scrollTop >= 76) {
      //   anime({
      //     targets: [container],
      //     scrollTop: container.scrollTop - 76,
      //     duration: 150
      //   })
      // }
      this.formModel.exprs.opts.splice(index, 1)
      await this.$nextTick()
      console.log(
        container.scrollTop
      )
    },
    update () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        try {
          this.submitLoading = true
          await StrategyService.update(this.model)
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
    position: relative;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;

    .transition-flip {
      background: #fff
    }

    .transition-flip-leave {
    position: absolute;
      z-index: 0;
      // TODO: theme less variables
      background-color: #e6f7ff;
    }

    .transition-flip-leave-to {
      background-color: #e6f7ff;
      width: 100%;
    }

    .transition-flip-enter-to {
      z-index: 1;
      // TODO: theme less variables
      background-color: #e6f7ff;
    }
  }

  .enabled {
    width: 100px;
  }
}
</style>
