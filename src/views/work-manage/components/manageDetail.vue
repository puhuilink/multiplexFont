<template>
  <div class="wrapper">
    <div class="blank common">
      <span class="title">新建排班</span>
    </div>
    <div class="calendar common"></div>
  </div>
</template>

<script>
export default {
  name: 'ManageDetail'
}
</script>

<style lang='less' scoped>
。ant-layout-content {
  margin: 0 !important;
}

.wrapper {
  height: 100%;
  display: flex;
  justify-content: space-around;
  background-color: rgba(220, 222, 224);
  .common {
    margin-top: 1%;
    height: 95%;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #fff;
    .title {
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 20px;
    }
  }
  .blank {
    width: 23%;
  }
  .calendar {
    width: 73%;
  }
}
</style>
