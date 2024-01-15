<template>
  <div class="grid-container-card">
    <div v-for="(item, index) in options2" :key="index" class="grid-item-card">
      <img :src="item.image" alt="item.name" class="item-image-card" />
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
</template>

<script>
export default {
  name: 'CheckBox',
  data () {
    return {
      options2: [
        { id: 1, name: '知识库', image: require('../assets/zhishiku.png') },
        { id: 2, name: '平台简介', image: require('../assets/jianjie.png') },
        { id: 3, name: '我的待办', image: require('../assets/daiban.png') },
        { id: 4, name: '我的申请', image: require('../assets/shenqing.png') },
        { id: 5, name: '资产类型分布', image: require('../assets/zclx.png') },
        { id: 6, name: '资产状态分布', image: require('../assets/zczt.png') }
      ],
      // 默认选中
      checkedItems2: [1, 2]

    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style scoped lang="less">
//第二个
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
    font-family: PingFangSC, PingFang SC;
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
</style>
