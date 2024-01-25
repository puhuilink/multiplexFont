<template>
  <div style="background: #f0f2f5">
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <div style="background: white; padding: 20px; justify-content: space-between;display: flex;border-radius:2px">
          <a @click="back"><a-icon type="left" />&nbsp;
            {{ record !== undefined && record.id !== null ? '修改' : '新建' }}告警源&nbsp;/&nbsp;{{ platform.name }}</a
            >

          <a-button @click="back">取消</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="[24, 24]" type="flex" justify="space-between">
      <a-col :span="16" >
        <div style="background: white; height: 100%; padding: 20px;border-radius:2px;">
          <AlertSourceForm :record="record" :platform-id="platform.id" />
        </div>
      </a-col>
      <a-col :span="8" >
        <div style="background: white; padding: 20px;height: 100%;border-radius:2px">
          <center >
            <img :src="platform.url" width="100px" height="100px" />
          </center>
          <p style="margin-top: 30px;font-weight:500">
            {{ this.platform.remark ? this.platform.remark : defaultRemark }}
          </p>
          <div>
            <h3 name="mapping1" style="margin-top: 30px">监控级别对应关系</h3>
            <a-table
              :columns="platformMapping"
              :data-source="data1"
              :pagination="false"
              :row-key="(record, index) => index"
              bordered
            >
            </a-table>
          </div>
          <div>
            <h3 style="margin-top: 30px">EventId对应关系</h3>
            <a-table
              :columns="platformMapping1"
              :data-source="data2"
              :pagination="false"
              :row-key="(record, index) => index"
              bordered
            ></a-table>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import AlertSourceForm from '../components/AlertSourceForm'
import SvgIcon from '@/components/SvgIcon/index'
const defaultRemark =
  'Pigoss 提供了一个网络和告警源监控的开源解决方案，它支持数百万的监控指标。安装Pigoss 告警源可以将 Pigoss中的告警接入到 Cloud Alert 中来，自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。'
export default {
  name: 'NewAlertSource',
  components: { SvgIcon, AlertSourceForm },
  props: {},
  computed: {
    platformMapping () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here',
          width: 100,
          align: 'center'
        },
        {
          title: this.platform.name + '(Priority)',
          dataIndex: 'there',
          width: 100,
          align: 'center'
        }
      ]
    },
    platformMapping1 () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'here',
          width: 100,
          align: 'center'
        },
        {
          title: this.platform.name,
          dataIndex: 'there',
          width: 100,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push('platform')
    },
    loadPlatformList () {
      const plat = this.platform
      if (plat.levelRelation !== null && plat.levelRelation !== {}) {
        const dataList = []
        Object.keys(plat.levelRelation).forEach(level => {
          dataList.push({
            here: level,
            there: plat.levelRelation[level]
          })
        })
        this.data1 = dataList
      }
    }
  },
  data () {
    const platform = this.$route.query.plat
    const record = this.$route.query.record
    return {
      platform,
      record,
      defaultRemark,
      data1: [
        { here: 'p1', there: '5' },
        { here: 'p2', there: '4' },
        { here: 'p3', there: '2,3' },
        { here: 'p4', there: '1' },
        { here: 'p5', there: '0' }
      ],
      data2: [{ here: '告警ID\n （eventId）', there: 'eventId' }]
    }
  },
  mounted () {
    this.loadPlatformList()
  }
}
</script>

<style scoped>
.container {
  display: grid;
  background-color: #f2f3f3;
  border: 1px solid #f2f3f3;
  grid-template-columns: 2fr 30px 1fr;
  grid-template-rows: repeat(1, 1fr);
}
.ant-table-wrapper {
  padding: 0 0 !important;
}
.fakeContainer {
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 220px;
  grid-auto-rows: 1fr;
  /*grid-template-rows: repeat(1, 1fr) ;*/
  /*place-content: space-between;*/
}
</style>
