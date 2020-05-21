/**
* 图片配置模板
* Author: dong xing
* Date: 2020/3/25
* Time: 10:08
* Email: dong.xing@outlook.com
*/
<template>
  <div class="image-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="公共属性" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate />
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="专有属性" key="2">
        <div class="image-config__template">
          <a-collapse :defaultActiveKey="[1,2]" :bordered="false">

            <!-- S 图片 -->
            <a-collapse-panel header="图片" key="1">

              <div class="comment-template__item">
                <p class="comment-template__leading">地址:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.graphic.style.image"
                    @change="imageChange" />
                </div>
              </div>
              <!-- / 地址 -->

            </a-collapse-panel>
            <!-- E 图片 -->

            <!-- S 预览 -->
            <a-collapse-panel header="预览" key="2">
              <div class="image-config__screen">
                <div class="image-config__screenshot">
                  <img ref="img" :src="config.proprietaryConfig.graphic.style.image" alt="" v-if="config.proprietaryConfig.graphic.style.image" />
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

export default {
  name: 'ImageConfig',
  mixins: [ProprietaryMixins],
  components: {
    CommonTemplate
  },
  methods: {
    async imageChange () {
      try {
        const { width, height } = await this.imageUrlLoader(this.config.proprietaryConfig.graphic.style.image)
        Object.assign(this.config.proprietaryConfig.graphic.style, {
          width, height
        })
        this.change()
      } catch (e) {
        this.$message.error('图片载入失败，请确认图片地址正确！')
        this.change()
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
        console.log(this.$refs['img'])
      })
    }
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
}
</style>
