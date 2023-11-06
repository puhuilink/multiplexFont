<template>
  <div style="display: flex;align-items: center;margin-top: 5%;">
    <span>计划排除日期（选填）:</span>
    <a-date-picker ref="datePicker" @change="onChange" v-model="timeList" class="exceptSelect"/>
    <a-select mode="multiple" v-model="exception" @dropdownVisibleChange="func" ref="select" class="exceptDate"></a-select>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'TimeMultiPicker',
  components: {},
  props: {
    exception: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      timeList: ''
    }
  },
  methods: {
    onChange (date, dateString) {
      if (dateString && !this.exception.includes(moment(dateString).format('MM-DD'))) {
        this.exception.push(moment(dateString).format('MM-DD'))
        setTimeout(() => { this.timeList = '' }, 3000)
      }
    },
    func () {
      this.$refs.select.open = false
    }
  }
}
</script>

<style scoped>
.exceptSelect {
  margin-left: 8px;
  width: 175px;
}
.exceptDate {
  width: 355px;
  margin-left: 32px;
}
</style>
