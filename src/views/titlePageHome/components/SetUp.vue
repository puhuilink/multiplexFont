<template>
  <div>
    <a-modal
      :dialog-style="{ top: '20px' }"
      v-model="visible"
      title="快捷功能设置"
      @ok="handleOk"
      :width="966"
      on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          提交
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-row class="row_1">
        <a-col :span="24" class="row_1_col_1">

          <a-tabs v-model="selectedKey" tabPosition="left" :tabBarStyle="{ width: '150px' }" :animated="false">
            <a-tab-pane v-for="(node, index) in treeData" :key="node.key" :disabled="index === 0">
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
                      <a-tooltip slot="suffix" >
                        <img src="../assets/sous.png" alt="" style="width: 1.1rem;height: auto" @click="onSearch">
                      </a-tooltip>
                    </a-input>
                  </template>
                  <!-- 如果不是第一个标签页，则显示原有的自定义标签 -->
                  <template v-else>
                    <div class="custom-tab">
                      <span class="left-align">{{ node.title }}</span>
                      <span class="right-align">{{ node.value }}</span>
                    </div>
                  </template>
                </div>
              </template>
              <!-- 内容放在这里 -->
              <div style="height: 550px;">
                <div class="Preview">预览<div>拖动鼠标调整顺序</div></div>
                <div class="Preview_1">
                  <draggable v-model="checkedOptions" class="grid-container">

                    <div v-for="(item, index) in checkedOptions" :key="index" class="grid-item closeBoxF">
                      <img :src="item.image" alt="item.name" class="item-image" />
                      <div class="item-name">{{ item.name }}</div>
                      <a-icon type="close" @click="closePreview(item, index)" class="closeBox"/>
                    </div>

                  </draggable>
                </div>
                <div class="Preview Preview2">请选择</div>
                <div class="Preview_2">

                  <div class="grid-container">
                    <div v-for="(item, index) in options" :key="index" class="grid-item">
                      <img :src="item.image" alt="item.name" class="item-image" />
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
      <CheckBox style="padding: 24px 38px"></CheckBox>
    </a-modal>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import CheckBox from './CheckBox'
const treeData = [
  {
    title: '',
    key: '0',
    value: null
  },
  {
    title: '全部',
    key: '0-0',
    value: 28
  },
  {
    title: '统一监控',
    key: '0-0-0',
    value: 2
  },
  {
    title: '巡更管理',
    key: '0-0-1',
    value: 3
  },
  {
    title: '告警管理',
    key: '0-0-2',
    value: 3
  },
  {
    title: '资产管理',
    key: '0-0-3',
    value: 3
  },
  {
    title: '知识库',
    key: '0-0-4',
    value: 3
  },
  {
    title: '运维可视化',
    key: '0-0-5',
    value: 3
  },
  {
    title: '系统管理',
    key: '0-0-6',
    value: 3
  }

]
const options2 = [
  { id: 1, label: '监控集成', image: require('../assets/jkjc.png') },
  { id: 2, label: '监控集成', image: require('../assets/jkjc.png') },
  { id: 10, label: 'Option 1', image: require('../assets/jkjc.png') },
  { id: 11, label: 'Option 2', image: require('../assets/jkjc.png') },
  { id: 12, label: 'Option 3', image: require('../assets/jkjc.png') },
  { id: 13, label: 'Option 3', image: require('../assets/jkjc.png') }
]

export default {
  name: 'SetUp',
  components: {
    CheckBox,
    draggable
  },
  data () {
    return {
      list: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      loading: false,
      visible: false,
      // loadingInput: false,
      keyword: '',
      treeData: treeData,
      selectedKey: '0-0', // 设置默认选中的项
      checkedValues: [], // 选中的复选框的值
      options2,
      optionsWithDisabled: [
        { value: 'Apple' },
        { value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
      ],
      options: [
        { id: 1, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 2, name: '告警列表', image: require('../assets/jkjc.png') },
        { id: 3, name: '巡更路径设置', image: require('../assets/jkjc.png') },
        { id: 4, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 5, name: '主机管理', image: require('../assets/jkjc.png') },
        { id: 6, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 7, name: 'Option 1', image: require('../assets/jkjc.png') },
        { id: 8, name: 'Option 2', image: require('../assets/jkjc.png') },
        { id: 9, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 10, name: 'Option 1', image: require('../assets/jkjc.png') },
        { id: 11, name: 'Option 2', image: require('../assets/jkjc.png') },
        { id: 12, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 13, name: 'Option 3', image: require('../assets/jkjc.png') }
      ],
      // 默认选中
      checkedItems: [1, 2],
      checkedOptions: [{ id: 1, name: '监控集成', image: require('../assets/jkjc.png') }]
    }
  },
  watch: {
    checkedItems: function (newCheckedItems) {
      this.checkedOptions = this.options.filter(option => newCheckedItems.includes(option.id))
    }
  },

  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 3000)
    },
    handleCancel (e) {
      this.visible = false
    },
    onSearch (e) {
      console.log(e)
      // this.loadingInput = true
      // setTimeout(() => {
      //   this.loadingInput = false
      // }, 3000)
    },
    // callback (val) {
    //   console.log(val)
    // }
    closePreview (item, index) {
      console.log(item, index)
      this.checkedOptions.splice(index, 1)
      this.checkedItems.splice(index - 1, 1)
    }

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
      //font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
    /deep/ .ant-tabs-nav-wrap{
      margin-right: 0.7rem;
    }

    .Preview{
      display: flex;
      height: 34px;
      border-bottom: 1px solid #E3E3E3;
      font-size: 14px;
      padding: 0 10px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 34px;
      :first-child{
        padding: 0 10px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
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
  //font-family: PingFangSC, PingFang SC;
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
  margin-top: 26px;
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
  top: 0px;
  left: 0px;
  padding-left: 3px;
  color: #fff; /* 勾勾的颜色 */
  background: #3F78F0;
}
.Preview_1 {
  height: 170px;
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
  height: 312px;
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
    top: -10%;
  }
}
</style>
