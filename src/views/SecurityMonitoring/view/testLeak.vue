<template>
  <Iframe width="100%" ref="childIframe" height="100%" :src="`${url}/xunh5/#/pages/vulnerabilityMonitoring/index/indexPC?pcShow=false`" style="border: none"></Iframe>
</template>

<script>
import {
  card, level_option, catogray_option, total_option, lines_option_month, getPatchStat,
  getServerNum,
  getWeekRender,
  getMonthRender
} from '../api/api'
import * as echarts from 'echarts'

export default {
  data () {
    return {
      level_option,
      catogray_option,
      total_option,
      card: [],
      lines_option_month: undefined,
      pcShow: true,
      url: process.env.VUE_APP_QUOTE_URL
    }
  },
  created () {
    this.card = card
    this.total_option = total_option
    this.lines_option_month = lines_option_month
  },
  onLoad (option) {
    if (option && option.pcShow) {
      this.pcShow = JSON.parse(option.pcShow)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
