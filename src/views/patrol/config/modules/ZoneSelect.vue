
<template>
  <div class="ZoneSelect">
    <!-- eslint-disable -->
    <div class="ZoneSelect__header">
      <slot name="default">12356566</slot>
    </div>
    <div class="pageMsg_box">
      <span class="">[<a @click='plusClick' v-action:F010001001003001><a-icon type="plus"/></a>]</span>
      <a-tabs
        class="ZoneSelect__zone"
        :key="pathId"
        type="card"
        v-for="({ pathId, zoneList }) in pathList"
        v-show="pathId === options.pathId"
        v-model="options.zoneId"
      >
        <a-tab-pane v-for="({ id, alias }) in zoneList" :key="id" :tab="alias"></a-tab-pane>
      </a-tabs>
      <div class="divider"></div>
      <a-radio-group
        class="ZoneSelect__path"
        button-style="solid"
        :value="options.pathId"
        @input="changePathId"
      >
        <a-radio-button
          v-for="
          { pathId, pathName } in pathList"
          :key="pathId"
          :value="pathId">
          {{ pathName }}
        </a-radio-button>
      </a-radio-group>
    </div>

  </div>
</template>

<script>
import { PathService } from '@/api/index'
import _ from 'lodash'

export default {
  name: 'ZoneSelect',
  mixins: [],
  components: {},
  props: {
    pathId: {
      type: String,
      default: ''
    },
    pathName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pathList: [],
      options: {
        pathId: null,
        zoneId: null
      }
    }
  },
  computed: {},
  watch: {
    options: {
      deep: true,
      handler (options) {
        this.$emit('change', options)
      }
    },
    '$route.query': function (val) {
      this.fetch()
    }
  },
  methods: {
    plusClick () {
      this.$emit('plus')
    },
    changePathId (pathId) {
      const { pathList, options } = this
      const path = pathList.find((path) => pathId === path.pathId)
      Object.assign(options, {
        pathId: _.get(path, ['pathId']),
        zoneId: _.get(path, ['zoneList', '0', 'id'])
      })
    },
    async fetch () {
      const { zones, list } = await PathService.getPathList(this.pathId)
      const path = {
        pathName: this.pathName,
        pathId: list[0].pathId,
        zoneList: zones.map((z) => {
          return {
            id: z.zoneId,
            alias: z.alias
          }
        })
      }
      this.pathList = [path]
    }
  },
  async created () {
    await this.fetch()
    // 默认选中第一条路线第一个区域
    const { pathList, options } = this
    console.log(this.pathList)
    Object.assign(options, {
      pathId: _.get(pathList, ['0', 'pathId']),
      zoneId: _.get(pathList, ['0', 'zoneList', '0', 'id'])
    })
  }
}
</script>

<style lang="less">
.ZoneSelect {
  position: relative;
  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // padding-right: 8px;
  }
  .newZone_box{
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    right: 10px;
    top: 10px;
  }
  .pageMsg_box{
    position: absolute;
    display: flex;
    width: 100%;
    height: 50px;
    flex-direction: row-reverse;
    padding: 0 23px;
    line-height: 50px;

    span {
      right: 0px;

    }
  }
  &__path {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    .ant-radio-button-wrapper{
      font-size: 17px;
      color: #333 !important;
      border: 0 !important;
      background: transparent !important;
    }
  }
  .divider{
    width: 1px;
    height: 100%;
    background-color: #333;
    background-clip: content-box;
    padding: 10px 0;
  }
  &__zone {
    // margin: 8px 0 -10px 0;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    .ant-tabs-bar{
      border: 0 !important;
      margin: 0 !important;
    }
    .ant-tabs-tab{
      border: 0 !important;
      background-color: transparent !important;
    }
    .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-tab-active{
      color: #004FA5 !important;
      background-color: transparent !important;
    }
  }
}
</style>
