<!--
 * @Author: 刘奕竹
 * @Date: 2019-12-03 14:13:22
 * @LastEditTime: 2019-12-06 11:31:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-zj\src\views\alarm\monitor\AlarmMonitor.vue
 -->
<template>
  <!--S 告警监控 lyz  lyz02413@163.com -->
  <div class="alarm-monitor">
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="key"
      @tabChange="key => onTabChange(key, 'key')"
    >
      <!-- S- 公共操作区 -->
      <div slot="headerContent">

      </div>

      <!-- E- 公共操作区 -->

    </a-card>
  </div>
</template>

<script>
export default {
  name: 'AlarmMonitor',
  data () {
    return {
      tabList: [
        {
          key: 'pending',
          tab: '待处理告警'
        },
        {
          key: 'confirmed',
          tab: '已确认告警'
        },
        {
          key: 'shifting',
          tab: '已前转告警'
        },
        {
          key: 'resolved',
          tab: '已解决告警'
        },
        {
          key: 'ignore',
          tab: '已忽略告警'
        }
      ]
    }
  },
  methods: {
    onTabChange (key, type) {
      console.log(key, type)
      this[type] = key
    }
  }
}
</script>

<style scoped lang="less">

</style>
