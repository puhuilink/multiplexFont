/**
* 图片配置模板
* Author: dong xing
* Date: 2020/3/25
* Time: 10:08
* Email: dong.xing@outlook.com
*/
<template>
  <div class="image-config">
    <a-tabs defaultActiveKey="1" tabPosition="top" :style="{ height: '100%' }">
      <a-tab-pane tab="样式" key="1">
        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->
      </a-tab-pane>

      <a-tab-pane tab="属性" key="2">
        <div class="image-config__template">
          <a-collapse :defaultActiveKey="[1, 2, 3]" :bordered="false">
            <!-- 超链接 -->
            <a-collapse-panel header="超链接" key="4">
              <div class="comment-template__item">
                <p class="comment-template__leading">链接:</p>
                <div class="comment-template__inner">
                  <a-input type="text" v-model.trim="config.proprietaryConfig.graphic.link" @change="change" />
                </div>
              </div>

              <div class="comment-template__item">
                <p class="comment-template__leading">打开方式:</p>
                <div class="comment-template__inner">
                  <a-select v-model="config.proprietaryConfig.graphic.target" @change="change">
                    <a-select-option value="blank">新窗口打开</a-select-option>
                    <a-select-option value="self">当前窗口打开</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 打开方式 -->
            </a-collapse-panel>

            <!-- S 图片 -->
            <a-collapse-panel header="图片" key="1">
              <div class="comment-template__item">
                <p class="comment-template__leading">地址:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.graphic.style.image"
                    @change="imageChange"
                  />
                </div>
              </div>
            </a-collapse-panel>
            <!-- E 图片 -->

            <!-- S 图标 -->
            <a-collapse-panel header="图标" key="2">
              <div class="comment-template__item">
                <div class="comment-template__inner icon-picker__list">
                  <div class="icon-picker__icon" v-for="(item, index) of icons" :key="index" @click="iconChoose(index)">
                    <img :src="item.img" alt="" />
                  </div>
                </div>
              </div>
            </a-collapse-panel>
            <!-- E 图标 -->

            <!-- S 预览 -->
            <a-collapse-panel header="预览" key="3">
              <div class="image-config__screen">
                <div class="image-config__screenshot">
                  <img
                    ref="img"
                    :src="config.proprietaryConfig.graphic.style.image"
                    alt=""
                    v-if="config.proprietaryConfig.graphic.style.image"
                  />
                  <p v-else>图片预览</p>
                </div>
              </div>
            </a-collapse-panel>
            <!-- E 预览 -->
          </a-collapse>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import '@/assets/less/template.less'
import CommonTemplate from '../common'
import ProprietaryMixins from '../proprietaryMixins'
import IconPicker from '@/components/IconPicker'

export default {
  name: 'ImageConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate
  },
  data: () => ({
    icons: IconPicker.data()['icons']
  }),
  methods: {
    iconChoose (index) {
      const { img } = this.icons[index]
      console.log('img', img)
      this.config.proprietaryConfig.graphic.style.image = img
      this.imageChange()
    },
    async imageChange () {
      try {
        const { width, height } = await this.imageUrlLoader(this.config.proprietaryConfig.graphic.style.image)
        Object.assign(this.config.proprietaryConfig.graphic.style, {
          width,
          height
        })
        this.change()
      } catch (e) {
        this.$message.error('图片载入失败，请确认图片地址正确！')
        this.change()
        throw e
      }
    },
    /**
     * url 图片地址载入
     * @param url 图片地址
     * @returns {Promise<unknown>}
     */
    imageUrlLoader (url) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = url
      })
    }
  },
  mounted () {
    // FIXME: 当图片类型为图标时，需要先触发 imageChange 才能渲染
    setTimeout(() => {
      this.imageChange()
    })
  }
}
</script>

<style scoped lang="less">
.image-config {
  &__screen {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;

    & button {
      width: 100%;
    }
  }

  &__screenshot {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 140px;
    margin: 0 12px 12px;
    background: #e4e4e4;
    padding: 6px;
    border-radius: 4px;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    p {
      color: #1890ff;
      margin: 0;
    }
  }

  .icon-picker__icon {
    display: inline-block;

    img {
      flex: none;
      width: 24px;
      height: 24px;
      margin: 0 6px 6px 0;
      border-radius: 4px;
      border: 1px solid transparent;
      cursor: pointer;

      &.active {
        border-color: #1890ff;
      }
    }
  }
}
</style>
