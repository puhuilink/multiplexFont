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

        <Cron />

        <TimeRange/>

        <PatrolPath :plan.sync="plan" />
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { PatrolService } from '@/api-hasura'
import BasicInfo, { basicInfoRule } from './BasicInfo'
import Cron, { cronRule } from './Cron'
import PatrolPath, { patrolPathRule } from './PatrolPath'
import TimeRange, { timeRangeRule } from './TimeRange'

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
        this.plan = await PatrolService.planDetail(id)
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
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        try {
          this.confirmLoading = true
          // await PatrolService.planAdd(this.plan)
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
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        try {
          this.confirmLoading = true
          // const { id } = this.plan
          // await PatrolService.planEdit(this.plan, { id })
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
      height: 500px;
      overflow-y: auto;
    }
  }
}
</style>
