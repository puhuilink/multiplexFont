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
          wrapperCol: { span: 1, offset: 1 },
        }"
        label="启用"
        :style="{
          float: 'left',
          width: '300px',
        }"
        v-if="mode === 'personal'"
        class="AlarmStrategy__modal-footer-left"
      >
        <a-select
          class="enabled"
          :style="{ width: '100px' }"
          :disabled="isDetail"
          :value="~~formModel.enabled"
          v-if="mode === 'personal'"
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
          v-if="mode === 'personal'"
          :rules="[{ required: true, message: '请输入规则名称' }, { max: 50, message: '最多输入50个字符' }]"
        >
          <a-input :disabled="isDetail" v-model.trim="formModel.name" />
        </a-form-model-item>

        <ComplexSnippet v-bind="formItemLayout" v-model="formModel" v-if="mode === 'personal'"/>

        <ComplexInput v-if="mode === 'common'" v-bind="formItemLayout" ref="complexInput"></ComplexInput>

        <a-row :gutter="[4, 8]" type="flex" align="middle">
          <a-col :span="5">
            <a-form-model-item
              label="阈值计算条件"
              v-bind="{
                labelCol: { span: 20, offset: 4 },
                wrapperCol: { span: 0 },
              }"
              :rules="[{ required: true, message: '请填写阈值计算条件' }]"
            >
            </a-form-model-item>
          </a-col>

          <a-col :span="5" :offset="1">
            <p class="ant-form-item">单个采集周期为60秒，持续</p>
          </a-col>

          <a-col :span="3">
            <a-form-model-item
              v-bind="{
                labelCol: { span: 24 },
              }"
              prop="exprs.interval"
              :rules="[{ required: true, message: '请输入采集周期' }]"
            >
              <a-input-number :min="1" :disabled="isDetail" v-model.number="formModel.exprs.interval" />
            </a-form-model-item>
          </a-col>

          <a-col :span="6">
            <p class="ant-form-item">个采集周期，共计{{ (formModel.exprs.interval || 0) * 60 }}秒内，</p>
          </a-col>

          <a-col :span="2" :offset="6">
            <p class="ant-form-item">当满足</p>
          </a-col>

          <a-col :span="6">
            <ThresholdConditionSelect
              v-bind="{
                disabled: isDetail,
                labelCol: { span: 0 },
                wrapperCol: { span: 23 },
              }"
              prop="exprs.func"
              :rules="[{ required: true, message: '请选择触发条件' }]"
              v-model="formModel.exprs.func"
            />
          </a-col>

          <a-col :span="3" v-show="formModel.exprs.func === 'happen' " >
            <a-form-model-item
              v-bind="{
                labelCol: { span: 24 },
              }"
              prop="exprs.threshold"
            >
              <a-input-number :disabled="isDetail" v-model="formModel.exprs.threshold" />
            </a-form-model-item>
          </a-col>

          <a-col :span="1">
            <p class="ant-form-item"> {{ formModel.exprs.func === 'happen' ? '次时' :'时' }}</p>
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
                  wrapperCol: { span: 8, offset: 2 },
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
                  optionDisabled: (level) => selectedAlarmLevel.includes(level),
                  labelCol: { span: 9 },
                  wrapperCol: { span: 14, offset: 1 },
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
                    v-if="!isDetail"
                    v-show="formModel.exprs.opts.length > 1"
                    @click="removeExpressionOpt(index)"
                  >删除</a-button
                  >
                </transition>
              </a-form-model-item>
            </a-col>

            <!-- 且 满足发送次数 -->
            <a-col class="alarm-rule-text" :span="24" >

              说明:当指标值 持续 {{ (formModel.exprs.interval || 0) * 60 }} 秒内，
              {{ formatConditionText(formModel.exprs.func ) }}
              {{ formatOperatorText( opt.operator) }}
              <span> {{ formModel.exprs.func === 'happen' ? opt.threshold :'' }} </span>
              <span> {{ formModel.exprs.func === 'happen' ? '且满足' : '' }}  {{ formModel.exprs.func === 'happen' ? formModel.exprs.trigger_value : opt.threshold }}</span>
              <span> {{ formModel.exprs.func === 'happen' ? '次时' :'时' }} </span>
              产生一次告警; 告警级别为 {{ !opt.alarm_level ? ' ' : 'L' + opt.alarm_level }};

            </a-col>

          </a-row>
        </transition-group>

        <a-row>
          <a-col :span="4" :offset="11">
            <a-button
              v-show="!isDetail"
              :disabled="formModel.exprs.opts.length === 10"
              type="primary"
              @click="addExpressionOpts"
            >添加</a-button
            >
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { StrategyService } from '@/api'
import { CombineSelect } from '@/components/Resource'
import { ThresholdOperatorSelect, ThresholdConditionSelect, AlarmLevelSelect } from '~~~/Alarm'
import ComplexSnippet from '@/components/Alarm/ComplexSnippet'
import ComplexInput from '@/components/ComplexInput'
import anime from 'animejs'
import _ from 'lodash'
import uuid from 'uuid/v4'
import { STRATEGY_MODE } from '@/tables/cmdb_strategy/enum'

const makeOpt = () => ({
  // 用于为 transition 元素绑定唯一 key，调取接口时剔除该属性
  uuid: uuid(),
  operator: '',
  threshold: '',
  alarm_level: undefined,
  frequency: 1,
  template: '',
  // TODO
  threshold_str: ''
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
    ComplexSnippet,
    ComplexInput
  },
  props: {
    mode: {
      type: String,
      default: STRATEGY_MODE.personal
    }
  },
  data: () => ({
    addBtnLoading: false,
    inputEle: {
      deviceType: '',
      deviceBrand: '',
      deviceModel: ''
    },
    formModel: {
      deviceType: '',
      deviceBrand: '',
      deviceModel: '',
      endpointModelId: '',
      metricModelId: '',
      hostId: [],
      enabled: 1,
      exprs: {
        interval: 1,
        func: '',
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
    selectedAlarmLevel () {
      const { opts } = this.formModel.exprs
      return opts.map(({ alarm_level }) => alarm_level).filter(Boolean)
    },
    model () {
      const { exprs, ...rest } = _.cloneDeep(this.formModel)
      exprs.opts = exprs.opts.map((opt) => {
        Reflect.deleteProperty(opt, 'uuid')
        return opt
      })
      exprs.interval = (exprs.interval || 0) * 60
      return {
        ...rest,
        exprs
      }
    }
  },

  methods: {
    add () {
      this.show('新建阈值规则')
      // TODO 打开新建菜单的时候重置
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
    modelDetail (id) {
      this.modelFetch(id)
      this.show('查看默认阈值规则')
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
        formModel.exprs.opts.forEach((opt) => {
          opt['uuid'] = uuid()
        })
        formModel.exprs.interval = (formModel.exprs.interval || 0) / 60
        this.formModel = formModel
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async modelFetch (id) {
      try {
        this.spinning = true
        const formModel = await StrategyService.modelFetch(id)
        const { deviceType, deviceBrand, deviceModel } = formModel
        this.inputEle = { deviceType, deviceBrand, deviceModel }
        this.$refs.complexInput.inputEle = this.inputEle
        formModel.exprs.opts.forEach((opt) => {
          opt['uuid'] = uuid()
        })
        formModel.exprs.interval = (formModel.exprs.interval || 0) / 60
        this.formModel = formModel
      } catch (e) {
        this.formModel = this.$options.data.apply(this).formModel
        throw e
      } finally {
        this.spinning = false
      }
    },
    async insert () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        try {
          this.submitLoading = true
          if (_.isEmpty(this.formModel.hostId)) {
            Reflect.deleteProperty(this.formModel, 'hostId')
          }
          const { code, msg } = await StrategyService.add(this.model)
          if (code !== 200) {
            this.$notifyError(msg)
            throw msg
          } else {
            this.$emit('addSuccess')
            this.$notifyAddSuccess()
            this.cancel()
            this.$refs.ruleForm.resetFields()
          }
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
      this.formModel.exprs.opts.splice(index, 1)
    },
    update () {
      this.$refs.ruleForm.validate(async (valid) => {
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
    },
    formatConditionText (val) {
      switch (val) {
        case 'all':
          return '任意一条'
        case 'happen':
          return '全部值中存在'
        case 'max':
          return '最大值'
        case 'min':
          return '最小值'
        case 'avg':
          return '均值'
        case 'sum':
          return '求和'
        case 'diff':
          return '最新值与其之前'
        case 'pdiff':
          return '最新值与其之前'
        default:
          break
      }
    },
    formatOperatorText (val) {
      switch (val) {
        case '=':
          return '等于'
        case '>':
          return '大于'
        case '>=':
          return '大于等于'
        case '<':
          return '小于'
        case '<=':
          return '小于等于'
        default:
          break
      }
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
      background: #fff;
    }

    .transition-flip-leave {
      position: absolute;
      z-index: 0;
      background-color: #e6f7ff;
    }

    .transition-flip-leave-to {
      background-color: #e6f7ff;
      width: 100%;
    }

    .transition-flip-enter-to {
      z-index: 1;
      background-color: #e6f7ff;
    }

    .alarm-rule-text {
     text-align: center;
    }
  }

  .enabled {
    width: 100px;
  }
}
</style>
