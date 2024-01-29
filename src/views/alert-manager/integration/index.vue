<template>
  <div style="margin-left: 20px; margin-right: 20px;background: #f7f8f8;height: 100%;width: 100%" >
    <div style="background: #ffffff; margin-bottom: 10px">
      <TopGuide @platformChange="changeSelectedId" />
    </div>
    <div style="display: flex; margin-right: 20px;">
      <div style="height: 100%;width: 300px; background: #ffffff"><LeftList /></div>
      <div style="width: 20px"></div>
      <div style="height: 100%;min-width: 800px;margin-left: 20px; background: #ffffff"><RightTable :platform-id="selectedId" /></div>
    </div>
  </div>
</template>

<script>
import TopGuide from './components/TopGuide.vue'
import LeftList from './components/LeftList.vue'
import RightTable from './components/RightTable.vue'
import { alarm } from '@/utils/request'
import store from '@/store/index'
import { AlertMutationTypes } from '@/store/modules/alert'
import { judgeRoleToAlertView } from '@/utils/util'

export default {
  name: 'Integration',
  components: { RightTable, LeftList, TopGuide },
  data () {
    return {
      selectedId: ''
    }
  },
  methods: {
    async requestPlatformList () {
      let platformList = []
      try {
        const { data } = await alarm.get('/api/integration/platform/list')
        platformList = data
      } catch (e) {
      }
      store.commit(AlertMutationTypes.setPlatformList, { platformList })
    },
    changeSelectedId (e) {
      this.selectedId = e
    }
  // TODO 将style样式全写在下边 以class的形式
  },
  mounted () {
    this.requestPlatformList()
  }
  // beforeCreate () {
  //   judgeRoleToAlertView()
  // }
}
</script>

<style scoped>
.ant-table-wrapper {
    padding:  0 !important;
}
</style>
