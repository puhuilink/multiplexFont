<template>
  <div style="margin-left: 20px; margin-right: 20px" >
    <div style="background: #ffffff; margin-bottom: 10px">
      <TopGuide />
    </div>
    <div style="display: flex;margin-left: 20px; margin-right: 20px;">
      <div style="height: 870px;width: 800px; background: #ffffff"><LeftList /></div>
      <div style="width: 20px"></div>
      <div style="height: 870px;width: 1355px; background: #ffffff"><RightTable /></div>
    </div>
  </div>
</template>

<script>
import TopGuide from './components/TopGuide.vue'
import LeftList from './components/LeftList.vue'
import RightTable from './components/RightTable.vue'
export default {
  name: 'Integration',
  components: { RightTable, LeftList, TopGuide }
  // TODO 将style样式全写在下边 以class的形式
}
</script>

<style scoped></style>
