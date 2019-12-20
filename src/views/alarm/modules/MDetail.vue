/*
 * 告警监控信息详情
 * Author: yizhu liu
 * Date: 2019-12-20 10:36:30
 * Email: lyz02413@163.com
 */
<template>
  <a-modal
    title="告警信息"
    :width="640"
    :visible="visible"
    @ok="handleDetail"
    :loading="loading"
    @cancel="handleCancel"
  >
    <a-card
      style="100%"
      :tabList="tabList"
      :activeTabKey="key"
      @tabChange="key => onTabChange(key, 'key')"
    >

    </a-card>
  </a-modal>
</template>

<script>
export default {
  name: 'MDetail',
  data () {
    return {
      tabList: [
        {
          key: '0',
          tab: '基本信息'
        },
        {
          key: '1',
          tab: '其他信息'
        }
      ],
      key: '0',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      loading: false
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    handleDetail (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      console.log(key, type)
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
      this.$refs.table.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
