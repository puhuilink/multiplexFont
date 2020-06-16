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

    <a-steps :current="stepIndex">
      <a-step title="告警基础设置" />
      <a-step title="告警条件设置" />
    </a-steps>

    <a-form-model ref="ruleForm" :model="formModel" :rules="formRules">
      <div v-show="stepIndex === 1" class="ViewTitleSchema__content">
        <a-form-model-item label="规则名称" v-bind="formItemLayout" prop="title">
          <a-input v-model.trim="formModel.title" />
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

        <a-form-model-item label="规则类型" v-bind="formItemLayout" prop="rule_type">
          <a-select v-model="formModel.rule_type">
            <a-select-option
              v-for="(label, value) in ruleType"
              :key="value"
              :value="value"
            >{{ label }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>

      <div v-show="stepIndex === 2" class="ViewTitleSchema__content">
        <!-- 告警合并 -->
        <template v-if="formModel.rule_type === ALARM_RULE_MERGE">
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
        <template v-if="formModel.rule_type === ALARM_RULE_UPGRADE">
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
        <template v-if="formModel.rule_type === ALARM_RULE_FORWARD">
          <a-card>
            <a-icon class="fr" type="close-circle" />
            <a-form-model-item label="通知等级" v-bind="formItemLayout">
              <a-select>
                <a-select-option value="first">一级</a-select-option>
                <a-select-option value="second">二级</a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="前转用户" v-bind="formItemLayout">
              <a-select
                allowClear
                :filterOption="filterOption"
                mode="multiple"
                :notFoundContent="userListLoading ? '加载中...' : '暂无数据'"
                showSearch
              >
                <a-select-option
                  v-for="{ user_id, staff_name } in userList"
                  :key="user_id"
                  :value="user_id">{{ staff_name }}</a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="启用" v-bind="formItemLayout">
              <a-select>
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-card>

          <a-button type="primary">添加+</a-button>
        </template>

        <!-- 告警消除 -->
        <template v-if="formModel.rule_type === ALARM_RULE_RECOVER">
          <p>
            告警消除时间范围
            <a-input type="number" :min="1" class="inline_input" />
            分钟内，依次接收
            <a-input type="number" :min="1" class="inline_input" />
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
import _ from 'lodash'
import { AlarmRuleService, UserService } from '@/api-hasura'
import { filterOption } from '@/utils/util'

const basicFormRules = {
  title: [
    { required: true, message: '请输入规则名称' }
  ],
  rule_type: [
    { required: true, message: '请选择规则类型' }
  ]
}

const mergeFormRules = {}
const upgradeFormRules = {}
const forwardFormRules = {}
const recoverFormRules = {}

const ruleMapping = new Map([
  [ALARM_RULE_MERGE, mergeFormRules],
  [ALARM_RULE_UPGRADE, upgradeFormRules],
  [ALARM_RULE_FORWARD, forwardFormRules],
  [ALARM_RULE_RECOVER, recoverFormRules]
])

export default {
  name: 'AlarmRuleSchema',
  mixins: [Schema],
  data: () => ({
    ALARM_RULE_MERGE,
    ALARM_RULE_UPGRADE,
    ALARM_RULE_FORWARD,
    ALARM_RULE_RECOVER,
    formItemLayout: Object.freeze({
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 }
    }),
    formModel: {
      enabled: 1
    },
    ruleType: Object.freeze(
      Object.fromEntries(ruleTypeMapping)
    ),
    submitLoading: false,
    stepIndex: 1,
    userList: [],
    userListLoading: false
  }),
  computed: {
    formRules () {
      const { formModel: { rule_type } } = this
      return _.cloneDeep(
        Object.assign({}, basicFormRules, ruleMapping.get(rule_type) || {})
      )
    }
  },
  methods: {
    add () {
      this.show('新建告警规则')
      // this.submit = this.insert()
    },
    back () {
      this.stepIndex--
    },
    edit (record) {
      this.show('编辑告警规则')
      this.formModel = _.cloneDeep(record)
    },
    async fetchUserList () {
      try {
        this.userListLoading = true
        const { data: { userList } } = await UserService
          .find({
            where: { flag: 1 },
            fields: ['user_id', 'staff_name'],
            alias: 'userList'
          })
        this.userList = userList
      } catch (e) {
        this.userList = []
        throw e
      } finally {
        this.userListLoading = false
      }
    },
    filterOption,
    async insert () {
      try {
        // TODO: _.pick
        this.submitLoading = true
        await AlarmRuleService.add(this.formModel)
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
        this.$refs.ruleForm.validate(passValidate => {
          if (passValidate) {
            this.stepIndex++
            this.formModel.rule_type === ALARM_RULE_FORWARD && this.fetchUserList()
          }
        })
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
        // TODO: _.pick
        this.submitLoading = true
        await AlarmRuleService.update(this.formModel)
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

    .inline_input {
      width: 90px;
    }
  }
}
</style>
