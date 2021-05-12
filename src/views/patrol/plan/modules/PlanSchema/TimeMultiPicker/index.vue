<template>
  <div style="display: flex;align-items: center;margin-top: 5%;">
    <span aria-setsize="small">计划排除日期（选填）：</span>
    <a-date-picker ref="datePicker" @change="onChange" v-model="timeList"/>
    <a-select mode="multiple" v-model="plan.exception" @dropdownVisibleChange="func" ref="select" style="width: 60%"></a-select>
  </div>
</template>
<script>
import moment from 'moment'
import mixin from '@/views/patrol/plan/modules/PlanSchema/mixin'
export default {
  name: 'TimeMultiPicker',
  components: {},
  mixins: [mixin],
  data () {
    return {
      timeList: ''
    }
  },
  methods: {
    onChange (date, dateString) {
      if (dateString && !this.plan.exception.includes(moment(dateString).format('MM-DD'))) {
        this.plan.exception.push(moment(dateString).format('MM-DD'))
        setTimeout(() => { this.timeList = '' }, 3000)
      }
    },
    func () {
      this.$refs.select.open = false
    }
  }
  // watch: {
  //   'timeList': {
  //     immediate: true,
  //     handler (value) {
  //       Reflect.set(this.plan, 'exception', value.toString())
  //     }
  //   }
  // }
}
</script>

<style scoped>

</style>
