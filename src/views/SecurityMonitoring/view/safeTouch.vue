<template>
  <Iframe
    width="100%"
    height="100%"
    src="http://10.1.13.17/xungeng/#/pages/safeView/index"
    style="border: none"
    ref="childIframe"
    name="childIframe"></Iframe>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'SafeTouch',
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
