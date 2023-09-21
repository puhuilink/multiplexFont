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
      <video ref="videoPlayer" controls></video>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'VideoPlayer',

  data () {
    return {
      visible: false,
      websocket: null,
      activeKey: ''
      // url: process.env.VUE_APP_QUOTE_URL + '/static/h5player/webplayer.html?cameraUrl=ws://10.201.53.20:559/openUrl/RbHmFck'
    }
  },
  methods: {
    handleCancel (e) {
      this.visible = false
      // 关闭视频流
      this.websocket.close()
    },
    childMethod (url, title) {
      // 创建WebSocket连接
      console.log('socket', url)
      this.activeKey = title
      this.websocket = new WebSocket('ws://10.201.53.20:559/openUrl/6J4mUOk')

      // 监听WebSocket连接打开事件
      this.websocket.onopen = () => {
        console.log('WebSocket连接已打开')
      }

      // 监听WebSocket消息事件
      this.websocket.onmessage = (event) => {
        // 将WebSocket消息流附加到<video>元素上
        this.$refs.videoPlayer.src = URL.createObjectURL(event.data)
      }

      // 监听WebSocket关闭事件
      this.websocket.onclose = () => {
        console.log('WebSocket连接已关闭')
      }
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
