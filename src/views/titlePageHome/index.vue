<template>
  <div style="padding: 23px;background: #EFF0F4 ">
    <div class="shortcut">
      <div class="shortcut_1">快捷功能</div>
      <div style="display: flex">
        <div v-for="(item, index) in menuItems" :key="index" >
          <a @click="tiaozhuan(item.route)">
            <titleColor :img="item.img" :font="item.label"></titleColor>
          </a>
        </div>
      </div>
    </div>

    <a-row>
      <a-col :span="12">
        <a-button type="primary">
          Primary
        </a-button>
      </a-col>
      <a-col :span="12">
        col-12
      </a-col>
    </a-row>
    <!--    <a-row>-->
    <!--      <a-col :span="24" style="margin-top: 40px;font-size: 28px">机房导览</a-col>-->
    <!--    </a-row>-->

  </div>
</template>

<script>
import titleColor from './components/title'
// import blockImg from './components/block'
import { axios } from '@/utils/request'
export default {
  name: 'TitlePageHome',
  components: {
    titleColor
  },
  data () {
    return {
      wrapperCol: {
        xs: { span: 6, offset: 0 },
        md: { span: 12, offset: 0 },
        xl: { span: 11, offset: 1 },
        xxl: { span: 10, offset: 2 }
      },
      menuItems: [
        { route: '/', img: require('./assets/jkjc.png'), label: '监控集成' },
        { route: '/', img: require('./assets/zjgl.png'), label: '主机管理' },
        { route: '/', img: require('./assets/zjgl.png'), label: '虚拟化管理' },
        { route: '/', img: require('./assets/wltp.png'), label: '网络拓扑' },
        { route: '/', img: require('./assets/gjjc.png'), label: '告警集成' },
        { route: '/', img: require('./assets/gjclsz.png'), label: '告警策略设置' },
        { route: '/', img: require('./assets/gjlb.png'), label: '告警列表' },
        { route: '/', img: require('./assets/xgljsz.png'), label: '巡更路径设置' },
        { route: '/', img: require('./assets/xgjhgl.png'), label: '巡更计划管理' },
        { route: '/', img: require('./assets/zcgl.png'), label: '资产管理' }
      ]
    }
  },
  methods: {
    tiaozhuan (path) {
      console.log('path', path)
      // this.$router.push(path)
    }
  },
  async mounted () {
    /* try {
      const { data } = await axios.get('/organize/getMyMachine')
      if (data) {
        this.imgUrl = `${process.env.VUE_APP_QUOTE_URL}/view_thumbnail${data}`
      } else {

      }
    } catch (e) {

      throw e
    } */
  }
}
</script>

<style lang="less" scoped>
.shortcut{
  width: 100%;
  height: 180px;
  background: #FFFFFF;
  border-radius: 8px;
  .shortcut_1{
    //margin-top: 26px;
    //margin-left: 23px;
    margin-bottom: 27px;
    height: 21px;
    font-size: 16px;
    //font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 21px;
  }
}
</style>
