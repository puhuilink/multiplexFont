<template>
  <div>
    <div class="containerTOP">

      <div class="waiwang">
        <div style="border-right:1px dashed rgba(47,108,169,0.34)">
          <WxShip :title="'外网威胁情况'" :title1="'外网威胁等级分布'" :content="content" :data="data" :type="'1'" />
        </div>

        <div style="border-right: 1px dashed rgba(47,108,169,0.34)">
          <OverAll :title="'全局风险态势'" :content="content" />
        </div>

        <div>
          <WxShip :title="'内网威胁情况'" :title1="'内网威胁等级分布'" :data="data1" :content="contentTwo" />
        </div>
      </div>

      <div>
        <div>
          <LineEcharts></LineEcharts>
        </div>
      </div>
      <!-- 底部 -->

   
    </div>
  </div>
</template>
<script>
import WxShip from './securitySituation/wxship.vue';
import OverAll from './securitySituation/overall.vue';
import LineEcharts from './securitySituation/lineEcharts.vue';

import {
  getOuterThreatOverview,
  getGlobalRisk,
  getAlarmDispose,
  getVictimSurvey,
  getThreadTrend,
  getOuterThreatLevel,
  getInnerThreatOverview,
  getInnerThreatLevel,
} from './api.js';

export default {
  name: 'safeSoruce',
  components: { WxShip, OverAll, LineEcharts},
  data() {
    return {

      title: '安全态势视图',
      content: [
        {
          text: '威胁总数',
          number: '130000',
        },
        {
          text: '受攻击资产数',
          number: '143',
        },
        {
          text: '受攻击IP资产数',
          number: '382',
        },
      ],
      contentTwo: [
        {
          text: '威胁告警',
          number: '1165',
        },
        {
          text: '攻击者',
          number: '85',
        },
        {
          text: '受害者',
          number: '409',
        },
      ],
      data: [
        { value: 15, name: '紧急', itemStyle: { color: '#DC5656' } },
        { value: 56, name: '高危', itemStyle: { color: '#FFA044' } },
        { value: 9, name: '中危', itemStyle: { color: '#EAE174' } },
        { value: 20, name: '低危', itemStyle: { color: '#3CA6FF' } },
      ],
      data1: [
        { value: 29, name: '紧急', itemStyle: { color: '#DC5656' } },
        { value: 13, name: '高危', itemStyle: { color: '#FFA044' } },
        { value: 56, name: '中危', itemStyle: { color: '#EAE174' } },
        { value: 2, name: '低危', itemStyle: { color: '#3CA6FF' } },
      ],
    };
  },
  mounted() {
    this.getPageData();
    this.getGlobalRiskAPI();
    this.interiorAPI();
  },
  methods: {
    handleBack() {
      // console.log('back');
      // const str = { action: 'back' }
      // const jsonString = JSON.stringify(str);
      // console.log(window.$flutter_inappwebviewFn);
      // window.$flutter_inappwebviewFn.callHandler('haha', jsonString);

      this.$router.back();
    },
    // 外网威胁
    async getPageData() {
      // 获取态势感知-外部危险总览
      const data = await getOuterThreatOverview();
      console.log('外部危险总览');
      console.log(data);
      if (data.data.data) {
        this.content[0].number = data.data.data.attackAssetNum;
        this.content[1].number = data.data.data.threatNum;
        this.content[2].number = data.data.data.attackIpNum;
      }
      // 获取态势感知-外部威胁等级分布
      const OuterThreatLevelData = await getOuterThreatLevel();
      console.log('外部威胁等级分布');
      console.log(OuterThreatLevelData);
    },
    // 全网风险态势
    async getGlobalRiskAPI() {
      // 获取态势感知-危机数
      const GlobalRiskData = await getGlobalRisk();
      console.log('危机数');
      console.log(GlobalRiskData);
      // 获取态势感知-处置率
      const AlarmDisposeData = await getAlarmDispose();
      console.log('处置率');
      console.log(AlarmDisposeData);
      // 获取态势感知-失陷率
      const VictimSurveyData = await getVictimSurvey();
      console.log('失陷率');
      console.log(VictimSurveyData);
    },
    // 内网威胁
    async interiorAPI() {
      // 获取态势感知-内部危险总览
      const InnerThreatOverviewData = await getInnerThreatOverview();
      console.log('内部危险总览');
      console.log(InnerThreatOverviewData);
      // 获取态势感知-内部威胁等级分布
      const InnerThreatLevelData = await getInnerThreatLevel();
      console.log('内部威胁等级分布');
      console.log(InnerThreatLevelData);
    },
    // 获取态势感知-威胁告警趋势
    async interiorAPI() {
      const ThreadTrendwData = await getThreadTrend();
      console.log('威胁告警趋势');
      console.log(ThreadTrendwData);
    },
  },
};
</script>

<style lang="less" scoped>
.containerTOP {
  width: 100%;
  height: 100%;
  // background: linear-gradient(180deg, #021629 0%, #17324e 100%);
  // border: 1px solid;
  // border-image: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(76, 146, 212, 1)) 1 1;
  position: relative;

  .waiwang {
    display: flex;


  }
}
</style>
