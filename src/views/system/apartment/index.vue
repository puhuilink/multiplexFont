<template>
  <div class="wrapper">
    <div>
      <a-form-model :form="form">
        <div class="fold">
          <a-row type="flex" :gutter="[8, 8]">
            <a-col :span="8" :style="{ textAlign: 'left' }" class="search_box">
              <label class="search_label">搜索条件</label>
              <a-button type="primary" @click="handleSearch">
                查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
                重置
              </a-button>
            </a-col>
            <a-col
              :span="6"
            >
              <a-form-model-item>
                是否启用：
                <a-select
                  :style="{width:'60%'}"
                  v-model="param.isOpen"
                  placeholder="是否启用"
                >
                  <a-select-option value="true">开启</a-select-option>
                  <a-select-option value="false">关闭</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="6"
            >
              <a-form-model-item>
                部门：
                <a-input
                  placeholder="请输入部门"
                  :style="{width:'60%'}"
                  v-model="param.orgName"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </div>
    <div style="margin-bottom: 1%" class="operation_box">
      <a-button type="primary" @click="onAdd" @operateSuccess="Success" v-action:F001003001>
        <a-icon type="plus-circle"/>
        新建
      </a-button>
      <a-button @click="open" style="margin-left: 10px">
        <a-icon type="column-height" />
        展开
      </a-button>
    </div>
    <div>
      <a-table
        :expandIcon="expandIcon"
        :columns="columns"
        :locale="locale"
        :data-source="treeData"
        :expandedRowKeys="expandedRowKeys"
        rowKey="id"
        :pagination="false"
        @expand="expand"
        :loading="pageLoading"
        :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''"
        class="components-table-demo-nested">
        <template #outSystem="text, record">
          {{ record.ngsoc?'安全态势':'' }}
          <a-divider type="vertical" v-if="!!(record.cloudNet&&record.ngsoc)"/>
          {{ record.cloudNet?'漏洞管理':"" }}
          <!--          {{ record.cloudNet?'SDWAN｜':"" }}-->
          <!--          {{ record.cloudNet?'MV':"" }}-->
        </template>
        <template #operation="text, record">
          <a class="operator" @click="onAdd(record)" :disabled="operationShow(banList, record.id)" v-action:F001003002>
            <a-icon type="plus" />
            新增</a>
          <a class="operator" @click="onEdit(record)" :disabled="operationShow(banList, record.id)" v-action:F001003003>
            <a-icon type="form" />
            编辑</a>
          <a class="operator" @click="onDelete(text, record)" v-if="!!record.parentId" :disabled="operationShow(banList, record.id)" v-action:F001003004>
            <a-icon type="delete" />
            删除</a>

          <a-dropdown v-show="system">
            <a class="ant-dropdown-link">
              <a-icon type="double-right" style="transform: rotate(90deg);"/>
              对接系统</a>
            <a-menu slot="overlay" @click="(key) => moreOption(record, key)">
              <a-menu-item key="1">
                安全态势
              </a-menu-item>
              <a-menu-item key="2">
                漏洞管理
              </a-menu-item>
              <!--              <a-menu-item key="3">
                SDWAN
              </a-menu-item>
              <a-menu-item key="4">
                MV
              </a-menu-item>-->
            </a-menu>
          </a-dropdown>
          <!--          <a class="operator" @click="onDecentralization(text, record)" v-if="!!record.parentId" :disabled="operationShow(banList, record.id)" v-action:F001003004>-->
          <!--            <a-icon type="double-right" style="transform: rotate(90deg);"/>-->
          <!--            对接系统</a>-->

        </template>
      </a-table>
      <schema ref="schema" :treeData="treeData" :userList="userList" @operateSuccess="Success"></schema>
      <decentralization ref="Permissions" :treeData2="treeData2" @operateSuccess="closeDomain"></decentralization>
    </div>
  </div>
</template>

<script>
import { removeArrayValue } from '@/utils/util'
import schema from '@/views/system/apartment/modules/schema'
import decentralization from '@/views/system/apartment/modules/Decentralization'
import { axios } from '@/utils/request'
import { Confirm } from '~~~/Mixins'
import { Form, Modal } from 'ant-design-vue'
import _ from 'lodash'
const treeData = []

export default {
  name: 'ApartmentIndex',
  data () {
    return {
      system: false,
      pageLoading: false,
      treeData,
      locale: {
        emptyText: <a-empty> </a-empty>
      },
      treeData2: [
        {
          value: '1',
          label: '漏洞统计管理',
          parentId: '1'
        }
        // {
        //   value: '2',
        //   label: '安全态势感知',
        //   parentId: '2'
        // }
      ],
      columns: [
        { title: '部门名称', dataIndex: 'name', key: 'name', width: '250px' },
        // { title: '负责人', dataIndex: 'leaderName', key: 'leaderName' },
        // { title: '排序', dataIndex: 'sortIndex', key: 'sortIndex', customRender: (el) => Number(el) },
        {
          title: '是否启用',
          dataIndex: 'isOpen',
          key: 'isOpen',
          align: 'center',
          width: '150px',
          customRender: (el) => {
            return (<a-tag color={el ? 'blue' : 'red'}>{el ? '开启' : '关闭'}</a-tag>)
          }
        },
        {
          title: '对接系统',
          scopedSlots: { customRender: 'outSystem' },
          key: 'outSystem',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center'
        },
        { title: '操作', key: 'operation', align: 'center', scopedSlots: { customRender: 'operation' } }
      ],
      spread: true,
      expandedRowKeys: [],
      param: {
        isOpen: ''
      },
      userList: [],
      banList: [],
      outSystem: []
    }
  },
  mixins: [Confirm, Form],
  components: { schema, decentralization },
  methods: {
    moreOption (record, { key }) {
      switch (Number(key)) {
        case 1:
          this.$refs.Permissions.editPerceive(record)
          break
        case 2:
          this.$refs.Permissions.edit(record)
          break
        case 3:
          console.log(record)
          break
        case 4:
          console.log(record)
          break
      }
    },
    handleSearch () {
      this.getData({
        isOpen: this.param.isOpen,
        orgName: this.param.orgName
      })
    },
    operationShow (List = [], id = '') {
      return List.indexOf(id) === -1
    },
    handleReset () {
      this.param = {
        isOpen: '',
        orgName: ''
      }
    },
    onAdd (text, record) {
      this.$refs.schema.add(text.id)
    },
    onEdit (record) {
      this.$refs.schema.edit(record)
    },
    onDelete (record) {
      const title = '删除'
      const content = '确定要删除当前部门吗？'
      Modal.confirm({
        title: title,
        content: content,
        centered: true,
        closable: true,
        onOk: async () => {
          if (!this.findNodeAndCheckChildren(this.treeData[0], record.id)) {
            try {
              const formData = new FormData()
              formData.append('id', record.id)
              await axios.delete(`/organize/${record.id}`, {
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                }
              })
              await this.getData()
              this.$notification.success({
                message: '系统提示',
                description: '删除成功'
              })
            } catch (e) {
              this.$notification.error({
                message: '系统提示',
                description: e
              })
            }
          } else {
            this.$message.warning('节点不能删除！')
          }
        }
      })
    },
    // onDecentralization (text, record) {
    //   this.$refs.Permissions.edit(text)
    // },
    open () {
      if (this.spread) {
        this.expandedRowKeys = [_.get(this.treeData, '0.id', ''), ...this.findNonEmptyChildrenIdsInTrees(this.treeData)]
      } else {
        this.expandedRowKeys = []
      }
      this.spread = !this.spread
    },
    expandIcon (props) {
      if (props.record.children && props.record.children.length > 0) {
        if (props.expanded) {
          return (
            <span
              style="margin-right: 8px"
              class='table-icon'
              onClick={(e) => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type='down' class='icon' />
            </span>
          )
        } else {
          return (
            <span
              style="margin-right: 8px"
              class='table-icon'
              onClick={(e) => {
                props.onExpand(props.record, e)
              }}
            >
              <a-icon type='right' class='icon' />
            </span>
          )
        }
      } else { // 无数据-图标
        return (
          <span style="margin-right:22px">
          </span>
        )
      }
    },
    expand (expand, record) {
      if (expand) {
        this.expandedRowKeys.push(record.id)
      } else {
        removeArrayValue(this.expandedRowKeys, record.id)
      }
    },
    async getData (params = { isOpen: true, orgName: '' }) {
      try {
        this.pageLoading = true
        const { data } = await axios.get('/organize/table', {
          params: {
            ...this.param.isOpen ? { isOpen: this.param.isOpen } : {},
            ...this.param.orgName ? { name: this.param.orgName } : {}
          }
        })
        const dataIds = _.get(data, 'dataIds', [])
        const list = _.get(data, 'list', [])
        const outSystem = _.get(data, 'outSystem', [])
        console.log(dataIds.length)
        if (!dataIds.length) {
          this.treeData = []
          this.$notification.warning({
            message: '系统提示',
            description: '暂无数据'
          })
          return
        }
        this.banList = dataIds
        this.outSystem = outSystem
        // 遍历this.list
        for (let i = 0; i < list.length; i++) {
          const listOrgId = list[i].id

          // 在this.outSystem中查找匹配的orgId
          const matchingSystem = this.outSystem.find(system => system.orgId === listOrgId)

          // 如果找到匹配的组织
          if (matchingSystem) {
            // 将cloudNet和ngsoc的值添加到this.list中
            list[i].cloudNet = matchingSystem.cloudNet
            list[i].ngsoc = matchingSystem.ngsoc
          }
        }

        this.treeData = this.buildTree(list.sort((a, b) => a.sortIndex - b.sortIndex).map(el => {
          if (el.parentId === undefined) {
            el.parentId = null
          }
          if (this.operationShow(this.banList, el.id)) {
            el.disabled = true
          }
          return el
        }))
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
    },
    buildTree (data, parentId = null) {
      const tree = []
      for (const item of data) {
        if (item.parentId === parentId) {
          const children = this.buildTree(data, item.id)
          if (children.length > 0) {
            item.children = children.map(el => {
              return {
                ...el,
                label: el.name,
                value: el.id
              }
            })
          }
          tree.push({
            ...item,
            label: item.name,
            value: item.id
          })
        }
      }
      return tree
    },
    Success () {
      this.$refs.schema.onCancel()
      setTimeout(() => {
        this.getData()
        this.getUserList()
      }, 500)
    },
    closeDomain () {
      setTimeout(() => {
        this.getData()
        this.getUserList()
      }, 500)
    },
    // 递归查找树节点并判断是否有children
    findNodeAndCheckChildren (node, targetValue) {
      // 递归终止条件：如果当前节点为null或undefined，则返回null
      if (!node) {
        return null
      }

      // 检查当前节点是否是目标节点
      if (node.value === targetValue) {
        // 如果节点不存在children属性或者children为null或空数组，返回false
        return node.children && node.children.length > 0
      }

      // 递归查找子节点
      for (const child of node.children || []) {
        // 递归调用函数，查找子树中是否有目标节点，并检查其children
        const found = this.findNodeAndCheckChildren(child, targetValue)
        if (found !== null) {
          return found
        }
      }

      // 若在当前子树中未找到目标节点，返回null
      return null
    },
    // 递归函数，用于遍历树形结构并收集所有父节点的id
    // TODO:展开所有含有children得节点
    collectParentIds (tree) {
      const parentIds = []
      for (const node of tree) {
        if (node.children) {
          const childrenParentIds = this.collectParentIds(node.children)
          if (childrenParentIds.length > 0) {
            parentIds.push(node.id, ...childrenParentIds)
            return parentIds
          }
        }
      }
      return parentIds
    },
    findNonEmptyChildrenIdsInTrees (trees) {
      const result = []

      function findNonEmptyChildrenIds (node) {
        if (!node.children || node.children.length === 0) {
          return []
        }

        const nonEmptyChildren = node.children.filter(child => child.children && child.children.length > 0)
        const nonEmptyChildrenIds = nonEmptyChildren.map(child => child.id)

        return nonEmptyChildrenIds.concat(
          nonEmptyChildren.flatMap(child => findNonEmptyChildrenIds(child))
        )
      }

      for (const tree of trees) {
        result.push(...findNonEmptyChildrenIds(tree))
      }

      return result
    },
    async getUserList (orgId = '') {
      const { data: { list } } = await axios.get(`/user/list?pageSize=9999&pageNum=1${orgId === '' ? '' : '&orgId=' + orgId}`)
      this.userList = list
    }
  },
  mounted () {
    const proUserString = localStorage.getItem('pro__User')
    if (proUserString) {
      const proUser = JSON.parse(proUserString)
      const userId = proUser.value.userId
      this.system = (userId === '2')
    }

    // 获取当前表格信息
    this.getData()
    this.getUserList()
    this.expandedRowKeys = ['1']
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
  }
}
</script>

<style lang='less' scoped>
.icon:hover {
  transform: scale(1.2);
  transition: transform .3s;
  color: rgba(0, 0, 255, 0.98);
}

.operator {
  padding: 0 5px;
}
</style>
