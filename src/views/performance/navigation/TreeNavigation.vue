/*
 * 树形导航图
 * Author: yizhu liu
 * Date: 2019-12-27 09:21:14
 * Email: lyz02413@163.com
 */
<template>
  <div class="TreeNavigation">
    <a-row>
      <a-col :span="6">
        <ResourceTree
          hiddenTab
          :rootKeys="['BJDC', 'XMDC']"
          @select="onSelectCi"
        />
      </a-col>

      <a-col :span="18">
        视图 TODO
        <Preview
          v-if="viewId"
          :title="viewTitle"
          :id="viewId"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  ResourceTree
} from '@/components/Resource'
import { getViewList } from '@/api/controller/View'
import Preview from '@/views/preview'

export default {
  name: 'TreeNavigation',
  components: {
    ResourceTree,
    Preview
  },
  data () {
    return {
      collapsed: false,
      allViewList: [],
      // Ci 与 视图的关联关系
      treeViewMapping: null,
      // 左侧树形结构选中的 Ci
      selectedCi: null
    }
  },
  computed: {
    // 选中 Ci 对应的视图的标题
    viewTitle: {
      get () {
        if (!this.selectedCi) {
          return null
        }
        const { name, parentname } = this.selectedCi
        // 如果自身配置了视图则直接加载，反之继承父元素的配置
        const self = this.treeViewMapping.find(el => el.name === name)
        if (self && self.view) {
          return self.view
        } else {
          const parent = this.treeViewMapping.find(el => el.name === parentname)
          if (parent && parent.childrenview) {
            return parent.childrenview
          }
        }
        return null
      }
    },
    // 选中 Ci 对应的视图的 Id
    viewId: {
      get () {
        if (!this.viewTitle) {
          return null
        }
        const view = this.allViewList.find(el => el.view_title === this.viewTitle)
        return view ? view.view_id : null
      }
    }
  },
  methods: {
    /**
     * 获取所有视图列表
     * @return {Promise<any>}
     */
    async fetchAllViewList () {
      try {
        this.allViewList = await getViewList({
          limit: 9999
        })
      } catch (e) {
        this.allViewList = []
        throw e
      }
    },
    /**
     * 获取 Ci 与视图的关联关系
     * @return {Promise<any>}
     */
    async fetchMappingConfig () {
      try {
        const config = await fetch('/treeView.json').then(r => r.json())
        this.treeViewMapping = config.views
      } catch (e) {
        this.treeViewMapping = null
        throw e
      }
    },
    onSelectCi (ci) {
      this.selectedCi = ci
    }
  },
  created () {
    this.fetchMappingConfig()
    this.fetchAllViewList()
  }
}
</script>

<style scoped lang='less'>
.tree-navigation{
  background: #fff;
  height: 100%;
}
.tn-header {
  background: #fff;
  color: black;
  button {
    margin-right: 7px;
    font-size: 16px;
    height: 32px;
  }
}
.ant-layout-sider-zero-width-trigger{
  background: #eee!important;
}

</style>
