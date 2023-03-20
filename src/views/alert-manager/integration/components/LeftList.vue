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
    title: '1',
    children: ['pigoss', 'H3C']
  },
  {
    title: '2',
    children: ['bonree', 'cloudwise']
  },
  {
    title: '3',
    children: ['xbro']
  },
  {
    title: '4',
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
              id: p.platformId,
              url: p.platUrl,
              total: p.total
            })
            break
          case '2':
            baseArray[1].children.push({
              name: p.platName,
              id: p.platformId,
              url: p.platUrl,
              total: p.total
            })
            break
          case '3':
            baseArray[2].children.push({
              name: p.platName,
              id: p.platformId,
              url: p.platUrl,
              total: p.total
            })
            break
          case '4':
            baseArray[3].children.push({
              name: p.platName,
              id: p.platformId,
              url: p.platUrl,
              total: p.total
            })
            break
        }
      })
      this.data = baseArray
    }
  },
  mounted () {
    setTimeout(this.initialChildren, 500)
  }
}
</script>

<style scoped></style>
