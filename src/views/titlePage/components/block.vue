<template>
  <div class="border_out">
    <div class="border_out_heng"></div>
    <div class="border_out_shu"></div>
    <div class="border_out_bigFont">{{ floor }}</div>
    <div class="border_out_title">{{ title }}</div>
    <img :src="imgList[imgUrl]" class="border_out_img" alt="" />
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    floor: {
      type: String,
      default: '5F'
    },
    title: {
      type: String,
      default: '数据中心机房'
    },
    imgUrl: {
      type: String,
      default: '3'
    }
  },
  data () {
    return {
      imgList: [
        require('../assets/JF_xiamen_-1F.png'),
        require('../assets/JF_xiamen_1F.png'),
        require('../assets/JF_xiamen_19F.png'),
        require('../assets/JF_xiamen_01.png')
      ]
    }
  }
}
</script>

<style lang='less' scoped>
.border_out {
  position: relative;
  width: 400px;
  height: 300px;
  &_heng {
    position: absolute;
    top: 4%;
    left: 8%;
    width: 77px;
    height: 280px;
    border-right: 1.41pt solid #6ea7ff;
  }

  &_shu {
    position: absolute;
    top: 18%;
    left: 4%;
    width: 278px;
    height: 50px;
    border-top: 1.41pt solid #6ea7ff;
  }

  &_bigFont {
    position: absolute;
    font-family: '苹方-简 纤细体';
    font-size: 42pt;
    color: #000000;
    top: 45px;
    left: -12px;
    text-align: right;
    width: 108px;
  }

  &_title {
    position: absolute;
    font-family: '苹方-简 纤细体';
    font-size: 18pt;
    color: #000000;
    top: 134px;
    left: 58px;
    -webkit-writing-mode: vertical-lr;
    -ms-writing-mode: tb-lr;
    writing-mode: vertical-lr
  }

  &_img {
    position: absolute;
    top: 29%;
    left: 31%;
    height: 58%;
  }
}
</style>
