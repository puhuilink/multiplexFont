<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    :width="720"
    wrapClassName="ViewTitleSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    @ok="submit"
  >

    <template slot="footer">
      <a-form-model-item label="启用" v-bind="formItemLayout" class="fl">
        <a-select :defaultValue="1" style="width: 80px">
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-button key="back" @click="cancel">取消</a-button>
      <a-button @click="back" v-show="stepIndex === 2">上一步</a-button>
      <a-button key="submit" type="primary" @click="next">{{ stepIndex === 1 ? '下一步' : '提交' }}</a-button>
    </template>

    <a-steps :current="stepIndex">
      <a-step title="告警基础设置" />
      <a-step title="告警条件设置" />
    </a-steps>

    <a-form-model :form="form">
      <div v-show="stepIndex === 1" class="ViewTitleSchema__content">
        <a-form-model-item label="规则名称" v-bind="formItemLayout">
          <a-input v-model.trim="values.title" />
        </a-form-model-item>

        <a-form-model-item label="数据域" v-bind="formItemLayout">
          <a-input />
        </a-form-model-item>

        <a-form-model-item label="设备名称" v-bind="formItemLayout">
          <a-input />
        </a-form-model-item>

        <a-form-model-item label="监控实体" v-bind="formItemLayout">
          <a-input />
        </a-form-model-item>

        <a-form-model-item label="检查项" v-bind="formItemLayout">
          <a-input />
        </a-form-model-item>

        <a-form-model-item label="规则类型" v-bind="formItemLayout">
          <a-select v-model="values.rule_type">
            <a-select-option
              v-for="(label, value) in ruleType"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <div v-show="stepIndex === 2">
        <!-- 告警合并 -->
        <template v-if="values.rule_type === ALARM_RULE_MERGE">
          <a-form-model-item label="合并方式" v-bind="formItemLayout">
            <a-select>
              <a-select-option value="count">次数</a-select-option>
              <a-select-option value="time">时间</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="最大合并次数" v-bind="formItemLayout">
            <a-input type="number" :min="1" suffix="次" />
          </a-form-model-item>

          <a-form-model-item label="合并时间" v-bind="formItemLayout">
            <a-input type="number" :min="1" suffix="分钟" />
          </a-form-model-item>
        </template>

        <!-- 告警升级 -->
        <template v-if="values.rule_type === ALARM_RULE_UPGRADE">
          <a-form-model-item label="升级方式" v-bind="formItemLayout">
            <a-select>
              <a-select-option value="count">次数</a-select-option>
              <a-select-option value="time">时间</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="最大合并次数" v-bind="formItemLayout">
            <a-input type="number" :min="1" suffix="次" />
          </a-form-model-item>

          <a-form-model-item label="合并时间" v-bind="formItemLayout">
            <a-input type="number" :min="1" suffix="分钟" />
          </a-form-model-item>
        </template>

        <!-- 告警通知 -->
        <template v-if="values.rule_type === ALARM_RULE_FORWARD">
          TODO
        </template>

        <!-- 告警消除 -->
        <template v-if="values.rule_type === ALARM_RULE_RECOVER">
          <p>
            告警消除时间范围
            <a-input type="number" :min="1" />
            分钟内，依次接收
            <a-input type="number" :min="1"/>
            条正常数据
          </p>
        </template>
      </div>
    </a-form-model>

  </a-modal>
</template>

<script>
import {
  ruleTypeMapping,
  ALARM_RULE_MERGE,
  ALARM_RULE_UPGRADE,
  ALARM_RULE_FORWARD,
  ALARM_RULE_RECOVER
} from '../typing'
import Schema from '@/components/Mixins/Modal/Schema'

export default {
  name: 'AlarmRuleSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    ALARM_RULE_MERGE,
    ALARM_RULE_UPGRADE,
    ALARM_RULE_FORWARD,
    ALARM_RULE_RECOVER,
    formItemLayout: Object.freeze({
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 }
    }),
    ruleType: Object.freeze(
      Object.fromEntries(ruleTypeMapping)
    ),
    stepIndex: 1,
    values: {}
  }),
  computed: {},
  methods: {
    add () {
      this.show('新建告警规则')
    },
    back () {
      this.stepIndex--
    },
    next () {
      this.stepIndex++
      // const { form, stepIndex } = this
      // if (stepIndex === 1) {
      //   form.validateFields(err => {
      //     if (!err) this.stepIndex++
      //   })
      // } else {

      // }
    }
  }
}
</script>

<style lang="less">
.ViewTitleSchema {
  &__content {
    margin-top: 24px;
  }
}
</style>
