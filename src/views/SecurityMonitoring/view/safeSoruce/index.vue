<template>
  <div>
    <div class="containerTOP">

      <div class="waiwang">
        <div class="flexBOX">
          <WxShip :title="'外网威胁情况'" :title1="'外网威胁等级分布'" :content="content" :data="data" :type="'1'" />
        </div>

        <div class="flexBOX">
          <OverAll :title="'全局风险态势'" :objList="objList" />
        </div>

        <div>
          <WxShip :title="'内网威胁情况'" :title1="'内网威胁等级分布'" :data="data1" :content="contentTwo" />
        </div>
      </div>

      <div>
        <div>
          <LineEcharts :threadData="ThreadData"></LineEcharts>
        </div>
      </div>
      <!-- 底部 -->

    </div>
  </div>
</template>
<script>
import WxShip from './securitySituation/wxship.vue'
import OverAll from './securitySituation/overall.vue'
import LineEcharts from './securitySituation/lineEcharts.vue'

import {
  getOuterThreatOverview,
  getGlobalRisk,
  getAlarmDispose,
  getVictimSurvey,
  getThreadTrend,
  getOuterThreatLevel,
  getInnerThreatOverview,
  getInnerThreatLevel
} from './api.js'
import { USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  name: 'SafeSoruce',
  components: { WxShip, OverAll, LineEcharts },
  data () {
    return {
      objList: {
        GlobalData: {
          compromiseHosts: 0,
          orgLogNum: 0,
          assetNum: 500,
          alarmNum: 0,
          vulNum: 0,
          num: 0,
          serverNum: 900,
          risk: 30,
          systemNum: 200
        },
        AlarmData: {
          notDisposedNum: 1000,
          disposedNum: 1000,
          totalNum: 1000,
          percentage: '10%'
        },
        VictimData: {
          dayPercent: '10.00%',
          victimIpCounts: 8,
          dayPercentTrend: 1,
          yesterdayCount: 7,
          fallPercent: '10%'
        }
      },
      ThreadData: null,
      title: '安全态势视图',
      content: [
        {
          text: '威胁总数',
          number: 130000
        },
        {
          text: '受攻击资产数',
          number: 10089
        },
        {
          text: '受攻击IP总数',
          number: 382
        }
      ],
      contentTwo: [
        {
          text: '威胁告警',
          number: 116500
        },
        {
          text: '攻击者',
          number: 85
        },
        {
          text: '受害者',
          number: 409
        }
      ],
      data: [
        {
          value: 300,
          name: '低危',
          itemStyle: {
            'color': '#3CA6FF'
          }
        },
        {
          value: 120,
          name: '中危',
          itemStyle: {
            'color': '#EAE174'
          }
        },
        {
          value: 530,
          name: '高危',
          itemStyle: {
            color: '#FFA044'
          }
        },
        {
          value: 60,
          name: '危急',
          itemStyle: {
            color: '#DC5656'
          }
        }
      ],
      data1: [
        {
          value: 300,
          name: '低危',
          itemStyle: {
            'color': '#3CA6FF'
          }
        },
        {
          value: 100,
          name: '中危',
          itemStyle: {
            'color': '#EAE174'
          }
        },
        {
          value: 500,
          name: '高危',
          itemStyle: {
            color: '#FFA044'
          }
        },
        {
          value: 600,
          name: '危急',
          itemStyle: {
            color: '#DC5656'
          }
        }
      ]
    }
  },
  mounted () {
    this.getPageData()
    this.getGlobalRiskAPI()
    this.interiorAPI()
    this.ThreadTrendAPI()
  },

  methods: {
    handleBack () {
      // console.log('back');
      // const str = { action: 'back' }
      // const jsonString = JSON.stringify(str);
      // console.log(window.$flutter_inappwebviewFn);
      // window.$flutter_inappwebviewFn.callHandler('haha', jsonString);

      this.$router.back()
    },
    // 外网威胁
    async getPageData () {
      // 获取态势感知-外部危险总览
      try {
        // 获取态势感知-外部危险总览
        const data = await getOuterThreatOverview()
        console.log('外网威胁')
        console.log(data)
        this.content[0].number = data.data.threatNum
        this.content[1].number = data.data.victimIpNum
        this.content[2].number = data.data.attackerIpNum
      } catch (error) {
        console.error('获取和处理数据出错:', error)
      }
      // 获取态势感知-外部威胁等级分布
      const OuterThreatLevelData = await getOuterThreatLevel()
      console.log('外部威胁等级分布')
      console.log(OuterThreatLevelData)
      // 将接口数据填充到this.apiData中
      this.data = OuterThreatLevelData.data.map(item => ({
        value: item.threatNum,
        name: item.threatLevelName,
        itemStyle: {
          color: this.getColorByThreatLevel(item.threatLevel)
        }
      }))
    },
    getColorByThreatLevel (level) {
      // 根据威胁等级返回对应的颜色，您可以根据需要进行定义
      switch (level) {
        case 1:
          return '#3CA6FF' // 低危
        case 2:
          return '#EAE174' // 中危
        case 3:
          return '#FFA044' // 高危
        case 4:
          return '#DC5656' // 危急
        default:
          return '#999999' // 默认颜色
      }
    },
    // 全网风险态势
    async getGlobalRiskAPI () {
      // 获取态势感知-危机数
      const GlobalRiskData = await getGlobalRisk()

      console.log('危机数')
      console.log(GlobalRiskData)

      // 获取态势感知-处置率
      const AlarmDisposeData = await getAlarmDispose()
      console.log('处置率')
      console.log(AlarmDisposeData)
      // 获取态势感知-失陷率
      const VictimSurveyData = await getVictimSurvey()
      console.log('失陷率')
      console.log(VictimSurveyData)
      const GlobalData = GlobalRiskData.data
      const AlarmData = AlarmDisposeData.data
      const VictimData = VictimSurveyData.data

      this.objList = { GlobalData, AlarmData, VictimData }
      console.log(this.objList)
    },
    // 内网威胁
    async interiorAPI () {
      // 获取态势感知-内部危险总览
      const InnerThreatOverviewData = await getInnerThreatOverview()
      console.log('内网威胁情况')
      console.log(InnerThreatOverviewData)
      this.contentTwo[0].number = InnerThreatOverviewData.data.threatWarning
      this.contentTwo[1].number = InnerThreatOverviewData.data.attackerCount
      this.contentTwo[2].number = InnerThreatOverviewData.data.victimCount
      // 获取态势感知-内部威胁等级分布
      const InnerThreatLevelData = await getInnerThreatLevel()
      // console.log('内部威胁等级分布')
      // console.log(InnerThreatLevelData)
      const nameList = ['低危', '中危', '高危', '危急']
      this.data1 = InnerThreatLevelData.data.map((item, index) => ({
        value: item.count,
        name: nameList[index],
        itemStyle: {
          color: this.getColorByThreatLevel(item.severity)
        }
      }))
    },
    // 获取态势感知-威胁告警趋势
    async ThreadTrendAPI () {
      const ThreadTrendwData = await getThreadTrend()
      console.log('威胁告警趋势')
      console.log(ThreadTrendwData)
      this.ThreadData = ThreadTrendwData.data
    }
  }

}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'LetsgoDigital-Regular';
  src: url('./securitySituation/img/Let_s_go_Digital_Regular.ttf') format('truetype');
}

.containerTOP {
  width: 100%;
  height: 100%;
  position: relative;

  .waiwang {
    display: flex;
    justify-content: space-around;
  }
}

.flexBOX {
  border-right: 1px dashed rgba(47, 108, 169, 0.34);
  padding-right: 20px;
}
</style>
