<template>
  <div style="height: 100vh">
    <img src="../static/icon_exit.png" class="button" @click="go">
    <iframe width="100%" height="100%" :src="url"></iframe>
  </div>
</template>

<script>

export default {
  name: 'Player',
  data () {
    return {
      url: process.env.VUE_APP_QUOTE_URL + '/static/h5player/webplayer.html?cameraUrl=ws://10.201.53.20:559/openUrl/6J4mUOk'
    }
  },
  methods: {
    go () {
      this.$router.push({ path: '/machineRoom/room', query: { active: this.$route.query.active } })
    }
  },
  mounted () {
    this.url = `${process.env.VUE_APP_QUOTE_URL}/static/h5player/webplayer.html?cameraUrl=${this.$route.query.url}`
  }
}
</script>

<style lang='less' scoped>
.button {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10000;
  width: 50px;
  height: 50px;
}
</style>
