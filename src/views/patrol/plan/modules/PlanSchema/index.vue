<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
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

        <!--        设计中无此模块-->
        <!--        <PatrolPath :plan.sync="plan" />-->
        <a-range-picker
          style="width:80%;margin-top: 10%;margin-left: 10%"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['生效时间', '失效时间']"
          v-model="plan.effectTime"
        />

        <EditableRow></EditableRow>
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

export default {
  name: 'PlanSchema',
  mixins: [Schema],
  components: {
    BasicInfo,
    Cron,
    PatrolPath,
    TimeRange
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
        ...cronRule
      }
    }
  },
  methods: {
    add () {
      this.plan = new PlanModel({})
      this.submit = this.insert
      this.show('新增巡检计划')
    },
    edit (id) {
      this.submit = this.update
      this.show('编辑巡检计划')
      this.fetchPlanDetail(id)
    },
    async fetchPlanDetail (id) {
      try {
        this.spinning = true
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
          // await PatrolService.planAdd(this.plan.serialize())
          await PatrolService.addPlan(this.plan.serialize())
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
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
          // await PatrolService.planAdd(plan, { id })
          this.$emit('editSuccess')
          this.$notifyEditSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
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
  }
}
</style>
