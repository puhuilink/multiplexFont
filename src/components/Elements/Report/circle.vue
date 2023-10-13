<template>
  <div class="outer">
    <span class="size-white">{{ number }}</span>
    <span :class="[type === 'main' ? 'blue' : 'red', 'size']">今日主告警</span>
    <img :src="type === 'main' ? require('./img/告警.png') : require('./img/告警2.png')" class="photo_alarm">
    <img src="./img/bk_circle.png" class="photo_deformation">
  </div>
</template>

<script>
export default {
  name: 'Circle',
  props: {
    type: {
      type: String,
      default: 'main'
    },
    number: {
      type: String,
      default: '10'
    }
  }
}
</script>

<style scoped>
@keyframes scale {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(1turn);
  }
}
.outer {
  position: relative;
  width: 150px;
  height: 150px;
}

.size-white {
  width: 30px;
  height: 30px;
  font-size: 36px;
  font-weight: 400;
  color: rgba(255,255,255,0.85);
  line-height: 40px;
  left: 49%;
  text-align: center;
  top: 35%;
  -webkit-transform:translateX(-50%) translateY(-50%);
  position:absolute;
}
.size {
  width: 60px;
  height: 10px;
  font-size: 14px;
  line-height: 14px;
  left: 60%;
  top: 55%;
  -webkit-transform:translateX(-50%) translateY(-50%);
  position:absolute;
}

.blue {
  color: #00EDFF;
}
.red {
  color: #FF7070;
}
.photo_deformation {
  width: 200px;
  height: 175px;
  position:absolute;
  left: 0%;
  -webkit-transform:translateX(-50%) translateY(-50%);
  animation: scale 5s infinite;
}

.photo_alarm {
  position:absolute;
  left: 60%;
  top: 70%;
  -webkit-transform:translateX(-50%) translateY(-50%);
}
</style>
