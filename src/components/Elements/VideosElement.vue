<template>
  <div class="wrapper">
    <video controls ref="v">
      <source :src="videoSrc" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videoSrc: require('@/assets/videos/testmove.mp4')
    }
  }
}
</script>

<style>
.wrapper {
  max-width: 300px;
}
.wrapper video {
  max-width: 100%;
  display: block;
}
</style>
