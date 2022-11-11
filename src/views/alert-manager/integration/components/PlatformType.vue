<template>
  <div style="margin-top: 20px;width: inherit">
    <div style="width: 500px">
      <span style="width: 10px;margin-left: 20px">
        <div style="background-color: #5b8ff9; width: 5px; height: 16px;display: inline-block;margin-bottom: -3px"></div>
      </span>
      <span :style="{width:localTitle.length * 15 + 16 + 'px'}"><div style="display: inline-block;margin-left: 10px">{{ localTitle }}</div></span>
      <span style=""><a-icon type="plus-square" style="font-size: 18px;margin-top: 15px;margin-left: 15px" /></span>
    </div>
    <div
      :style="{
        width: localTitle.length * 15 + 50 + 'px',
        marginLeft: '20px'
      }"
    >
      <a-divider />
    </div>
    <div>
      <div
        style="display: inline-block"
        v-for="child in children"
        :key="child"
      >
        <div style="margin: 20px"><PlatformImg :svg-name="child" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import PlatformImg from './PlatformImg.vue'

export default {
  name: 'PlatformType',
  components: { PlatformImg },
  props: {
    title: {
      type: String,
      default: 'this is a title'
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const localTitle = this.title
    return {
      localTitle
    }
  }
}
</script>

<style scoped></style>
