<template>
  <a-row>
    <a-col flex="7" style="background: white; height: 1060px">
      <a-row style="margin-top: 20px; margin-left: 20px; margin-right: 20px">
        <a-col flex="auto" style="font-size: 20px">
          <a @click="back"><a-icon type="left-outlined"/>&nbsp;新建告警源&nbsp;/&nbsp;{{ type }}</a>

        </a-col>
        <a-col flex="100px">
          <a-button>取消</a-button>
        </a-col>
        <a-divider style="background: rgb(236,236,236)" />
        <a-col span="24"><AlertSourceForm /></a-col>
      </a-row>
    </a-col>
    <a-col flex="20px"></a-col>
    <a-col flex="2" style="background: white;padding: 20px">
      <a-row justify="center">
        <SvgIcon :name="'svg-'+type" width="100px" height="100px"/>
      </a-row>
      <a-typography-paragraph style="margin-top: 30px">
        Pigoss 提供了一个网络和告警源监控的开源解决方案，它支持数百万的监控指标。安装Pigoss 告警源可以将 Pigoss中的告警接入到 Cloud Alert 中来，自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </a-typography-paragraph>
      <a-typography-title :level="4" style="margin-top: 30px">监控级别对应关系</a-typography-title>
      <a-table :columns="platformMapping"></a-table>
      <a-typography-title :level="4" style="margin-top: 30px">EventId对应关系</a-typography-title>
      <a-table :columns="platformMapping1"></a-table>
    </a-col>
  </a-row>
</template>

<script>

import AlertSourceForm from '../components/AlertSourceForm'
import SvgIcon from '@/components/SvgIcon/index'

export default {
  name: 'NewAlertSource',
  components: { SvgIcon, AlertSourceForm },
  props: {},
  computed: {
    platformMapping () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here'
        },
        {
          title: this.type + '(Priority)',
          dataIndex: 'there'
        }
      ]
    },
    platformMapping1 () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here'
        },
        {
          title: this.type,
          dataIndex: 'there'
        }
      ]
    }
  },
  methods: {

    back () {
      this.$router.push('platform')
    }
  },
  data () {
    const type = this.$route.query.platType

    return {
      type
    }
  }
}
</script>

<style scoped></style>
