<template>
  <div>
    <div class="fix-text-style" v-if="number === undefined || number === '-'">-
    </div>
    <div v-else-if="+number >= 10000">
      <div @click="test">{{ (+number / 10000).toFixed(1) }}
        <div class="unit" :style="{ color: color }">万</div>
      </div>
    </div>
    <div class="style-fix" v-else @click="test">{{ number }}</div>
    <div class="unit" v-if="unit !== ''">
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
font-size: 40px;
font-family: LetsgoDigital-Regular, LetsgoDigital;
font-weight: 400;
color: #FFFFFF;
line-height: 30px;
}

.fix-text-style {
  display: inline-block;
}

.unit {
  display: inline-block;
  height: 16px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.40);
  line-height:16px;
  transform-origin: 0 0;
  transform: scale(0.6);
  margin-left: 2px;
  transform: translateY(-1px);
}
</style>
