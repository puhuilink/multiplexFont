<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="920"
    wrapClassName="PlanSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-spin :spinning="spinning">
      <a-form-model :model="plan" ref="ruleForm" :rules="rules" layout="inline">
        <BasicInfo :plan.sync="plan" />

        <Cron v-if="plan.schedule" :cron.sync="plan.schedule" />

        <TimeRange v-if="plan.interval" :interval.sync="plan.interval" />

        <PatrolPath :plan.sync="plan" />

        <TimePicker :plan.sync="plan"></TimePicker>

        <TimeMultiPicker :plan.sync="plan"></TimeMultiPicker>
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
import TimeRange, { timeRangeRule } from './TimeRange/index.vue'
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
        ...timeRangeRule,
        ...cronRule,
        ...TimePickerRule,
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
    edit (id) {
      this.submit = this.update
      this.show('编辑巡更计划')
      this.fetchPlanDetail(id)
    },
    async fetchPlanDetail (id) {
      try {
        const plan = await PatrolService.planDetail(id)
        this.plan = new PlanModel(plan)
      } catch (e) {
        this.plan = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 调取新增接口
     */
    async insert () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        try {
          this.confirmLoading = true
          const { code, msg } = await PatrolService.addPlan(this.plan.serialize())
          if (code !== 200) {
            this.$notifyError(msg)
          } else {
            this.$emit('addSuccess')
            this.$notifyAddSuccess()
            this.cancel()
          }
        } catch (e) {
          this.$notifyError(e)
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
          // const { id, ...plan } = this.plan.serialize()
          const { code, msg } = await PatrolService.planUpdate(this.plan.serialize())
          if (code !== 200) {
            this.$notifyError(msg)
          } else {
            this.$emit('editSuccess')
            this.$notifyEditSuccess()
            this.cancel()
          }
        } catch (e) {
          this.$notifyError(e)
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
      height: 700px;
      overflow-y: auto;
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
