<template>
  <div>
    <div class="fix-text-style" v-if="number === undefined || number === '-'">-
    </div>
    <div v-else-if="+number >= 10000">
      <div @click="test">{{ (+number / 10000).toFixed(1) }}
        <div class="unit">万</div>
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
  name: 'formatterNumber',
  props: {
    number: {
      type: String,
      default: undefined
    },
    //单位，可选
    unit: {
      type: String,
      default: ''
    }
  },
  methods: {
    test() {
      console.log(this.number, this.unit)
    }
  }
}
</script>

<style lang="less" scoped>
.style-fix {
  display: inline-block;
}

.fix-text-style {
  display: inline-block;
}

.unit {
  display: inline-block;
  width: 5px;
  height: 9px;
  font-size: 6px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, .7);
  line-height: 9px;
  transform-origin: 0 0;
  transform: scale(0.6);
  margin-left: 2px;
  transform: translateY(-1px);
}
</style>