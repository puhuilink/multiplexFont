<script>
import { mapGetters } from 'vuex'
import { ViewDesktopService } from '@/api'
import _ from 'lodash'

const ALL_VIEW = '所有视图'

export default {
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    ALL_VIEW,
    // 工作组桌面
    groupDesktopList: [],
    // 用户桌面
    userDesktopList: [],
    // 搜索条件
    queryParams: { view_title: '' },
    // 当前选中桌面名
    selectedDesktopName: ALL_VIEW,
    // 是否正在加载桌面配置
    isLoadingDesktopConfig: false
  }),
  computed: {
    ...mapGetters(['userId']),
    allDesktopList () {
      return [
        ...this.groupDesktopList,
        ...this.userDesktopList
      ]
    },
    // 所有桌面下的视图汇总列表
    allViewList () {
      const viewList = this.allDesktopList
        .map(({ views }) => views)
        .flat()
      // 桌面间可能有重复
      return _.uniqBy(viewList, e => e.view_id)
    },
    // 根据筛选的桌面、关键字得出的视图列表
    filterViewList () {
      const {
        selectedDesktopName, selectedDesktop,
        queryParams, allViewList
      } = this

      // 当前桌面下的视图
      const views = selectedDesktopName === ALL_VIEW ? allViewList.slice() : selectedDesktop.views.slice()

      // 符合搜索条件的视图
      const queryString = (queryParams.view_title || '').toLowerCase()
      const filterViewList = views.filter(({ view_title, view_id }) => `${view_id}${view_title}`.toLowerCase().includes(queryString))
      return _.uniqBy(filterViewList, e => e.view_id)
    },
    filterViewIdList () {
      return this.filterViewList.map(({ view_id }) => view_id)
    },
    // 当前选中的桌面
    selectedDesktop () {
      return this.allDesktopList.find(({ desktopName }) => desktopName === this.selectedDesktopName)
    }
  },
  methods: {
    async fetchDesktopConfig () {
      try {
        this.isLoadingDesktopConfig = true
        const { groupDesktop, userDesktop } = await ViewDesktopService.availableDesktop(this.userId)
        this.groupDesktopList = groupDesktop
        this.userDesktopList = userDesktop
      } catch (e) {
        this.groupDesktopList = []
        this.userDesktopList = []
        throw e
      } finally {
        this.isLoadingDesktopConfig = false
      }
    }
  },
  created () {
    this.fetchDesktopConfig()
  }
}
</script>

<style lang="less">

</style>
