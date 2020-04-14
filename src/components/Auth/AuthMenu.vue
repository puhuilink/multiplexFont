<template>
  <div class="auth-menu">
    <a-tree
      checkable
      checkStrictly
      defaultExpandAll
      :autoExpandParent="true"
      v-model="checkedKeys"
      :treeData="menu">
    </a-tree>

  </div>
</template>

<script>
import { MENU, MODULE, ALLPERMISSION } from '@/utils/menu'
import { getUserPermission, getGroupPermission } from '@/api/system'
import { getMenuTree, getButtonTree } from '@/utils/util'

export default {
  name: 'AuthMenu',
  components: {},
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    menu: [...MENU, ...MODULE],
    checkedKeys: [],
    expandedKeys: [],
    loading: false,
    allPermission: ALLPERMISSION
  }),
  created () {
    this.getInitMenu()
  },
  methods: {
    // 获取已选择的菜单
    async getInitMenu () {
      try {
        this.loading = true
        const { user_id: userId, group_id: groupId } = this.record
        if (userId) {
          this.menuPermission = await getUserPermission(userId)
        }
        if (groupId) {
          this.menuPermission = await getGroupPermission(groupId)
        }
        const menuOriginalPermission = this.menuPermission.data.filter(item => /^F/.test(item.code))
        const buttonOriginalPermission = this.menuPermission.data.filter(item => !/^F/.test(item.code))
        if (menuOriginalPermission.length > 0) {
          const menuTree = getMenuTree(null, menuOriginalPermission)
          this.setCheckedKeys(menuTree)
        }
        if (buttonOriginalPermission.length > 0) {
          const buttonTree = getButtonTree(null, buttonOriginalPermission)
          this.setCheckedKeys(buttonTree)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取当前用户权限节点
     */
    setCheckedKeys (menuTree) {
      // 由于属性图特性，清除拥有children节点的key，
      if (menuTree.children && menuTree.children.length > 0) {
        menuTree.children.forEach(menu => {
          this.setCheckedKeys(menu)
        })
      }
      this.checkedKeys.push(menuTree.code)
    },
    /**
     * 获取当前已选菜单
     */
    getCheckedMenu () {
      const checked = this.checkedKeys.checked || this.checkedKeys
      return checked.map(key => {
        const menu = this.allPermission.find(item => item.code === key)
        return {
          objectId: menu.key,
          objectType: menu.functionType,
          domainName: menu.domainName
        }
      })
    }
  }
}
</script>

<style lang="less">
.auth-menu {
  height: 430px;
  overflow: auto;
}
</style>
