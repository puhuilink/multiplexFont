<template>
  <div class="wrapper">
    <div class="wrapper_content">
      <img :src="url" alt="">
    </div>
  </div>
</template>

<script>
import { USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  name: 'DHMonitoring',
  data () {
    return {
      url: require('@/assets/images/厦门.png')
    }
  },
  created () {
    const { organizeId } = Vue.ls.get(USER)
    switch (organizeId) {
      case '77550822937853952':
      case '77551146956226560':
        this.url = require('@/assets/images/厦门.png')
        break
      case '77551230678728704':
        this.url = require('@/assets/images/北京.png')
        break
      default:
        this.$router.push({
          path: '/403'
        })
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #FFFFFF;
  height: calc(100vh - 210px);
  position: relative;
  &_content {
    position: absolute;
    width: 1400px;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
