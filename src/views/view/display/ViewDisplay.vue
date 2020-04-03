<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div>描述</div>
      <a-select style="width: 300px;">
        <a-select-option
          v-for="(group, idx) in viewGroupList"
          :key="idx"
        >{{ group.view_title }}</a-select-option>
      </a-select>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="8">
          <head-info title="项目" content="56" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="图表" content="8/24" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="项目" content="2,223" :center="false" />
        </a-col>
      </a-row>
    </div>

    <div class="ViewDisplay__view-content">
      <a-row>
        <a-col
          v-for="(view, idx) in viewList"
          :key="idx"
          :xs="24"
          :md="12"
          :lg="8"
          :xxl="6"
          style="padding: 7px;"
        >
          <div class="ViewDisplay__view-item">
            <img :src="previewImg" :alt="view.view__title">
            <div class="ViewDisplay__view-item-info">
              <p class="ViewDisplay__view-item-info_title">{{ view.view_title }}</p>
              <p class="ViewDisplay__view-item-info_creator">
                <span><a-icon type="clock-circle" />{{ (view.createdate || '').replace('T', ' ') }}</span>
                <span><a-icon type="user" />{{ view.creator }}</span>
              </p>
            </div>
            {{ view.view__title }}
          </div>
        </a-col>
      </a-row>
    </div>

  </page-view>
</template>

<script>
import { mapState } from 'vuex'
import { timeFix } from '@/utils/util'
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import {
  getViewListByGroup
} from '@/api/controller/ViewGroup'
import previewImg from '@/assets/images/view__preview_default.jpg'

export default {
  name: 'ViewDisplay',
  components: {
    PageView,
    HeadInfo
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      loading: false,
      viewGroupList: [],
      viewList: [],
      previewImg
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    },
    filterviewList () {
      return this.viewList
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const [allViewList, allViewGoupList] = await getViewListByGroup()
        this.viewList = allViewList
        this.viewGroupList = allViewGoupList
      } catch (e) {
        this.viewList = []
        this.viewGroupList = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    this.fetch()
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

  .ViewDisplay__view {
    &-content {
      // margin: -12px;
    }

    &-item {
      box-sizing: border-box;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      box-shadow: 0 0 32px #f0f0f0;
      transform: scale(1);
      transition: transform .4s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
        transition: transform .4s ease;
      }

      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }

      &-info {
        padding: 12px;
        padding-bottom: 0;

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
