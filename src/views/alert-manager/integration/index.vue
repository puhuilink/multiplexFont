<template>
  <div style="margin-left: 20px; margin-right: 20px;background: #f7f8f8;height: 100%;width: 100%" >
    <div style="background: #ffffff; margin-bottom: 10px">
      <TopGuide />
    </div>
    <div style="display: flex;margin-left: 20px; margin-right: 20px;">
      <div style="height: 100%;width: 700px; background: #ffffff"><LeftList /></div>
      <div style="width: 20px"></div>
      <div style="height: 100%;width: 1455px; background: #ffffff"><RightTable /></div>
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
