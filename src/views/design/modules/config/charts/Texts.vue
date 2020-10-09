/**
* 文本注解配置
* Author: dong xing
* Date: 2020/3/12
* Time: 19:38
* Email: dong.xing@outlook.com
*/

<template>
  <div class="texts-config">
    <a-tabs
      defaultActiveKey="1"
      tabPosition="top"
      :style="{ height: '100%'}"
    >
      <a-tab-pane tab="公共属性" key="1">

        <!-- S 公共配置模板 -->
        <CommonTemplate :usePadding="false"/>
        <!-- E 公共配置模板 -->

      </a-tab-pane>

      <a-tab-pane tab="专有属性" key="2">
        <div class="texts-config__template">
          <a-collapse defaultActiveKey="1" :bordered="false">

            <!-- S 文本样式 -->
            <a-collapse-panel header="文本样式" key="1">

              <div class="comment-template__item">
                <p class="comment-template__leading">文本:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.title.text"
                    @change="change"/>
                </div>
              </div>
              <!-- / 文本 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">链接:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.title.link"
                    @change="change"/>
                </div>
              </div>
              <!-- / 链接 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">打开方式:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.title.target"
                    @change="change">
                    <a-select-option value="blank">新窗口打开</a-select-option>
                    <a-select-option value="self">当前窗口打开</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 打开方式 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">颜色:</p>
                <div class="comment-template__inner">
                  <ColorPicker
                    v-model="config.proprietaryConfig.title.textStyle.color"
                    @change="change()"/>
                </div>
              </div>
              <!-- / 颜色 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">大小:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.textStyle.fontSize"/>
                </div>
              </div>
              <!-- / 大小 -->
              <div class="comment-template__item">
                <p class="comment-template__leading">粗细:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.title.textStyle.fontWeight"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="lighter">细</a-select-option>
                    <a-select-option value="bold">粗</a-select-option>
                    <a-select-option value="bolder">更粗</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 粗细 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">风格:</p>
                <div class="comment-template__inner comment-template__end">
                  <a-select
                    v-model="config.proprietaryConfig.title.textStyle.fontStyle"
                    @change="change">
                    <a-select-option value="normal">正常</a-select-option>
                    <a-select-option value="italic">斜体</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 风格 -->

              <div class="comment-template__item">
                <p class="comment-template__leading">位置:</p>
                <div class="comment-template__inner">
                  <a-select
                    v-model="config.proprietaryConfig.title.position.mode"
                    @change="positionChange">
                    <a-select-option value="center">水平垂直居中</a-select-option>
                    <a-select-option value="center_left">垂直居中-居左</a-select-option>
                    <a-select-option value="center_right">垂直居中-居右</a-select-option>
                    <a-select-option value="top_center">居上-水平居中</a-select-option>
                    <a-select-option value="bottom_center">居下-水平居中</a-select-option>
                    <a-select-option value="custom">自定义</a-select-option>
                  </a-select>
                </div>
              </div>
              <!-- / 位置 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('left')">
                <p class="comment-template__leading">居左:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.left"/>
                </div>
              </div>
              <!-- / 居左 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('right')">
                <p class="comment-template__leading">居右:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.right"/>
                </div>
              </div>
              <!-- / 居右 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('top')">
                <p class="comment-template__leading">居上:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.top"/>
                </div>
              </div>
              <!-- / 居上 -->

              <div
                class="comment-template__item"
                v-if="config.proprietaryConfig.title.position.editablePosition.includes('bottom')">
                <p class="comment-template__leading">居下:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="number"
                    @change="change"
                    v-model.number="config.proprietaryConfig.title.position.bottom"/>
                </div>
              </div>
              <!-- / 居下 -->
            </a-collapse-panel>
            <!-- E 文本样式 -->
            <!-- S 图片 -->
            <a-collapse-panel header="图片" key="2">

              <div class="comment-template__item">
                <p class="comment-template__leading">地址:</p>
                <div class="comment-template__inner">
                  <a-input
                    type="text"
                    v-model.trim="config.proprietaryConfig.graphic.style.image"
                    @change="imageChange" />
                </div>
              </div>

            </a-collapse-panel>
            <!-- E 图片 -->
            <!-- S 图标 -->
            <a-collapse-panel header="图标" key="3">
              <div class="comment-template__item">
                <div class="comment-template__inner icon-picker__list">
                  <div
                    class="icon-picker__icon"
                    v-for="(item, index) of icons"
                    :key="index"
                    @click="iconChoose(index)"
                  >
                    <img :src="item.img" alt="">
                  </div>
                </div>
              </div>
            </a-collapse-panel>
            <!-- E 图标 -->
            <!-- S 预览 -->
            <a-collapse-panel header="预览" key="4">
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
  import ColorPicker from '@/components/ColorPicker'
  import IconPicker from '~~~/IconPicker/index'

  export default {
    name: 'Texts',
    mixins: [ProprietaryMixins],
    components: {
      CommonTemplate,
      ColorPicker,
      IconPicker
    },
    data: () => ({
      icons: IconPicker.data()['icons']
    }),
    methods: {
      positionChange () {
        const { position } = this.config.proprietaryConfig.title
        switch (position.mode) {
          case 'center':
            Object.assign(position, { editablePosition: [] })
            break
          case 'center_left':
            Object.assign(position, { editablePosition: ['left'], left: 0 })
            break
          case 'center_right':
            Object.assign(position, { editablePosition: ['right'], right: 0 })
            break
          case 'top_center':
            Object.assign(position, { editablePosition: ['top'], top: 0 })
            break
          case 'bottom_center':
            Object.assign(position, { editablePosition: ['bottom'], bottom: 0 })
            break
          case 'custom':
            Object.assign(position, {
              editablePosition: ['top', 'bottom', 'left', 'right'],
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            })
            break
          default:
            Object.assign(position, { editablePosition: [] })
            break
        }
        this.change()
      },
      iconChoose (index) {
        const { img } = this.icons[index]
        this.config.proprietaryConfig.graphic.style.image = img
        this.imageChange()
      },
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
      this.imageChange()
    }
  }
</script>

<style scoped lang="less">
  .texts-config {
    &__screen {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;

      & button {
        width: 100%;
      }
    }
    &__template{

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
