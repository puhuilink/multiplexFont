<template>
  <div class="grid-container" v-if="isTrue">
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
  <div class="grid-container-card" v-else>
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
  props: {
    isTrue: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      options: [
        { id: 1, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 2, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 3, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 4, name: '监控集成', image: require('../assets/jkjc.png') },
        { id: 5, name: 'Option 2', image: require('../assets/jkjc.png') },
        { id: 6, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 7, name: 'Option 1', image: require('../assets/jkjc.png') },
        { id: 8, name: 'Option 2', image: require('../assets/jkjc.png') },
        { id: 9, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 10, name: 'Option 1', image: require('../assets/jkjc.png') },
        { id: 11, name: 'Option 2', image: require('../assets/jkjc.png') },
        { id: 12, name: 'Option 3', image: require('../assets/jkjc.png') },
        { id: 13, name: 'Option 3', image: require('../assets/jkjc.png') }
      ],
      options2: [
        { id: 1, name: '知识库', image: require('../assets/jkjc.png') },
        { id: 2, name: '平台简介', image: require('../assets/jkjc.png') },
        { id: 3, name: '平台简介', image: require('../assets/jkjc.png') },
        { id: 4, name: '我的待办', image: require('../assets/jkjc.png') },
        { id: 5, name: '我的待办', image: require('../assets/jkjc.png') },
        { id: 6, name: '我的待办', image: require('../assets/jkjc.png') }
      ],
      // 默认选中
      checkedItems: [1, 2],
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
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-row-gap: 18px; /* 上下间距 */
  grid-column-gap: 32px; /* 左右间距 */
  overflow: hidden;
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
    width: 26px;
    height: 26px;

    margin-right: 12px;
  }
  .item-name-card {
    //height: 100%;
    font-size: 16px;
    color: #000000;
    margin-right: auto;
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
