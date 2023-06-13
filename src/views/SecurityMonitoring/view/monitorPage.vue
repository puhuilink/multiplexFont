<template>
  <div style="height: 100%;width: 100%;">
    <!--    <div class="block"></div>-->
    <Iframe width="100%" height="100%" src="http://10.1.13.17/xungeng/#/pages/computerRoomMonitoring/index?pcShow=false" style="border: none"></Iframe>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'MonitorPage',
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
.block {
  background-color: rgb(25, 54, 101);
  width: 50px;
  height: 50px;
  position: absolute;
  right: 3%;
  top: 12%;}
</style>
