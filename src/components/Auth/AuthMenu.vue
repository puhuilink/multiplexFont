<template>
  <a-spin :spinning="loading">
    <div class="auth-menu">
      <a-tree
        checkable
        defaultExpandAll
        :selectable="false"
        :checkStrictly="true"
        :autoExpandParent="true"
        v-model="checkedKeys"
        @select="onSelect"
        @expand="onExpand"
        @check="onCheck"
        :treeData="menu">
      </a-tree>
    </div>
  </a-spin>
</template>

<script>
import { getMenuTree, getButtonTree } from '@/utils/util'
import { AuthorizeObjectService, FunctionService } from '@/api'
import _ from 'lodash'

export default {
  name: 'AuthMenu',
  components: {},
  props: {
    record: {
      type: Object,
      default: () => ({})
    },
    isRole: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    menu: [],
    checkedKeys: [],
    expandedKeys: [],
    loading: false
  }),
  created () {
    this.getInitMenu()
  },
  methods: {
    // 获取已选择的菜单
    async getInitMenu () {
      if (this.menus.length) {
        this.menu = this.menus
      }
      if (this.isRole) {
        const { data } = this.record
        this.checkedKeys.push(...data)
        return
      }
      try {
        this.loading = true
        const { user_id: userId, group_id: groupId } = this.record
        if (userId) {
          this.menuPermission = await AuthorizeObjectService.getUserPermission(userId)
        }
        if (groupId) {
          this.menuPermission = await AuthorizeObjectService.getGroupPermission(groupId)
        }
        const menuOriginalPermission = this.menuPermission.data.filter(item => /^F/.test(item.code))
        const buttonOriginalPermission = this.menuPermission.data.filter(item => !/^F/.test(item.code))
        if (menuOriginalPermission.length > 0) {
          const menuTree = getMenuTree(null, menuOriginalPermission)
          this.setCheckedKeys(menuTree)
          // this.setCheckedKeys([{code: 'F002003', key: 'F002003'})
        }
        // 根据权限数据构建按钮树结构
        if (buttonOriginalPermission.length > 0) {
          const buttonTree = getButtonTree(null, buttonOriginalPermission)
          this.setCheckedKeys(buttonTree)
        }
      } catch (error) {
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
    async getCheckedMenu () {
      const checked = this.checkedKeys.checked || this.checkedKeys

      if (checked.length === 0) {
        return []
      }

      const { data: { functionList } } = await FunctionService.find({
        where: { code: { _in: checked } },
        fields: [ 'code', 'functionType: function_type' ],
        alias: 'functionList'
      })

      return functionList.map(({ code, functionType }) => ({
        objectId: code,
        objectType: functionType,
        domainName: null
      }))
    },
    onSelect (selectedKeys, info) {

    },
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, { checked: bool, checkedNodes, node, event }) {
      const before = this.record.data

      const after = checkedKeys.checked ? checkedKeys.checked : checkedKeys
      let result
      const element = after.filter(el => !before.includes(el))[0]
      if (before.length > after.length) {
        // 取消勾选了一个选项
        const element = before.filter(el => !after.includes(el))[0]
        const e = this.findChildren(element, this.menu)
        const a = this.unParsePermissions(element, before)
        const b = after.filter(a => !e.includes(a))
        const unionSet = a.filter(function (v) { return b.indexOf(v) > -1 })

        result = unionSet
      } else if (before.length < after.length) {
        // 勾选了一个选项

        const e = this.findChildren(element, this.menu)

        e.push(...this.parsePermissions(e[0]))
        result = Array.from(new Set([...after, ...e]))
      } else {
        result = before
      }
      this.checkedKeys = _.uniq(result)
      this.$emit('menuChange', result)
    },
    findChildren (str, data) {
      const count = (str.length - str.length % 3) / 3 + 1
      const arr = []
      let origin = data.filter(d => d.key === str.substring(0, 1))[0]
      for (let i = 1; i < count; i++) {
        origin = origin.children.filter(o => o.key === str.substring(0, 1 + 3 * i))[0]
      }
      arr.push(...this.findChildrenKeys(origin))
      return arr
    },

    findChildrenKeys (data) {
      const arr = []

      if (data.children) {
        data.children.forEach(child => {
          arr.push(...this.findChildrenKeys(child))
        })
      }
      arr.push(data.key)

      return arr
    },
    parsePermissions (datas) {
      const permissions = []
      for (let i = 0; i < datas.length; i += 3) {
        permissions.push(datas.slice(0, i + 1))
      }
      return permissions
    },
    unParsePermissions (element, before) {
      let permissions = []

      const data = before.filter(el => {
        return el.length === element.length && el.slice(0, el.length - 3) === element.slice(0, element.length - 3)
      })// 判断取消选中的长度和选择前的树首字符和长度是否相同

      let data_son
      // 如果只有一个子元素且这个子元素的长度大于3
      if (data.length === 1 && data[0].length > 3) {
        data_son = data[0].slice(0, data[0].length - 3)
        permissions = before.filter(el => {
          // 排除子节点的父节点和子节点自身
          if (el !== element) {
            return el
          }
        })
        permissions = this.unParsePermissions(data_son, permissions)
      } else {
        permissions = before.filter(el => {
          if (el !== element) {
            return el
          }
        })
      }
      return permissions
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
