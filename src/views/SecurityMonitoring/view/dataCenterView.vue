<template>
  <Iframe width="100%" ref="childIframe" height="100%" :src="`${url}/preview/XDiIV6e7ccJ7WvHGF7RviA==`" style="border: none"></Iframe>
<!--  <Iframe width="100%" ref="childIframe" height="100%" src="http://10.201.229.62/preview/XDiIV6e7ccJ7WvHGF7RviA==" style="border: none"></Iframe>-->
  <!--          src="http://10.201.229.62/preview/XDiIV6e7ccJ7WvHGF7RviA=="-->
</template>

<script>
export default {
  name: 'DataCenterView',
  data () {
    return {
      url: process.env.VUE_APP_QUOTE_URL
    }
  }
}
</script>

<style scoped>

</style>
