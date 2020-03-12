/*
 * 告警规则：编辑/新建
 */
<template>
  <a-modal
    :title="mode=='New'?'新增':mode=='See'?'详情':'编辑'"
    :footer="null"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    :destroyOnClose="true"
    @cancel="handleCancel"
  >
    <a-steps class="steps" :current="currentTab">
      <a-step title="基础设置" />
      <a-step title="规则条件设置" />
      <a-step title="规则条件高级设置" />
      <a-step v-if="ruleType === 'alert-classify'" title="告警分类设置" />
      <a-step v-if="ruleType === 'alert-merge'" title="告警合并设置" />
      <a-step v-if="ruleType === 'alert-relate'" title="影响告警设置" />
      <a-step v-if="ruleType === 'alert-upgrade'" title="告警升级设置" />
      <a-step v-if="ruleType === 'alert-recover'" title="告警恢复设置" />
    </a-steps>

    <div class="content">
      <step1 v-show="currentTab === 0" @nextStep="nextStep" :record="record" />
      <step2 v-show="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" :record="record"/>
      <step3
        v-show="currentTab === 2"
        @nextStep="nextStep"
        @prevStep="prevStep"
        :record="record"
        :nodeType="formData.node_type"
        :ruleType="ruleType"
      />

      <classify
        v-if="currentTab === 3 && ruleType === 'alert-classify'"
        @prevStep="prevStep"
        @handleSubmit="handleSubmit"
        :record="record"
      />
      <merger
        v-if="currentTab === 3 && ruleType === 'alert-merge'"
        @prevStep="prevStep"
        @handleSubmit="handleSubmit"
        :record="record"
      />
      <relate
        v-if="currentTab === 3 && ruleType === 'alert-relate'"
        @prevStep="prevStep"
        @handleSubmit="handleSubmit"
        :record="record"
      />
      <upgrade
        v-if="currentTab === 3 && ruleType === 'alert-upgrade'"
        @prevStep="prevStep"
        @handleSubmit="handleSubmit"
        :record="record"
      />
      <recover
        v-if="currentTab === 3 && ruleType === 'alert-recover'"
        @prevStep="prevStep"
        @handleSubmit="handleSubmit"
        :record="record"
      />
    </div>

    <!-- <template slot="footer" v-if="currentTab === 3">
      <a-button @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template> -->

  </a-modal>
</template>

<script>
import screening from '../../screening'
import step1 from '@/components/ARStepForm/Basis'
import step2 from '@/components/ARStepForm/Rules'
import step3 from '@/components/ARStepForm/AdvancedRules'
import classify from '@/components/ARStepForm/AlarmClassify'
import merger from '@/components/ARStepForm/AlarmMerger'
import relate from '@/components/ARStepForm/AlarmRelate'
import upgrade from '@/components/ARStepForm/AlarmUpgrade'
import recover from '@/components/ARStepForm/AlarmRecover'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
// import moment from 'moment'

const insert = gql`mutation ($objects: [t_alert_rule_insert_input!]! = []) {
  insert_t_alert_rule (objects: $objects) {
    returning {
      rule_id
    }
  }
}`
const update = gql`mutation update ($where: t_alert_rule_bool_exp!, $val: t_alert_rule_set_input) {
  update_t_alert_rule (
    where: $where,
    _set: $val
  ) {
      returning {
      rule_id
    }
  }
}`

export default {
  name: 'AlarmRulesDetail',
  components: {
    step1,
    step2,
    step3,
    classify,
    merger,
    relate,
    upgrade,
    recover
  },
  data () {
    return {
      currentTab: 0,
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: {},
      mode: '',
      ruleType: '',
      formData: {},
      oldkeys: []
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
  },
  beforeMount () {
  },
  methods: {
    async open (record, mode, ruleType) {
      this.currentTab = 0
      this.visible = true
      this.mode = mode
      this.ruleType = ruleType
      if (mode === 'New') {
        this.record = {}
      }
      if (mode === 'Edit') {
        const xmlContent = screening.xmlTojson(record.content)[ruleType]
        record.timeFromStr = record.timeFrom ? screening.timeToDate(record.timeFrom) : ''
        record.timeToStr = record.timeTo ? screening.timeToDate(record.timeTo) : ''
        this.record = {
          ...record,
          ...xmlContent
        }
        this.oldkeys = [[...Object.keys(xmlContent)], ruleType]
        console.log(record, this.record, xmlContent)
      }
    },
    handleCancel (e) {
      this.visible = false
    },
    // handler
    nextStep (val) {
      this.formData = { ...val, ...this.formData }
      if (this.currentTab < 3) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    },
    /**
     * 表单效验
     */
    handleSubmit (e) {
      this.formData = { ...e, ...this.formData }
      const result = {
        title: this.formData.title,
        rule_type: this.ruleType,
        priority: this.formData.priority,
        node_type: this.formData.node_type,
        domain: this.formData.domain,
        // is_exclusive: this.record.is_exclusive,
        enabled: this.formData.enabled
      }
      const xmlstr = { }
      this.oldkeys[0].map(e => {
        xmlstr[ e ] = this.formData[ e ]
      })
      result.content = `<${this.oldkeys[1]}>${screening.jsonToxml(xmlstr)}</${this.oldkeys[1]}>`
      console.log(result)
      if (this.mode === 'New') {
        this.insert(result)
      } else if (this.mode === 'Edit') {
        this.update(result)
      }
    },
    /**
     * tab===3时提交的表单数据处理
     */
    lastSubmit (e) {
      console.log(e)
    },
    /**
     * 新增
     */
    async insert (values) {
      this.loading = true
      // FIXME: 数据库 rid 与 did 一致，did 不是外键？
      return apollo.clients.alert.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values
          }]
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '新增成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 编辑
     */
    async update (values) {
      this.loading = true
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          where: {
            'rule_id': {
              '_eq': this.record.rule_id
            }
          },
          val: {
            ...values
          }
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
