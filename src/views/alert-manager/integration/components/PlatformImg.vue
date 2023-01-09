<template>
  <a-badge :count="count" color="#01d7b0">
    <a-card hoverable style="width: 150px" :bordered="false">
      <template #cover>
        <img :src="require(`@/assets/icons/svg/${svgName}.svg`)" width="60px" height="60px" style="margin: 5px" alt=""/>
      </template>
      <template #actions>
        <a-icon type="plus" key="edit" style="color: #3c9be8" @click="toCreateAlertSource(svgName)" />
      </template>
    </a-card>
  </a-badge>
</template>

<script>

import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  name: 'PlatformImg',
  components: { SvgIcon },
  props: {
    svgName: {
      type: String,
      default: 'pigoss'
    },
    alertSourceCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    toCreateAlertSource (type) {
      this.$router.push({ name: 'NewAlertSource', query: { platType: type } })
    }
  },
  data () {
    const name = 'svg-' + this.svgName
    const count = this.alertSourceCount

    return {
      name,
      count
    }
  }
}
</script>

<style scoped></style>
