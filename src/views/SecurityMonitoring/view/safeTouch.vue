<template>
  <Iframe
    class="iframe"
    :src="`${url}/xunh5/#/pages/safeView/index`"
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
.iframe {
  height: calc(100vh - 100px);
  width: calc(100vw - 276px);
  margin: 0 auto;
}
</style>
