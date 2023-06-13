<template>
  <div>
    <a-row :gutter="[16,16]" justify="center" height type="flex" >
      <a-col :span="6"><titleColor></titleColor></a-col>
      <a-col :span="6"><titleColor img="1" icon="2" font="漏洞列表"></titleColor></a-col>
      <a-col :span="6"><titleColor img="2" icon="1" font="威胁漏洞报告"></titleColor></a-col>
      <a-col :span="6"><a @click="tiaozhuan"><titleColor img="3" icon="0" font="一键封禁"></titleColor></a></a-col>
      <a-col :span="24" style="margin-top: 140px;font-size: 28px">机房导览</a-col>
      <a-col v-bind="wrapperCol"><blockImg></blockImg></a-col>
      <a-col v-bind="wrapperCol"><blockImg floor="19F" title="屋面" img-url="2"></blockImg></a-col>
      <a-col v-bind="wrapperCol"><blockImg floor="-1F" title="蓄冷罐室" img-url="0"></blockImg></a-col>
      <a-col v-bind="wrapperCol"><blockImg floor="1F" title="外电室" img-url="1"></blockImg></a-col>
    </a-row>
  </div>
</template>

<script>
import titleColor from './components/title'
import blockImg from './components/block'
export default {
  name: 'Index',
  components: {
    titleColor,
    blockImg
  },
  data () {
    return {
      wrapperCol: {
        xs: { span: 6, offset: 0 },
        md: { span: 12, offset: 0 },
        xl: { span: 11, offset: 1 },
        xxl: { span: 10, offset: 2 }
      }
    }
  },
  methods: {
    tiaozhuan () {
      this.$router.push('/SecurityMonitoring/EmergencyManagement/BanList')
    }
  }
}
</script>

<style scoped>

</style>
