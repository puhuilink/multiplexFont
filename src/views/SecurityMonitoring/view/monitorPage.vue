<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="ViewDisplay-tabs">
        <a-tabs :default-active-key="activeKey" tab-position="top" @change="tabsChange">
          <a-tab-pane
            v-for="floor in indexFloor"
            :key="floor.name"
          >
            <template #tab>
              <a-icon type="instagram" />
              {{ floor.name }}
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
    <div style="overflow: hidden;"></div>
    <a-spin :spinning="isLoading">
      <transition-group name="flip-list" tag="div">
        <a-col
          class="flip-item"
          v-for="floorConfig in currentFloor"
          :key="floorConfig.cameraIndexCode"
          :id="floorConfig.cameraIndexCode"
          :xs="24"
          :md="12"
          :lg="8"
          :xxl="6"
        >
          <div class="ViewDisplay-item" @click="preview(floorConfig)">
            <img v-lazy="thumbnail(floorConfig.icon)" :alt="floorConfig.view_title" />
            <div class="ViewDisplay-item-info">
              <div class="ViewDisplay-item-info_title">
                <!--                <img :src="require('../static/icon_camera.png')">-->
                <span>{{ floorConfig.title }}</span>
              </div>
            </div>
          </div>

        </a-col>
      </transition-group>
      <player ref="childRef"></player>
    </a-spin>
  </div>
</template>
<script>
// import player from './player'
import player from './VideoPlayer'
import { axios, xungeng } from '@/utils/request'

export default {
  name: 'MonitorPage',
  components: {
    player
  },
  data () {
    return {
      loading: false,
      url: process.env.VUE_APP_QUOTE_URL,
      isLoading: false,
      activeKey: '5F数据中心机房',
      indexFloor: [
        {
          name: '5F数据中心机房',
          children: {
            floor: [
              {
                icon: require('../static/5F_PEIB2.png'),
                title: '配电室B2',
                cameraIndexCode: '06e912e65d4d48bea13524779d7324d8'
              },
              {
                icon: require('../static/5F_NANDONG.png'),
                title: '南通道东',
                cameraIndexCode: '6a4989452f1b496080581d7596d685ec'
              },
              {
                icon: require('../static/5F_ZHONG.png'),
                title: '中通道 ',
                cameraIndexCode: '642b12aad2dc4fbeaf33e3ab5357ecd1'
              },
              {
                icon: require('../static/5F_DONGNAN.png'),
                title: '东通道南',
                cameraIndexCode: '0d94f7792b0341839cd994c0680ecab5'
              },
              {
                icon: require('../static/5F_BEIXI.png'),
                title: '机房A北走道西',
                cameraIndexCode: '5f106d7f672b454bbb3ac116cac3ad73'
              },
              {
                icon: require('../static/5F_UPS2.png'),
                title: '暖通及弱电UPS室2',
                cameraIndexCode: 'ac6c91d2b88f41e4a52d39b6aab70614'
              }
            ]
          }
        },
        {
          name: '19F屋面',
          children: {
            floor: [{
              icon: require('../static/19F_1801.png'),
              title: '18楼天台01',
              cameraIndexCode: 'ad048dc547904beea4b1d2e7b1ca3487'
            }]
          }
        },
        {
          name: '-1F蓄冷罐室',
          children: {
            floor: [{
              icon: require('../static/-1F_01.png'),
              title: '蓄冷罐室通道1',
              cameraIndexCode: '18532b50c7724ac0bf40dc6d050b9ccd'
            }]
          }
        },
        {
          name: '1F外电室',
          children: {
            floor: [
              {
                icon: require('../static/1F_NEI.png'),
                title: '柴发机房大门内过道',
                cameraIndexCode: '3b951d2e2cdc4165b221918dd750a25c'
              },
              {
                icon: require('../static/1F_XI.png'),
                title: '柴发机房西门',
                cameraIndexCode: '8733963ea65b4c2aa81c08a354d0d25e'
              },
              {
                icon: require('../static/1F_WAINAN.png'),
                title: '外电室南门',
                cameraIndexCode: 'b89b44d0f0db468788582da3e19b6d8a'
              },
              {
                icon: require('../static/1F_WAIDONG.png'),
                title: '外电室东门',
                cameraIndexCode: 'b3399635eb304017a7904a00fc33b598'
              }
            ]
          }
        }
      ],
      currentFloor: [
        {
          icon: require('../static/5F_PEIB2.png'),
          title: '配电室B2',
          cameraIndexCode: '06e912e65d4d48bea13524779d7324d8'
        },
        {
          icon: require('../static/5F_NANDONG.png'),
          title: '南通道东',
          cameraIndexCode: '6a4989452f1b496080581d7596d685ec'
        },
        {
          icon: require('../static/5F_ZHONG.png'),
          title: '中通道 ',
          cameraIndexCode: '642b12aad2dc4fbeaf33e3ab5357ecd1'
        },
        {
          icon: require('../static/5F_DONGNAN.png'),
          title: '东通道南',
          cameraIndexCode: '0d94f7792b0341839cd994c0680ecab5'
        },
        {
          icon: require('../static/5F_BEIXI.png'),
          title: '机房A北走道西',
          cameraIndexCode: '5f106d7f672b454bbb3ac116cac3ad73'
        },
        {
          icon: require('../static/5F_UPS2.png'),
          title: '暖通及弱电UPS室2',
          cameraIndexCode: 'ac6c91d2b88f41e4a52d39b6aab70614'
        }
      ]
    }
  },
  methods: {

    tabsChange (name) {
      this.activeKey = name
      this.isLoading = true
      this.currentFloor = this.indexFloor.filter(el => el.name === name)[0].children.floor
      this.isLoading = false
    },
    async preview (fun) {
      this.$refs.childRef.visible = true
      const { data: { data: { url } } } = await xungeng.post('/so/camera/getPreviewUrl', {
        cameraIndexCode: fun.cameraIndexCode
      })
      this.$refs.childRef.childMethod(url, fun.title)
    },
    thumbnail (src) {
      return src
    }
  },
  async created () {
    const { data: { dataIds } } = await axios.get('/organize/list', {
      params: {
        isOpen: true
      }
    })
    if (!dataIds.some(el => ['77551146956226560', '77550822937853952'].includes(el))) {
      this.$router.push({
        path: '/403'
      })
    }
    this.activeKey = this.$route.query.active || '5F数据中心机房'
    this.currentFloor = this.indexFloor.filter(el => el.name === this.activeKey)[0].children.floor
  }
}
</script>

<style lang="less" scoped>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0) !important;
}

.ViewDisplay {
  position: relative;

  &-header {
    padding: 12px 22px 14px 22px;
    // 父元素给了 24px 的左右 margin，当 header 吸顶时两侧会有留白，此处给占满宽度
    margin: 0 -24px 0 -24px;
    width: calc(100% + 48px);
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 64px;
    background-color: rgb(255, 255, 255);
    z-index: 9;
    overflow: hidden;
  }

  &-spin {
    width: 100%;
    height: calc(100vh - 230px);
  }

  &-item {
    box-sizing: border-box;
    // 固定宽高比
    width: 95%;
    height: 0;
    padding-bottom: calc(100% / 16 * 9 + 40px);
    //border: 1px solid #f0f0f0;
    border-radius: 4px;
    box-shadow: 0 0 32px #f0f0f0;
    transform: scale(1);
    transition: transform 0.4s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
      transition: transform 0.4s ease;
    }

    img {
      position: absolute;
      top: 35px;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      width: 100%;
      height: calc(100% - 40px);
      border-radius: 4px;
    }

    &-info {
      position: absolute;
      right: 0;
      top: 0px;
      left: 0;
      padding: 7px;
      height: 40px;

      &_title {
        font-family: 微软雅黑;
        font-size: 16px;
        font-weight: bold;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        color: rgb(51, 51, 51);
        overflow: hidden;
        margin: 0px 0px 8px;
        //img {
        //  width: 24px;
        //  height: 20px;
        //  top: 8px;
        //  left: 2px;
        //}

        span {
          vertical-align: center;
          position: relative;
          margin-left: 22px;
        }

        span::before {
          content: url('../static/icon_camera.png');
          display: inline-block;
          position: absolute;
          left: -22px;
          top: 1px;
        }
      }

      &_creator {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        span {
          line-height: 12px;
          overflow: hidden;
          margin: 2px 0 2px 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          background-repeat: no-repeat;
          background-size: contain;
          font-family: 微软雅黑;
          font-size: 12px;
          color: rgb(124, 132, 145);
        }
      }
    }
  }
}
</style>
