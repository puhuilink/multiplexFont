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
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-steps class="steps" :current="currentTab">
      <a-step title="基础设置" />
      <a-step title="规则条件设置" />
      <a-step title="规则条件高级设置" />
      <a-step title="告警合并设置" />
    </a-steps>

    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      <step3 v-if="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep"/>
      <step4 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish"/>
    </div>

    <!-- <template slot="footer" v-if="currentTab === 3">
      <a-button @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template> -->

  </a-modal>
</template>

<script>
import step1 from '@/components/ARStepForm/Basis'
import step2 from '@/components/ARStepForm/Rules'
import step3 from '@/components/ARStepForm/AdvancedRules'
import step4 from '@/components/ARStepForm/AlarmMerger'

export default {
  name: 'AlarmTypesDetail',
  components: {
    step1,
    step2,
    step3,
    step4
  },
  data () {
    return {
      currentTab: 0,
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
      // 开启的父级操作来源
      mode: ''
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
    async open (record, mode) {
      this.visible = true
      this.record = record
      console.log(record, mode)
      this.mode = mode
      // if (record !== '') {
      //   await this.$nextTick()
      //   setTimeout(() => {
      //     this.form.setFieldsValue({
      //       ...record
      //     })
      //   })
      // }
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    // handler
    nextStep () {
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
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
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
