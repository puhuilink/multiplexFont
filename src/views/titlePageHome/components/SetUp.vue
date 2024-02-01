<template>
  <div>
    <a-modal
      :dialog-style="{ top: '20px' }"
      v-model="visible"
      title="快捷功能设置"
      @ok="handleOk"
      :width="928"
      on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          提交
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-spin :spinning="!treeData">
        <a-row class="row_1">
          <a-col :span="24" class="row_1_col_1">

            <a-tabs v-model="selectedKey" tabPosition="left" :tabBarStyle="{ width: '150px' }" :animated="false" @change="callback">
              <a-tab-pane v-for="(node, index) in treeData" :key="node.key">
                <template v-slot:tab>
                  <div>
                    <!-- 判断是否为第一个标签页 -->
                    <template v-if="index === 0">
                      <a-input
                        v-model="keyword"
                        placeholder="请输入关键词"
                        class="row_1_col_1_input"
                        size="default"
                      >
                        <a-tooltip slot="suffix">
                          <img src="../assets/sous.png" alt="" style="width: 1.1rem;height: auto" @click="onSearch">
                        </a-tooltip>
                      </a-input>
                    </template>
                    <!-- 如果不是第一个标签页，则显示原有的自定义标签 -->
                    <template v-else>
                      <div class="custom-tab">
                        <span class="left-align">{{ node.parentName }}</span>
                        <span class="right-align">{{ node.value }}</span>
                      </div>
                    </template>
                  </div>
                </template>
                <!-- 内容放在这里 -->
                <div style="height: 420px;">
                  <div class="PreviewBox">预览<div>拖动鼠标调整顺序</div></div>
                  <div class="Preview_1">
                    <draggable
                      v-model="checkedOptions"
                      class="grid-container"
                      @sort="sortFuntion"
                    >

                      <div v-for="(item, index) in checkedOptions" :key="index" class="grid-item closeBoxF">
                        <img v-lazy="thumbnail(item.imgUrl)" alt="item.name" class="item-image" src=""/>
                        <div class="item-name">{{ item.name }}</div>
                        <a-icon type="close" @click="closePreview(item, index)" class="closeBox"/>
                      </div>

                    </draggable>
                  </div>
                  <div class="PreviewBox Preview2">请选择</div>
                  <div class="Preview_2">

                    <div class="grid-container grid-container2">
                      <div v-for="(item, index) in options" :key="index" class="grid-item">
                        <!--  <img :src=" require('../assets/' + item.imgUrl)" :alt="item.name" class="item-image" />-->
                        <img v-lazy="thumbnail(item.imgUrl)" :alt="item.name" class="item-image" src=""/>
                        <div class="item-name">{{ item.name }}</div>
                        <input
                          type="checkbox"
                          :key="item.id"
                          :value="item.id"
                          v-model="checkedItems"
                          class="item-checkbox"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
        <div class="cardBox">卡片设置</div>
        <div style="padding: 24px 38px">
          <div class="grid-container-card">
            <div v-for="(item, index) in options2" :key="index" class="grid-item-card">
              <img v-lazy="thumbnail(item.imgUrl)" alt="item.name" class="item-image-card" />
              <div class="item-name-card">{{ item.name }}</div>
              <input
                type="checkbox"
                :key="item.id"
                :value="item.id"
                v-model="checkedItems2"
                class="item-checkbox"
              />
            </div>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import PreviewMixin from '@/views/view/display/PreviewMixin.vue'
import draggable from 'vuedraggable'
import _ from 'lodash'
import defaultPreviewImg from '@/views/titlePageHome/assets/baobiao.png'
import DesktopMixin from '@/views/view/display/DesktopMixin'
import { axios } from '@/utils/request'
const treeData = [
  {
    parentName: '',
    key: '0',
    value: null
  },
  {
    parentName: '全部',
    key: '00',
    value: 28
  },
  {
    parentName: '统一监控',
    key: '2',
    value: 2
  },
  {
    parentName: '巡更管理',
    key: '3',
    value: 3
  },
  {
    parentName: '告警管理',
    key: '4',
    value: 3
  }

]
const options2 = [
  { id: 1, name: '知识库', imgUrl: 'zhishiku.png' },
  { id: 2, name: '平台简介', imgUrl: 'jianjie.png' },
  { id: 3, name: '我的待办', imgUrl: 'daiban.png' },
  { id: 4, name: '我的申请', imgUrl: 'shenqing.png' },
  { id: 5, name: '资产类型分布', imgUrl: 'zclx.png' },
  { id: 6, name: '资产状态分布', imgUrl: 'zczt.png' }
]

export default {
  name: 'SetUp',
  components: {
    draggable
  },
  mixins: [PreviewMixin],
  // inject: ['allLinkList_menu'],
  data () {
    return {
      loading: false,
      visible: false,
      // loadingInput: false,
      keyword: '',
      selectedKey: '00', // 设置默认选中的项
      checkedValues: [], // 选中的复选框的值
      options2,
      treeData: this.allLinkListMenuCard.memu,
      optionsWithDisabled: [
        { value: 'Apple' },
        { value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
      ],
      options: [],
      list: {},
      // 已选快捷功能
      checkedItems: this.menuItems || [],
      // 选中排序的
      checkedOptions: [],
      // 已选卡片
      checkedItems2: []
    }
  },
  props: {
    allLinkListMenuCard: {
      type: Object,
      default: () => ({})
    },
    menuItemsCard: {
      type: Array,
      default: () => []
    },
    menuItems: {
      type: Array,
      default: null
    }
  },
  computed: {
    // demo: {
    //   get () {
    //     const temp = []
    //     const { card } = this.allLinkListMenuCard
    //     for (const el of card) {
    //       for (const item of this.menuItemsCard) {
    //         console.log('loop', el, item)
    //         if (el.code === item.code) {
    //           temp.push(el.id)
    //         }
    //       }
    //     }
    //     console.log('temp', temp)
    //     this.checkedItems2 = temp
    //     return temp
    //   },
    //   set () {
    //     // this.options = this.treeData.childList
    //   }
    // }
  },
  watch: {
    checkedItems: function (newCheckedItems, old) {
      console.log(newCheckedItems, old)
      let set = []
      // 添加
      if (newCheckedItems.length > old.length) {
        set = newCheckedItems.filter(el => !old.includes(el))
        console.log(set)
        for (const x of set) {
          this.checkedOptions.push(...this.options.filter(option => option.id === x))
        }
      } else if (newCheckedItems.length < old.length) {
        // 删除
        set = old.filter(el => !newCheckedItems.includes(el))
        this.checkedOptions.splice(this.checkedOptions.findIndex(el => el.id === set[0]), 1)
      } else {
        return
      }
      this.checkedOptions = _.uniq(this.checkedOptions)
    },
    allLinkListMenuCard: {
      handler (newVal) {
        // 当 allLinkListMenuCard 更新时执行的逻辑
        this.treeData = newVal.menu // 或者进行其他处理
        this.options = this.treeData[1].childList || []
        this.options2 = newVal.card
      }
      // immediate: true // 立即执行一次，以处理异步数据的初始状态
    },
    menuItemsCard: {
      handler (newVal) {
        const temp = []
        const { card } = this.allLinkListMenuCard
        for (const el of card) {
          for (const item of newVal) {
            if (el.code === item.code) {
              temp.push(el.id)
            }
          }
        }
        this.checkedItems2 = temp
      }
    },
    menuItems: {
      handler (newVal) {
        const temp = []
        const { menu } = this.allLinkListMenuCard
        for (const el of menu[1].childList) {
          for (const item of newVal) {
            if (el.code === item.code) {
              temp.push(el.id)
            }
          }
        }
        this.checkedItems = temp
      }
    }
  },
  methods: {
    thumbnail (src) {
      return src ? `${process.env.VUE_APP_QUOTE_URL}/view_thumbnail/${src}` : defaultPreviewImg
    },
    showModal () {
      this.visible = true
    },
    async handleOk () {
      const menuCodesList = []
      const cardCodesList = []
      // console.log(this.checkedOptions, this.checkedItems2)
      for (let i = 0; i < this.checkedItems2.length; i++) {
        for (const eElement of this.options2) {
          if (eElement.id === this.checkedItems2[i]) {
            cardCodesList.push(eElement.code)
          }
        }
      }
      for (let i = 0; i < this.checkedOptions.length; i++) {
        menuCodesList.push(this.checkedOptions[i].code)
      }
      // console.log(menuCodesList, cardCodesList)
      this.loading = true
      // 30.首页—保存我的快捷功能和卡片
      await axios.post('/menu/saveConfig', {
        menuCodes: menuCodesList,
        cardCodes: cardCodesList
      }).then(res => {
        // console.log(data)
        if (res.code === 200) {
          this.visible = false
          this.loading = false
          this.$notification.success({
            message: '系统提示',
            description: '保存成功'
          })
          // 重新获取首页我的设置
          this.$emit('custom-event')
        } else {
          this.$notification.error({
            message: '系统提示',
            // description: data.data.description
            description: '网络错误'
          })
        }
      }).catch((e) => {
        throw e
      }).finally(() => {
        this.visible = false
        this.loading = false
      })
    },
    handleCancel () {
      this.visible = false
    },
    onSearch () {
      const arr = []
      for (const eElement of this.treeData[1].childList) {
        if (eElement.name.includes(this.keyword)) {
          arr.push(eElement)
        }
      }
      this.options = arr || []
      // this.loadingInput = true
      // setTimeout(() => {
      //   this.loadingInput = false
      // }, 3000)
    },
    callback (key) {
      if (key !== 0) {
        for (const item of this.treeData) {
          // 如果找到 key 匹配的对象
          if (item.key === key) {
            this.options = item.childList || []
            break
          }
        }
        this.keyword = ''
      }
    },
    closePreview (item, index) {
      // 获取 要删除数据中的id在this.checkedItems中的下表
      const c = this.checkedItems.findIndex(id => id === item.id)
      this.checkedItems.splice(c, 1)
      this.checkedOptions.splice(index, 1)
    },
    sortFuntion ({ to, from, item, clone, oldlndex, newlndex }) {
      // console.log('sort', to, from, item, clone, oldlndex, newlndex)
    }

  },

  created () {
    this.checkedOptions = this.options.filter(option => this.checkedItems.includes(option.id))
  }
}
</script>
<style scoped lang="less">
/deep/.ant-modal-body{
  padding: 0;
}
/deep/.ant-modal-header{
  height: 50px;
}
.row_1{
  //height: 490px;
  padding-left: 14px;
  .row_1_col_1{
    //height: 100%;
    .row_1_col_1_input{
      width: 100%;
      /deep/.ant-input::placeholder {
        font-size: 12px; /* 设置字体大小为12像素，根据需要调整 */
        color: #999999;
      }
      /deep/.ant-input-suffix{
        right: 0.55rem;
        font-size: 120%;
        color: #0b99ff;
      }

    }
    /deep/.ant-tabs-tab{
      margin: 0;
      padding: 6px 11px;
      transition:none;
    }
    /deep/.ant-tabs-left-content{
      padding: 0;
    }
    .custom-tab {
      display: flex;
      justify-content: space-between;
    }

    .left-align {
      text-align: left;
    }

    .right-align {
      text-align: right;
    }
    /deep/.ant-tabs-nav-wrap .ant-tabs-tab:first-child{
      padding: 0;
      margin:15px 0 2px 0;
    }
    /deep/.ant-tabs-nav-wrap .ant-tabs-tab:nth-child(2){
      margin-top:11px;
    }
    /deep/ .ant-tabs-ink-bar{
      display: none !important;
    }
    /deep/ .ant-tabs-tab-active{
      background: #3F78F0;
      border-radius: 4px;
      //font-size: 0.8rem;
      font-family: 'PingFang SC', sans-serif;
      font-weight: 400;
      color: #FFFFFF;
    }
    /deep/ .ant-tabs-nav-wrap{
      margin-right: 0.7rem;
    }

    .PreviewBox{
      display: flex;
      height: 34px;
      border-bottom: 1px solid #E3E3E3;
      font-size: 14px;
      padding: 0 10px;
      font-family: 'PingFang SC',sans-serif;
      font-weight: 500;
      color: #000000;
      line-height: 34px;
      :first-child{
        padding: 0 10px;
        font-size: 12px;
        font-family: 'PingFang SC',sans-serif;
        font-weight: 400;
        color: #999999;
        line-height: 34px;
      }
    }
    .Preview2{
      border-top: 1px solid #E3E3E3;
    }
  }
  .row_1_col_2{
    height: 100%;
  }
}
.vertical-radio-group a-radio-button {
  display: block;
  margin-bottom: 10px; /* 调整垂直间距 */
}
.cardBox{
  width: 100%;
  height: 49px;
  padding-left: 17px;
  font-size: 16px;
  font-family: 'PingFang SC',sans-serif;
  font-weight: 400;
  color: #000000;
  line-height: 49px;
  border-top: 1px solid #E3E3E3;
  border-bottom: 1px solid #E3E3E3;
}
//卡片设置
.card-grid{

}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-row-gap: 18px; /* 上下间距 */
  grid-column-gap: 32px; /* 左右间距 */
  padding-top: 26px;
  overflow-y: scroll;
  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .item-image {
    width: 58px;
    height: 58px;
  }
  .item-name {
    height: 21px;
    font-size: 16px;
    color: #333333;
    line-height: 21px;
    margin-top: 18px;
    margin-bottom: 13px;
  }

}
.grid-container2{
  padding-top: 10px;
}
.grid-container-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(172px, 1fr));
  grid-gap: 20px;
  overflow: hidden;
  .grid-item-card {
    display: flex;
    //flex-direction: column;
    //align-items: center;
    //justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    width: 172px;
    height: 62px;
    border-radius: 8px;
    border: 1px solid rgba(151,151,151,0.34);
    padding:0 13px;
  }
  .item-image-card {
    width: 25px;
    height: auto;

    margin-right: 12px;
  }
  .item-name-card {
    //height: 100%;
    font-size: 14px;
    color: #000000;
    margin-right: auto;
    font-family: 'PingFang SC',sans-serif;
  }

}
.item-checkbox {
  /* 样式修改：空心圆 */
  appearance: none;
  border: 1px solid #D9D9D9;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  outline: none;
  cursor: pointer;
  position: relative;
}

/* 添加空心圆内的勾勾样式 */
.item-checkbox:checked::after {
  width: 100%;
  height: 100%;
  border-radius: 9px;
  content: '\1F5F8'; /* Unicode 中的勾勾符号 */
  font-size: 14px;
  line-height: 120%;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 3px;
  color: #fff; /* 勾勾的颜色 */
  background: #3F78F0;
}
.Preview_1 {
  height: 140px;
  overflow-y: scroll;
}

.Preview_1::-webkit-scrollbar {
  width: 6px; /* 定义滚动条的宽度 */
}

.Preview_1::-webkit-scrollbar-thumb {
  background-color: #D8D8D8; /* 设置滚动条的背景颜色 */
  border-radius: 4px; /* 设置滚动条的边框半径 */
}

.Preview_2{
  height: 25vh;
  overflow-y: scroll;
}
.Preview_2::-webkit-scrollbar {
  width: 6px; /* 定义滚动条的宽度 */
}

.Preview_2::-webkit-scrollbar-thumb {
  background-color: #D8D8D8; /* 设置滚动条的背景颜色 */
  border-radius: 4px; /* 设置滚动条的边框半径 */
}
.closeBoxF{
  position: relative;
  .closeBox{
    position: absolute;
    right: 10%;
    top: -5%;
  }
}
</style>
