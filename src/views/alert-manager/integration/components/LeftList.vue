<template>
  <div style="margin-top: 20px">
    <PlatformType v-for="d in data" :key="d.title" :title="d.title" :children="d.children" />
  </div>
</template>

<script lang="ts">
import PlatformType from './PlatformType.vue'
const data = [
  {
    title: '基础资源监控',
    children: ['pigoss', 'H3C']
  },
  {
    title: '应用性能监控',
    children: ['bonree', 'cloudwise']
  },
  {
    title: '机房监控',
    children: ['xbro']
  },
  {
    title: '网络性能监控',
    children: ['netis']
  }
]
export default {
  name: 'LeftList',
  components: { PlatformType },
  data () {
    return {
      data
    }
  }
}
</script>

<style scoped></style>
