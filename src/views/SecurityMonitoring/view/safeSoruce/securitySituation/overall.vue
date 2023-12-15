<template>
  <div class="appContainer">
    <div class="titleC">{{ title }}</div>
    <div class="contentBox">
      <div class="img-one">
        <div class="number1 numAll">{{ objList.GlobalData.risk ? objList.GlobalData.risk : 10 }}</div>
        <div class="text1 textAll">{{ '中危' }}</div>
      </div>
      <div class="chenterBoxRight">
        <div class="right">
          <div class="text">
            <div class="left-text">业务系统数</div>
            <!-- <formatterNumber class="right-text" :number="content.topData.systemNum"/> -->
            <div class="right-text">{{ objList.GlobalData.systemNum ? objList.GlobalData.systemNum : 10 }}</div>
          </div>
          <div class="yelloBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">服务器数</div>
            <div class="right-text">{{ objList.GlobalData.serverNum ? objList.GlobalData.serverNum : 1000 }}
            </div>
            <!-- <formatterNumber class="right-text" :number="content.topData.serverNum"/> -->
          </div>
          <div class="yelloBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">漏洞数</div>
            <!-- <formatterNumber class="right-text" :number="content.topData.alarmNum"/> -->
            <div class="right-text">{{ objList.GlobalData.alarmNum ? objList.GlobalData.alarmNum : 10 }}</div>
          </div>
          <div class="yelloBotton"></div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="img-one">
        <div class="number2 numAll">
          {{ objList.AlarmData.percentage ? objList.AlarmData.percentage : '99%' }}
          <!-- {{content.centerData.percentage?content.centerData.percentage:'-'}} -->
        </div>
        <div class="text2 textAll">{{ '处置率' }}</div>
      </div>
      <div class="chenterBoxRight">
        <div class="right">
          <div class="text">
            <div class="left-text">告警总数</div>
            <!-- <formatterNumber class="right-text" :number="content.centerData.totalNum"/> -->
            <div class="right-text">
              <formatterNumber
                class="number"
                :number="objList.AlarmData.totalNum?objList.AlarmData.totalNum.toString():'182000'"
                :colors="color_black"
                :color_black04="color_black04" />
            </div>
          </div>
          <div class="bullBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">已处置</div>
            <!-- <formatterNumber class="right-text" :number="content.centerData.disposedNum"/> -->
            <!-- <div class="right-text">8.8万</div> -->
            <div class="right-text">
              <formatterNumber
                class="number"
                :number="objList.AlarmData.disposedNum?objList.AlarmData.disposedNum.toString():'88000'"
                :colors="color_black"
                :color_black04="color_black04" />
            </div>
          </div>
          <div class="bullBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">未处置</div>
            <!-- <formatterNumber class="right-text" :number="content.centerData.notDisposedNum"/> -->
            <div class="right-text">
              <formatterNumber
                class="number"
                :number="objList.AlarmData.notDisposedNum?objList.AlarmData.notDisposedNum.toString():'9500'"
                :colors="color_black"
                :color_black04="color_black04" />
            </div>
          </div>
          <div class="bullBotton"></div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="img-one">
        <div class="number3 numAll">{{ objList.VictimData.fallpercent ? objList.VictimData.fallpercent : '1%' }}</div>
        <div class="text3 textAll">{{ '失败率' }}</div>
      </div>
      <div class="chenterBoxRight">
        <div class="right">
          <div class="text">
            <div class="left-text">疑似失陷</div>
            <!-- <formatterNumber class="right-text" :number="content.bottomData.victimIpCounts" :unit="'个'" /> -->
            <div class="right-text">
              <formatterNumber
                class="number"
                :number="objList.VictimData.victimIpCounts?objList.VictimData.victimIpCounts:'15'"
                :unit="'个'"
                :colors="color_black"
                :color_black04="color_black04" />
            </div>
          </div>
          <div class="redBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">
              环比
              <img style="margin-bottom: 5px;width: 13px;height: 20px;;" :src="upImg" />
            </div>
            <!-- <formatterNumber class="right-text" :number="content.bottomData.dayPercent" :unit="'%'" /> -->
            <div class="right-text">
              <formatterNumber
                class="number"
                :number="objList.VictimData.dayPercentTrend?objList.VictimData.dayPercentTrend:'1'"
                :unit="'%'"
                :colors="color_black"
                :color_black04="color_black04" />
            </div>
          </div>
          <div class="redBotton"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bk_circle from './img/bk_circle.png'
import formatterNumber from './formatterNumber.vue'
import bk_up from './img/icon_up.png'

export default {
  name: 'OverAll',
  components: { formatterNumber },
  props: {
    title: {
      type: String,
      default: ''
    },
    objList: {
      type: null,
      default: () => ({})
    }
  },

  data () {
    return {
      upImg: bk_up,
      circleImg: bk_circle,
      color_black: 'rgba(0,0,0)',
      color_black04: 'rgba(0,0,0,0.4)'
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.number {
  font-size: 27px;
  margin-right: 6px;
}

.appContainer {
  width: 427.5px;
  height: 604px;

  :nth-child(3) {
    margin-top: 25px;
    margin-bottom: 25px;
  }
}

.contentBox {
  //   padding-top: 5px;
  padding-left: 27.5px;
  height: 174.5px;
  display: flex;

  .img-one {
    height: 174.5px;
    width: 140px;
    background: url('./img/bk_circle.png') no-repeat;
    background-size: 100%;
    background-size: contain;
    overflow: hidden;
  }
}

.title {
  margin: 10px 0 10px 30px;
  font-size: 11px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #5bbbff;
  line-height: 11px;
}

.chenterBoxRight {
  > :nth-child(1) {
    margin-top: 33.5px;
  }

  > :nth-child(2),
  > :nth-child(3) {
    margin-top: 26.5px;
  }
}

.right {
  width: 212px;
  height: 22.5px;
  // margin: 33.5px 28px 26.5px 28px;
  margin-left: 20px;
  // background: linear-gradient(270deg, rgba(0, 151, 255, 0.1) 0%, rgba(55, 140, 255, 0.31) 100%);
  border-radius: 7px;

  .text {
    display: flex;
    justify-content: space-between;

    .left-text {
      margin-left: 16px;
      margin-top: -8px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.5);
      line-height: 20px;
    }

    .right-text {
      margin-top: -15px;
      margin-right: 16px;
      font-size: 36px;
      font-family: LetsgoDigital-Regular, LetsgoDigital;
      font-weight: 400;
      color: #000;
      line-height: 36px;
    }

    .line {
      padding-left: 50px;
    }
  }
}

.numAll {
  margin-top: 59.5px;

  height: 40px;
  font-size: 36px;
  font-family: LetsgoDigital-Regular, LetsgoDigital;
  font-weight: 400;

  line-height: 40px;
  text-align: center;
}

.textAll {
  height: 21px;
  font-size: 16px;
  font-family: MicrosoftYaHeiUI-Bold, MicrosoftYaHeiUI;
  font-weight: bold;
  line-height: 21px;
  text-align: center;
}

.number1 {
  color: #FF9600;
  font-size: 42px;
}

.text1 {
  color: #FF9600;
}

.number2 {
  color: #63b8ff;
}

.text2 {
  color: #63b8ff;
}

.number3 {
  color: #dc5656;
}

.text3 {
  color: #DC5656;
}

.titleC {
  height: 18px;
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #0060A3;
  line-height: 18px;
  margin-top: 0;
  margin-left: 20.5px;
  margin-bottom: 13px;
}

.yelloBotton {
  margin: 0 16px 5px 16px;
  width: 180px;
  height: 0px;
  border-top: 2px solid #FFC300;
}

.bullBotton {
  margin: 0 16px 5px 16px;
  width: 180px;
  height: 0px;
  border-top: 2px solid #63B8FF;
}

.bullBotton {
  margin: 0 16px 5px 16px;
  width: 180px;
  height: 0px;
  border-top: 2px solid #63B8FF;
}

.redBotton {
  margin: 0 16px 5px 16px;
  width: 180px;
  height: 0px;
  border-top: 2px solid #DC5656;
}
</style>
