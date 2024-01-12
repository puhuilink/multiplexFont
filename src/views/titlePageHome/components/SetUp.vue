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
              <div style="height: 490px;overflow: auto; padding-top: 12px">
                <CheckBox :isTrue="true"></CheckBox>
              </div>

            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
      <div class="cardBox">卡片设置</div>
      <CheckBox :isTrue="false" style="padding: 24px 38px"></CheckBox>
      <!--      <div class="card-grid">-->
      <!--        <div class="grid-container">-->
      <!--          <div v-for="(item, index) in options2" :key="index" class="grid-item">-->
      <!--            <img :src="item.image" alt="item.name" class="item-image" />-->
      <!--            <div class="item-name">{{ item.name }}</div>-->
      <!--            <input-->
      <!--              type="checkbox"-->
      <!--              v-model="item.checked"-->
      <!--              class="item-checkbox"-->
      <!--              @change="onChange"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </a-modal>
  </div>
</template>
<script>
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
    value: 58
  },
  {
    title: '视图管理',
    key: '0-0-0',
    value: 2
  },
  {
    title: '告警管理',
    key: '0-0-1',
    value: 3
  },
  {
    title: '性能管理',
    key: '0-0-2',
    value: 3
  },
  {
    title: '运维监控',
    key: '0-0-3',
    value: 3
  },
  {
    title: '安全监控',
    key: '0-0-4',
    value: 3
  },
  {
    title: '巡更管理',
    key: '0-0-5',
    value: 3
  },
  {
    title: '机房监控',
    key: '0-0-6',
    value: 3
  },
  {
    title: '告警管理',
    key: '0-0-7',
    value: 3
  },
  {
    title: '统一告警',
    key: '0-0-8',
    value: 3
  },
  {
    title: '系统设置',
    key: '0-0-9',
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
    CheckBox
  },
  data () {
    return {
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
      ]
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
    }
    // callback (val) {
    //   console.log(val)
    // }

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
  padding: 0 14px;
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
      padding-top: 6px ;
      padding-bottom: 6px;
      transition:none;
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
    /deep/ .ant-tabs-ink-bar{
      display: none !important;
    }
    /deep/ .ant-tabs-tab-active{
      background: #3F78F0;
      border-radius: 4px;
      font-size: 0.8rem;
      //font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
    }
    /deep/ .ant-tabs-nav-wrap{
      margin-right: 0.7rem;
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
</style>
