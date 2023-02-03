<template>
  <a-badge :count="count" color="#01d7b0">
    <a-card hoverable style="width: 150px" :bordered="false">
      <template #cover>
        <img :src="baseUrl+img" width="60px" height="60px" style="margin: 5px" alt=""/>
      </template>
      <template #actions>
        <a-icon type="plus" key="edit" style="color: #3c9be8" @click="toCreateAlertSource(svgName)" />
      </template>
    </a-card>
  </a-badge>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
import store from '@/store'
import { alarm } from '@/utils/request'

export default {
  name: 'PlatformImg',
  components: { SvgIcon },
  props: {
    svgName: {
      type: String,
      default: 'pigoss'
    },
    img: {
      type: String,
      default: ''
    },
    alertSourceCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    async toCreateAlertSource (type) {
      const platformList = store.getters.platformList
      let platform
      platformList.forEach(plat => {
        if (plat.platName === type) {
          platform = plat
        }
      })
      let pp
      try {
        const { data } = await alarm.post('/api/integration/platform/find', { platformId: platform.platformId })
        pp = data
      } catch (e) {
        console.log(e)
        this.$message.error('请求失败！请检查网络连接！')
        return
      }
      pp.url += this.baseUrl
      await this.$router.push({ name: 'NewAlertSource', query: { plat: pp } })
    }
  },
  data () {
    const name = 'svg-' + this.svgName
    const count = this.alertSourceCount
    const baseUrl = process.env.VUE_APP_VIEW_THUMBNAIL_URI
    return {
      name,
      baseUrl,
      count
    }
  }
}
</script>

<style scoped></style>
