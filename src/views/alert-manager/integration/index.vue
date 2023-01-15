<template>
  <div style="margin-left: 20px; margin-right: 20px;background: #f7f8f8;height: 100%;width: 100%" >
    <div style="background: #ffffff; margin-bottom: 10px">
      <TopGuide @platformChange="changeSelectedId" />
    </div>
    <div style="display: flex;margin-left: 20px; margin-right: 20px;">
      <div style="height: 100%;width: 400px; background: #ffffff"><LeftList /></div>
      <div style="width: 20px"></div>
      <div style="height: 100%;min-width: 1455px;margin-left: 20px; background: #ffffff"><RightTable :platform-id="selectedId" /></div>
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
      let platformList
      try {
        const { data } = await alarm.get('/api/integration/platform/list')
        platformList = data
      } catch (e) {
        platformList = [
          {
            'platformId': '123',
            'platName': 'test_platform',
            'platUrl': '/systemfile/2022/11/17/123.jpg',
            'platType': '1',
            'total': 1
          },
          {
            'platformId': '124',
            'platName': 'test_platform1',
            'platUrl': '/systemfile/2022/11/17/124.jpg',
            'platType': '2',
            'total': 1
          }
        ]
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
}
</script>

<style scoped></style>
