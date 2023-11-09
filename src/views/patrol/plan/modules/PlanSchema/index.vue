<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="1100"
    wrapClassName="PlanSchema__modal"
    :afterClose="reset"
    okText="提交"
    cancelText="取消"
    @ok="submit"
    @cancel="cancel"
  >
    <a-spin :spinning="spinning">
      <a-form-model :model="plan" ref="ruleForm" :rules="rules" layout="inline">
        <BasicInfo :plan.sync="plan" />

        <Cron v-if="plan.schedule" :cron.sync="plan.schedule" />

        <a-form-model-item
          prop="interval"
          v-if="plan.interval"
        >
          <TimeRange :interval.sync="plan.interval" />
        </a-form-model-item>

        <!-- <PatrolPath :plan.sync="plan" /> -->

        <TimePicker :plan.sync="plan"></TimePicker>

        <TimeMultiPicker :exception.sync="plan.exception"></TimeMultiPicker>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { PatrolService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import { PlanModel } from './PlanModel'
import BasicInfo, { basicInfoRule } from './BasicInfo.vue'
import Cron, { cronRule } from './Cron/index.vue'
import PatrolPath, { patrolPathRule } from './PatrolPath.vue'
import TimeRange from './TimeRange/index.vue'
import TimeMultiPicker from './TimeMultiPicker/index'
import TimePicker, { TimePickerRule } from './TimePicker/index'
import moment from 'moment'

export default {
  name: 'PlanSchema',
  mixins: [Schema],
  components: {
    BasicInfo,
    Cron,
    PatrolPath,
    TimeRange,
    TimeMultiPicker,
    TimePicker
  },
  props: {},
  data: () => ({
    plan: {},
    spinning: false
  }),
  computed: {
    rules () {
      return {
        ...basicInfoRule,
        ...patrolPathRule,
        // ...timeRangeRule,
        ...cronRule,
        ...TimePickerRule,
        interval: [
          {
            required: true,
            validator (rule, value, callback) {
              // if (value === '') {
              //   callback(new Error('Please input the password again'))
              // } else if (value !== this.ruleForm.pass) {
              //   callback(new Error("Two inputs don't match!"))
              // } else {
              //   callback()
              // }
              if (value.dataSource.length === 0) {
                callback(new Error('请填写巡更时间'))
              }
              callback()
            }
          }
        ],
        effectTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const format = 'YYYY-MM-DD HH:mm:ss'
              const startTime = moment(value, format)
              const endTime = moment(this.plan.expireTime, format)
              if (Object.is(startTime, '') || !startTime.isValid()) {
                callback(new Error('生效时间为必填项'))
              } else if (startTime.isAfter(endTime)) {
                callback(new Error('生效时间不能晚于失效时间'))
              } else {
                callback()
              }
            }
          }
        ],
        expireTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const format = 'YYYY-MM-DD HH:mm:ss'
              const startTime = moment(this.plan.effectTime, format)
              const endTime = moment(value, format)
              if (Object.is(endTime, '') || !endTime.isValid()) {
                callback(new Error('失效时间为必填项'))
              } else if (startTime.isAfter(endTime)) {
                callback(new Error('失效时间不能早于生效时间'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    },
    timeExcept () {
      return this.$store.date
    }
  },
  methods: {
    add () {
      this.plan = new PlanModel({})
      this.submit = this.insert
      this.show('新增巡更计划')
    },
    edit (plan) {
      this.submit = this.update
      this.show('编辑巡更计划')
      this.fetchPlanDetail(plan)
    },
    async fetchPlanDetail (plan) {
      // try {
      //   const plan = await PatrolService.planDetail(id)
      //   this.plan = new PlanModel(plan)
      // } catch (e) {
      //   this.plan = {}
      //   throw e
      // } finally {
      //   this.spinning = false
      // }
      this.plan = new PlanModel(plan)
    },
    /**
     * 调取新增接口
     */
    async insert () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        try {
          this.confirmLoading = true
          await PatrolService.addPlan(this.plan.serialize())
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 调取编辑接口
     */
    async update () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        try {
          this.confirmLoading = true
          // eslint-disable-next-line no-unused-vars
          const { id, ...plan } = this.plan.serialize()
          await PatrolService.planUpdate(this.plan.serialize())
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 重置不生效，测试
     */
    reset () {
      this.$refs.ruleForm.resetFields()
    }
  },
  created () {
    // this.add()
  }
}
</script>

<style lang="less">
.PlanSchema {
  &__modal {
    .ant-modal-body {
      height: 550px;
      overflow-y: auto;
      padding: 30px 50px 0px 50px;
    }

    &__range {
      margin-top: 10%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      hr {
        width: 80%;
        background: rgb(232,232,232);
        height: 0.1px;
        border: none;
      }
      &__font {
        background: rgb(250,250,250);
        height: 60px;
        line-height: 60px;
        width: 80%;
        display: flex;
        justify-content: space-around;
      }
      &__picker {
        width:80%;
      }
    }
  }
}
</style>
