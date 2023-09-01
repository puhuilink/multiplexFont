<template>
  <div style="padding: 23px;">
    <a-row :gutter="[16,16]" height justify="space-between" type="flex" >
      <a-col :span="6"><a @click="tiaozhuan('/OperationMonitoring/Device')"><titleColor font="IT设备监控管理"></titleColor></a></a-col>
      <a-col :span="6"><a @click="tiaozhuan('/SecurityMonitoring/LeakSummary')"><titleColor img="1" icon="1" font="漏洞统计管理"></titleColor></a></a-col>
      <a-col :span="6"><a @click="tiaozhuan('/SecurityMonitoring/SituationalAwareness')"><titleColor img="2" icon="2" font="安全态势感知管理"></titleColor></a></a-col>
      <a-col :span="6"><a @click="tiaozhuan('/SecurityMonitoring/EmergencyManagement/BanList')"><titleColor img="3" icon="0" font="一键封禁列表"></titleColor></a></a-col>
    </a-row>
    <a-row>
      <a-col :span="24" style="margin-top: 140px;font-size: 28px">机房导览</a-col>
    </a-row>
    <a-row>
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
    tiaozhuan (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>

</style>
