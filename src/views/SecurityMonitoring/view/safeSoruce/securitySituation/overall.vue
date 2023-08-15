<template>
  <div class="appContainer">
    <div class="titleC">{{ title }}</div>
    <div class="contentBox">
      <div class="img-one">
        <!-- <div class="number1 numAll">{{content.topData.risk?content.topData.risk:'-'}}</div> -->
        <div class="number1 numAll">{{ 36 }}</div>
        <div class="text1 textAll">{{ '中危' }}</div>
      </div>
      <div class="chenterBoxRight">
        <div class="right">
          <div class="text">
            <div class="left-text">业务系统数</div>
            <!-- <formatterNumber class="right-text" :number="content.topData.systemNum"/> -->
            <div class="right-text">486</div>
          </div>
          <div class="yelloBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">服务器数</div>
            <div class="right-text">1013</div>
            <!-- <formatterNumber class="right-text" :number="content.topData.serverNum"/> -->
          </div>
          <div class="yelloBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">漏洞数</div>
            <!-- <formatterNumber class="right-text" :number="content.topData.alarmNum"/> -->
            <div class="right-text">0</div>
          </div>
          <div class="yelloBotton"></div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="img-one">
        <div class="number2 numAll">
          {{ '48%' }}
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
              <formatterNumber class="number" :number="'182000'" />
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
              <formatterNumber class="number" :number="'88000'" />
            </div>
          </div>
          <div class="bullBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">未处置</div>
            <!-- <formatterNumber class="right-text" :number="content.centerData.notDisposedNum"/> -->
            <div class="right-text">
              <formatterNumber class="number" :number="'950000'" />
            </div>
          </div>
          <div class="redBotton"></div>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="img-one">
        <div class="number3 numAll">{{ '1%' }}</div>
        <div class="text3 textAll">{{ '失败率' }}</div>
      </div>
      <div class="chenterBoxRight">
        <div class="right">
          <div class="text">
            <div class="left-text">疑似失陷</div>
            <!-- <formatterNumber class="right-text" :number="content.bottomData.victimIpCounts" :unit="'个'" /> -->
            <div class="right-text">
              <formatterNumber class="number" :number="'15'" :unit="'个'" />
            </div>
          </div>
          <div class="redBotton"></div>
        </div>
        <div class="right">
          <div class="text">
            <div class="left-text">
              环比
              <img style="margin-left: 2px" :src="upImg" />
            </div>
            <!-- <formatterNumber class="right-text" :number="content.bottomData.dayPercent" :unit="'%'" /> -->
            <div class="right-text">
              <formatterNumber class="number" :number="'1'" :unit="'%'" />
            </div>
          </div>
          <div class="redBotton"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bk_circle from './img/bk_circle.png';
import formatterNumber from './formatterNumber.vue'
export default {
  name: 'overAll',
  components: { formatterNumber },
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: Array,
      default: ()=>{},
    },
  },

  data() {
    return {
      circleImg: bk_circle,

    };
  },
  methods: {},
};
</script>

<style lang="less" >
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
  background: linear-gradient(270deg, rgba(0, 151, 255, 0.1) 0%, rgba(55, 140, 255, 0.31) 100%);
  border-radius: 7px;

  .text {
    display: flex;
    justify-content: space-between;

    .left-text {
      margin-left: 16px;
      margin-top: -8px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #6cd5ff;
      line-height: 14px;
    }

    .right-text {
      margin-top: -15px;
      margin-right: 16px;
      font-size: 27px;
      font-family: LetsgoDigital-Regular, LetsgoDigital;
      font-weight: 400;
      color: #ffffff;
      line-height: 27px;
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
  color: #eae174;
}

.text1 {
  color: #eae174;
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
  color: #5bbbff;
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
