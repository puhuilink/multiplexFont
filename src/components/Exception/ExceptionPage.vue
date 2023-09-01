<template>
  <div class="exception">
    <div>
      <div class="imgBlock">
        <div v-if="config[type].title==='403'" class="imgEle" :style="{ backgroundImage: `url(${require('@/assets/images/403.svg')})` }">
        </div>
        <div v-else class="imgEle" :style="{backgroundImage: `url(${config[type].img})`}">
        </div>
      </div>
      <div class="content" style="text-align: center;">
        <!-- <h1>{{ config[type].title }}</h1> -->
        <div class="desc">{{ config[type].desc }}</div>
        <div class="actions">
          <slot name="actions">
            <a-button type="primary" @click="handleToHome">返回首页</a-button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import types from './type'
import { logicPathList } from '@/config/router.config'
import { mapGetters } from 'vuex'

export default {
  name: 'Exception',
  props: {
    type: {
      type: String,
      default: '404'
    }
  },
  data () {
    return {
      config: types
    }
  },
  computed: {
    ...mapGetters(['addRouters'])
  },
  methods: {
    handleToHome () {
      // 不同用户的路由权限不同，需要找出能访问到的第一个页面作为默认页面
      // 作为 fallback，每个用户至少都有一个重置密码的页面
      const { addRouters } = this
      const currentPathList = addRouters[0].children.map(({ path }) => path)
      const path = currentPathList.find(path => logicPathList.includes(path))
      this.$router.push(path)
    }
  }
}
</script>
<style lang="less">
@import "~ant-design-vue/lib/style/index";

.exception {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 80%;
  min-height: 500px;

  .imgBlock {
    display: flex;
    margin: 0 auto;
    width: 62.5%;
    zoom: 1;
    margin-bottom: 20px;
    &::before,
    &::after {
      content: ' ';
      display: table;
    }
    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }
  }

  .imgEle {
    width: 835px;
    max-width: 835px;
    height: 300px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }

  .content {
    // flex: auto;

    h1 {
      margin-bottom: 24px;
      color: #434e59;
      font-weight: 600;
      font-size: 72px;
      line-height: 72px;
    }

    .desc {
      margin-bottom: 16px;
      color: @text-color-secondary;
      font-size: 20px;
      line-height: 28px;
    }

    .actions {
      button:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}

@media screen and (max-width: @screen-xl) {
  .exception {
    .imgBlock {
      padding-right: 88px;
    }
  }
}

@media screen and (max-width: @screen-sm) {
  .exception {
    display: block;
    text-align: center;
    .imgBlock {
      margin: 0 auto 24px;
      padding-right: 0;
    }
  }
}

@media screen and (max-width: @screen-xs) {
  .exception {
    .imgBlock {
      margin-bottom: -24px;
      overflow: hidden;
    }
  }
}
</style>
