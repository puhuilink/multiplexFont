<template>
  <Iframe width="100%" ref="childIframe" height="100%" src="http://10.1.13.17/preview/jGfhLgmwRKBSgs0EJDIWug==" style="border: none"></Iframe>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Xungeng',
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
