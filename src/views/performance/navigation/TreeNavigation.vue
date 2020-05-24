/*
 * 树形导航图
 * Author: yizhu liu
 * Date: 2019-12-27 09:21:14
 * Email: lyz02413@163.com
 */
<template>
  <div class="TreeNavigation">
    <a-spin :spinning="spinning">
      <a-row>

        <a-col :span="6">
          <ResourceTree
            v-if="treeConfig"
            readOnly
            instanceList
            :rootKeys="treeConfig.nodes.split(',')"
            @selectNode="selectNode"
          />
        </a-col>

        <a-col :span="18">
          <Preview
            v-if="viewId"
            :viewTitle="viewTitle"
            :viewId="viewId"
            :ciId="selectedCi._id"
          />
        </a-col>

      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { ResourceTree } from '@/components/Resource'
import { getViewList } from '@/api/controller/View'
import Preview from '@/components/View/Preview'
import _ from 'lodash'

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
      // 左侧树形结构选中的 Ci
      selectedCi: null,
      spinning: false,
      treeConfig: null
    }
  },
  computed: {
    // 选中 Ci 对应的视图的标题
    viewTitle: {
      get () {
        if (!this.selectedCi) {
          return null
        }
        const { name, parentName } = this.selectedCi
        // 如果自身配置了视图则直接加载，反之继承父元素的配置
        const self = this.treeViewMapping.find(el => el.name === name)
        if (self) {
          return self.view || self.childrenview
        } else {
          const parent = this.treeViewMapping.find(el => el.name === parentName)
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
        const view = this.allViewList.find(el => el.view_title === this.viewTitle)
        return view ? view.view_id : null
      }
    },
    treeViewMapping: {
      get () {
        return _.get(this.treeConfig, 'views', null)
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
        const { data: { data } } = await getViewList({
          limit: 9999
        })
        this.allViewList = data
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
        this.treeConfig = config
      } catch (e) {
        this.treeConfig = null
        throw e
      }
    },
    async selectNode (ci) {
      // 触发 v-if 刷新
      // this.selectedCi = null
      // await Timeout.set(10)
      this.selectedCi = ci
    }
  },
  async created () {
    try {
      this.spinning = true
      await Promise.all([
        this.fetchMappingConfig(),
        this.fetchAllViewList()
      ])
    } catch (e) {
      throw e
    } finally {
      this.spinning = false
    }
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
