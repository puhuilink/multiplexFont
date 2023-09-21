<template>
  <div>
    <a-modal
      ref="ccc"
      v-model="visible"
      :title="activeKey"
      :width="900"
      :footer="null"
      :height="600"
      @cancel="handleCancel">
      <a-spin :spinning="loading">
        <iframe width="100%" height="500px" :src="url"></iframe>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  data () {
    return {
      visible: false,
      activeKey: '',
      url: '',
      loading: false
    }
  },
  methods: {
    handleCancel (e) {
      this.visible = false
      // 关闭视频流
    },
    async childMethod (url, title) {
      // 创建WebSocket连接
      this.loading = true

      console.log('socket', url)
      this.activeKey = title
      this.url = `${process.env.VUE_APP_QUOTE_URL}/static/h5player/webplayer.html?cameraUrl=${url}`
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }

  }

}
</script>

<style lang="less" scoped>
video {
  height: 100%;
  width: 100%;
}

</style>
