<template>
  <div style="margin-top: 20px">
    <PlatformType v-for="d in data" :key="d.index" :title="d.index" :children="d.children" />
  </div>
</template>

<script>
import store from '@/store/index'
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
  },
  methods: {
    initialChildren () {
      const pl = store.getters.platformList
      const baseArray = [
        {
          index: '1',
          children: []
        },
        {
          index: '2',
          children: []
        },
        {
          index: '3',
          children: []
        },
        {
          index: '4',
          children: []
        }
      ]
      pl.forEach(p => {
        switch (p.platType) {
          case '1':
            baseArray[0].children.push({
              name: p.platName,
              url: p.platUrl
            })
            break
          case '2':
            baseArray[1].children.push({
              name: p.platName,
              url: p.platUrl
            })
            break
          case '3':
            baseArray[2].children.push({
              name: p.platName,
              url: p.platUrl
            })
            break
          case '4':
            baseArray[3].children.push({
              name: p.platName,
              url: p.platUrl
            })
            break
        }
      })
      this.data = baseArray
    }
  },
  mounted () {
    setTimeout(this.initialChildren, 2000)
  }
}
</script>

<style scoped></style>
