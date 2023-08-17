<template>
  <div class="wrapper">
    <!-- flex布局 -->

    <!-- 视图主体 -->
    <div class="wrapper_content">
      <div class="content_left">
        <div class="content_item">
          <div class="content_item_title">总览</div>
          <div class="content_item_article overdiv">
            <div class="overdiv_mini">
              <div class="overdiv_item" v-for="(item) in overdiv" :key="item.id">
                <!-- background: 'url(' + item.img + ')', -->
                <!-- <img :src="require(item.img)" alt=""> -->
                <div :class="'overdiv_icon' + ' img' + item.id"></div>
                <div class="overdiv_detail">
                  <div class="detail_name">
                    {{ item.title }}
                  </div>
                  <div class="detail_bottom">
                    <div class="detail_count">
                      {{ item.count }}
                    </div>
                    <div class="detail_unit">
                      {{ item.unit }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="overdiv_total">
              <div class="total_wrapper" v-for="(item) in total" :key="item.id">
                <div class="bg_wrapper">
                  <div class="total_title">
                    {{ item.title }}
                  </div>
                  <div class="total_count">
                    {{ item.count }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content_item divs_wrapper">
          <div class="content_item_wrapper">
            <div class="content_item_title">设备种类数量</div>
            <div class="divs_item divs_catogary_title"></div>
          </div>

          <div class="content_item_wrapper">
            <div class="content_item_title">告警数量统计</div>
            <div class="divs_item divs_catogary_status"></div>
          </div>

          <div class="content_item_title" style="display: none">视图</div>
          <div class="content_item_article divs" style="display: none"></div>
        </div>
      </div>

      <div class="content_right">
        <div class="content_item" style="height: 100%">
          <div class="content_item_title">详情</div>
          <div class="content_item_article details">
            <div class="details_wrapper" v-for="(item) in details" :key="item.id">
              <div class="count_wrapper">
                <div class="count_laebl">设备总数：</div>
                <div class="count_value">
                  {{ item.total }}
                </div>
              </div>
              <div class="count_wrapper">
                <div class="count_laebl">异常数量：</div>
                <div class="count_value">
                  {{ item.error }}
                </div>
              </div>
              <div class="count_wrapper">
                <div class="count_laebl">告警数量：</div>
                <div class="count_value warn_unit">
                  {{ item.warn }}
                </div>
              </div>
              <div class="details_title">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <Tabbar/> -->
  </div>
</template>

<script>
import json from './api.json'
import * as echarts from 'echarts'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'
// import Tabbar from '@/components/Tabbar.vue';
import {
  title_option,
  status_option,
  sql,
  SqlTextService,
  SqlTextJhj,
  SqlTextFireWare,
  SqlTextLyq,
  SqlTextDatabase,
  SqlTextMiddle,
  SqlTextXg
} from './api.js'

export default {
  //  components: {
  //   Tabbar
  // },
  data () {
    return {
      overdiv: [],
      total: [],
      details: []

    }
  },
  created () {
    const { overdiv, total, details } = json
    this.overdiv = overdiv
    this.total = total
    this.details = details
    this.getData()
  },
  mounted () {
    // this.getJson();
    this.initEchart()
  },
  onLoad (option) {
    // const token = option.token;
    // get();
  },
  methods: {
    getData () {
      /* this.getService();
      this.getJhj();
      this.getFireWare();
      this.getLyq();
      this.getDataBase();
      this.getMiddleWare();
      this.getXg(); */
      console.log(process.env.VUE_APP_SERVER_PATH)
    },
    // 服务器数据
    async getService () {
      // 转换成promise
      let group = []
      group = SqlTextService.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '服务器数据')
      this.details = this.details.map((v) => {
        if (v.title === '服务器') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    // 交换机
    async getJhj () {
      // 转换成promise
      let group = []
      group = SqlTextJhj.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '交换机')
      this.details = this.details.map((v) => {
        if (v.title === '交换机') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    async getFireWare () {
      // 转换成promise
      let group = []
      group = SqlTextFireWare.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '防火墙')
      this.details = this.details.map((v) => {
        if (v.title === '防火墙') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    // 路由器
    async getLyq () {
      // 转换成promise
      let group = []
      group = SqlTextLyq.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '路由器')
      this.details = this.details.map((v) => {
        if (v.title === '路由器') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    async getDataBase () {
      // 转换成promise
      let group = []
      group = SqlTextDatabase.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '数据库')
      this.details = this.details.map((v) => {
        if (v.title === '数据库') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    async getMiddleWare () {
      // 转换成promise
      let group = []
      group = SqlTextMiddle.map((v) => sql(v))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '中间件')
      this.details = this.details.map((v) => {
        if (v.title === '中间件') {
          return {
            ...v,
            total: end[0],
            warn: end[2],
            error: end[1]
          }
        }
        return v
      })
    },
    async getXg () {
      // 转换成promise
      let group = []
      const title = SqlTextXg.map((v) => v.title)
      group = SqlTextXg.map((v) => sql(v.sql))
      const result = await Promise.all(group)
      const end = result.map((v) => {
        v = v.reduce((pre, next) => {
          return pre.concat(next)
        }, [])
        return v[1]
      })
      console.log(end, '巡更')
      this.total = this.total.map((v) => {
        title.forEach((s, si) => {
          if (s === v.title) {
            v = {
              ...v,
              count: end[si]
            }
            console.log(v, ',,,')
          }
        })
        return v
      })
    },
    initEchart () {
      // 初始化 echarts 实例
      const chart = echarts.init(document.querySelector('.divs_catogary_title'))
      const chart_status = echarts.init(document.querySelector('.divs_catogary_status'))
      // 配置选项
      const option = title_option

      // 渲染图表
      chart.setOption(option)
      chart_status.setOption(status_option)
    },
    handleBack () {
      console.log('back')
      this.$router.go(-1)
      // const jsonString = JSON.stringify(str);
      // 	window.$flutter_inappwebviewFn.callHandler('haha', jsonString);
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 128px) {
  .img1 {
    background: url('./img/icon_cabinet.png') no-repeat center;
    background-size: 60px;
  }
  .img2 {
    background: url('./img/icon_cabinet.png') no-repeat center;
    background-size: 60px;
  }
  .img3 {
    background: url('./img/icon_cabinet.png') no-repeat center;
    background-size: 60px;
  }
  .img4 {
    background: url('./img/icon_cabinet_fat.png') no-repeat center;
    background-size: 60px;
  }
  .img5 {
    background: url('./img/icon_cabinet_xp.png') no-repeat center;
    background-size: 60px;
  }
  .img6 {
    background: url('./img/icon_cabinet_nc.png') no-repeat center;
    background-size: 60px;
  }
  .img7 {
    background: url('./img/icon_cabinet_nc.png') no-repeat center;
    background-size: 60px;
  }
  .img8 {
    background: url('./img/icon_cabinet_nc.png') no-repeat center;
    background-size: 60px;
  }
  .img9 {
    background: url('./img/icon_cabinet_nc.png') no-repeat center;
    background-size: 60px;
  }
  .wrapper {
    border-image: linear-gradient(180deg, rgba(131, 196, 236, 1), rgba(76, 146, 212, 1)) 1 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0px 30px 55px 30px;
    width: 100%;

    .wrapper_content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      margin-top: 9px;

      .content_left,
      .content_right {

        .content_item {
          display: flex;
          flex-direction: column;

          .content_item_title {
            height: 20px;
            font-size: 20px;
            margin-bottom: 7.5px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0060A3;
            line-height: 20px;
          }

          .content_item_article {
            width: 667px;
            height: 380px;
            // background: rgba(31, 60, 94, 0.4);
            box-sizing: border-box;
            padding-top: 25px;
            padding-left: 32.5px;
          }
        }
      }

      .content_left {
        width: 674.5px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .overdiv {
          //   height: 217px;
          display: flex;
          flex-direction: column;
          width: 590px;
          height: 400px !important;
          background: #edeff2;
          // opacity: 0.4;

          .overdiv_mini {
            display: flex;
            flex-wrap: wrap;
            height: 274px;
            width: 100%;

            .overdiv_item {
              flex: 1 1 33.33%;
              display: flex;
              align-items: center;
              margin-bottom: 16px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            :nth-child(7),
            :nth-child(8),
            :nth-child(9){
              margin-bottom: 0px;
            }

            .overdiv_detail {
              flex: 1;
              display: flex;
              flex-direction: column;
            }

            .detail_name {
              //   width: 64px;
              height: 14px;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(0, 0, 0, 1);
              line-height: 14px;
            }

            .detail_bottom {
              display: flex;
              align-items: center;
              padding-top: 8px;

              .detail_count {
                width: 70px;
                height: 21px;
                font-size: 21px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #1BBF90;
                line-height: 25px;
              }

              .detail_unit {
                width: 18px;
                height: 18px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9ac0f4;
                line-height: 25px;
                text-align:unset;
              }
            }
          }
           .overdiv_mini >:nth-child(1) .detail_bottom,
          .overdiv_mini >:nth-child(4) .detail_bottom,
            .overdiv_mini >:nth-child(7) .detail_bottom {
              width: 85px;
                  justify-content: space-between;
            }
          .overdiv_icon {
            width: 29.32%;
            height: 100%;
            object-fit: cover;
            margin-right: 7.8px;

          }

          .overdiv_total {
            display: flex;
            height: 112px;
            width: 100%;
            margin-top: 15px;

            .total_wrapper {
              flex: 1 1 25%;

              .bg_wrapper {
                width: 120px;
                height: 88px;
                background: rgba(107, 179, 255, 0.12);
                background: url('./img/txt_bk01.png') no-repeat center;
                background-size: cover;

                .total_title {
                  width: 100%;
                  // height: 17px;
                  font-size: 12px;
                  // margin-top: 9.5px;
                  padding-top: 5px;
                  text-align: center;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #000;
                  line-height: 32px;
                  // text-shadow: 0px 0px 5px rgba(0, 88, 255, 0.66);
                }
                .total_count {
                  width: 100%;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  font-size: 20px;
                  font-family: PingFangSC-Light, PingFang SC;
                  font-weight: 400;
                  color: #017BFF;
                  line-height: 31px;
                }
              }
            }
          }
        }

        .divs_wrapper {
          width: 630px;
          height: 66.5px !important;
          margin-top: 10px;

          flex: 1;
          display: flex;
          flex-direction: row;
          background-color: transparent !important;
          //   justify-content: space-around;

          .content_item_wrapper {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            border: none;

            &:nth-child(1) {
              margin-right: 34px;
            }

            .divs_item {
              width: 315px;
              height: 210px;
            }
          }
        }

        .divs {
          height: 100%;
          flex: 1;
          padding: 0 !important;
          display: flex;
          background: transparent !important;

          .divs_item {
            flex: 1 1 auto;
          }
        }
      }

      .content_right {
        flex: 1;
        height: 675px;
        width: 583px;
        margin-left: 26px;
        overflow: hidden;

        .details {
          flex: 1;
          padding: 41.5px 25px 43px 25px !important;
          //   padding-top: 41px !important;
          //   padding-left: 25px !important;
            background: #edeff2;
          justify-content: space-around;
          border-top:1px solid #dae1e9 ;
        }

        .content_item_article {
          //   padding: 25px 24.9px 14.65px 22.56px;

          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;

          .details_wrapper {
            width: 240px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 40px;
            height: 150px;
            background: url('./img/tjBK_01.png') no-repeat bottom;
            background-size: 240px;
            &:nth-child(2n) {
              margin-right: 0;
            }
            &:nth-of-type(-n + 4) {
              margin-bottom: 55px;
            }
            .count_wrapper {
              display: flex;
              width: 100%;
              //   margin-bottom: 2.27px;

              .count_laebl {
                // padding-left: 31.5px;
                margin-left: 6px;
                margin-top: 5px;
                box-sizing: border-box;
                width: 90px;
                height: 23px;
                font-size: 16px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color:rgba(0,0,0,0.5);
                line-height: 28px;
              }

              .count_value {
                // margin-left: 37px;

                position: relative;
                text-align: right;
                width: 90px;
                height: 30px;
                font-size: 25px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #017BFF;
                line-height: 30px;

                &::after {
                  content: '台';
                  display: block;
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  right: -40px;
                  height: 28px;
                  font-size: 20px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(0,0,0,0.5);
                  line-height: 28px;
                  letter-spacing: 2px;
                  margin: 0 10px;
                }
              }

              .warn_unit {
                &::after {
                  content: '台';
                }
              }
            }

            .details_title {
              margin-top: auto;

              //   width: 58px;
              height: 25px;
              font-size: 18px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333;
              line-height: 25px;
              letter-spacing: 2px;
              // text-shadow: 0px 0px 9px rgba(0, 88, 255, 0.66);
            }
          }
        }
      }
    }
  }
}
</style>
