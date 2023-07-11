<template>
  <Iframe
    width="100%"
    height="100%"
    :src="`${url}/xunh5/#/pages/safeView/indexPC`"
    style="border: none"
    ref="childIframe"
    name="childIframe">
    /#/pages/safeView/indexPC
    <!--    src="http://10.201.229.62/xunh5/#/pages/safeView/index"-->
  </Iframe>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'SafeTouch',
  data () {
    return {
      url: process.env.VUE_APP_QUOTE_URL
    }
  },
  mounted () {
    const mapFrame = this.$refs['childIframe']
    console.log('mapFrame', Vue.ls.get(ACCESS_TOKEN))
    if (mapFrame.attachEvent) {
      mapFrame.attachEvent('onload', function () {
        mapFrame.contentWindow.postMessage({
          type: 'token',
          data: `Bearer ${Vue.ls.get(ACCESS_TOKEN)}`
        }, '*')
      })
    } else {
      mapFrame.onload = function () {
        mapFrame.contentWindow.postMessage({
          type: 'token',
          data: `Bearer ${Vue.ls.get(ACCESS_TOKEN)}`
        }, '*')
      }
    }
  }
}
</script>

<style scoped>

</style>
