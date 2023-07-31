<template>
  <div class="wrapper">
    <a href="https://10.201.30.40/app-zjj-banned?ngsoc_token=845ea89bfb24b8a224e0623268002171ed504d3efec3a33d97be00bf2a8bbc82" target="_blank">
      <div class="wrapper_item">
        <div class="wrapper_item_img1"></div>
        <span>北京防火墙</span>
      </div>
    </a>
    <a href="https://10.201.30.40/devlink?ngsoc_token=845ea89bfb24b8a224e0623268002171ed504d3efec3a33d97be00bf2a8bbc82" target="_blank">
      <div class="wrapper_item">
        <div class="wrapper_item_img2"></div>
        <span>厦门防火墙</span>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'NewBan'
}
</script>

<style lang='less' scoped>
.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 80vh;

  &_item {
    width: 100%;
    height: 318px;
    position: relative;
    display: flex;
    align-content: center;
    justify-content: center;

    &_img1 {
      background-image: url("../../static/TBK_01.png");
      width: 520px;
      height: 318px;
    }

    &_img2 {
      background-image: url("../../static/TBK_04.png");
      width: 520px;
      height: 318px;
    }

    span {
      position: absolute;
      top: 65%;
      left: 50%;
      transform: translate(-50%);
      color: #FFFFFF;
      font-size: 20pt;
    }

    &::after {
      background-image:url("../../static/icon_Firewall.png");
      width: 120px;
      content: '';
      height: 132px;
      position: absolute;
      top: 60px;
      left: 210px;
    }
  }
}
</style>
