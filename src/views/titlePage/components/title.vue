<template>
  <div class="shell">
    <img :src="imgList[img]" class="shell_image" />
    <img :src="iconList[icon]" class="shell_icon" />
    <span class="shell_font">{{ font }}</span>
    <img :src="require('../assets/icon_arrow_down.png')" class="shell_back">
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    img: {
      type: String,
      default: '0'
    },
    icon: {
      type: String,
      default: '3'
    },
    font: {
      type: String,
      default: '设备列表'
    }
  },
  data () {
    return {
      imgList: [
        require('../assets/TBK_01.png'),
        require('../assets/TBK_02.png'),
        require('../assets/TBK_03.png'),
        require('../assets/TBK_04.png')
      ],
      iconList: [
        require('../assets/icon_p01.png'),
        require('../assets/icon_p02.png'),
        require('../assets/icon_p03.png'),
        require('../assets/icon_p04.png')
      ]
    }
  }
}
</script>

<style lang='less' scoped>
.shell {
  position: relative;

  &_image {
    height: 120px;
    width: 90%;
    top: 0;
    left: 0;
    position: absolute;
  }

  &_icon {
    position: absolute;
    top: 26px;
    left: 4%;
    width: 74px;
    height: 90px;
  }

  &_font {
    position: absolute;
    top: 40px;
    left: 35%;
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    color: #FFFFFF;
  }

  &_back {
    position: absolute;
    top: 43px;
    left: 79%;
  }
}
</style>
