<template>
  <div class="mp4">
    <a-spin :spinning="loading" class="boxspin">
      <iframe :src="url"></iframe>
    </a-spin>
  </div>
</template>

<script>
export default {
  name: `monitorPageIndex`,
  data () {
    return {
      url: this.$route.query,
      loading: false
    }
  },
  created () {
    this.childMethod()
    // this.$route.meta.title = this.$route.params.monitorName
  },
  methods: {
    async childMethod () {
      // 创建WebSocket连接

      this.loading = true
      this.url = `${process.env.VUE_APP_QUOTE_URL}/static/h5player/webplayer.html?cameraUrl=${this.$route.query.url}`
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.mp4 {
  width: 97%;
  height: 93%;
  padding-left: 3%;
}

iframe {
  height: 40rem;
  width: 100%;
}
</style>
