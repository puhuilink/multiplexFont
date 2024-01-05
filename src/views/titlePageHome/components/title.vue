<template>
  <div class="shell">
    <img :src="img" class="shell_image" />
    <span class="shell_font">{{ font }}</span>
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
    font: {
      type: String,
      default: '设备列表'
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang='less' scoped>
.shell {
  height: 97px;
  //width: 104px;
 margin: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{
    width: 58px;
    height: 58px;
    //background: #3F78F0;
    //border-radius: 8px;
  }
  .shell_font{
margin-top: 18px;
    height: 21px;
    font-size: 16px;
    //font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 21px;
  }
}
</style>
