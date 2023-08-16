<template>
  <div>
    <div class="fix-text-style" v-if="number === undefined || number === '-'">-
    </div>
    <div v-else-if="+number >= 10000">
      <div @click="test" class="textNumber" :style="{ color: colors }">{{ (+number / 10000).toFixed(1) }}
        <div class="unit" :style="{ color: color_black04 }">万</div>
      </div>
    </div>
    <div class="style-fix" v-else @click="test" :style="{ color: colors }">{{ number }}</div>
    <div class="unit" v-if="unit !== ''" :style="{ color: color_black04 }">
      {{ unit }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormatterNumber',
  props: {
    number: {
      type: String,
      default: undefined
    },
    // 单位，可选
    unit: {
      type: String,
      default: ''
    },
    colors: {
      type: String,
      default: ''
    },
    color_black04: {
      type: String,
      default: ''
    },
    color_white: {
      type: String,
      default: ''
    }
  },
  methods: {
    test () {
      console.log(this.number, this.unit)
    }
  }
}
</script>

<style lang="less" scoped>
.style-fix {
  display: inline-block;

height: 30px;
font-size: 30px;
font-family: LetsgoDigital-Regular, LetsgoDigital;
font-weight: 400;
color: #FFFFFF;
line-height: 30px;
}

.fix-text-style {
  display: inline-block;
}
.textNumber{

font-size: 30px;
font-family: LetsgoDigital-Regular, LetsgoDigital;
font-weight: 400;
color: #000000;
line-height: 30px;
}
.unit {
  display: inline-block;
  height: 16px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;

  line-height:16px;
  transform-origin: 0 0;
  transform: scale(0.6);
  margin-left: 2px;
  transform: translateY(-1px);
}
</style>
