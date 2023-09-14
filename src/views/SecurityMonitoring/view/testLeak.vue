<template>
  <!--  <Iframe width="100%" ref="childIframe" height="100%" :src="`${url}/unih5/#/pages/vulnerabilityMonitoring/index/indexPC`" style="border: none"></Iframe>-->
  <div class="wrapper">

  </div>
</template>

<script>
import {
  card, level_option, catogray_option, total_option, lines_option_month
} from '../api/api'

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
.wrapper {
  padding: 10px 15px;
  height: 87vh;
  background-color: #fff;
  border: 1px solid blue;
}
</style>
