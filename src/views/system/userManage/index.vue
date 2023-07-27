<template>
  <div class="wrapper">
    <!--      操作-->
    <div>
      <a-form>
        <a-row>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 10 }"
              :wrapperCol="{ span: 14, offset: 1 }">
              部门：
              <a-input
                :style="{width:'65%'}"
                v-decorator="[
                  `host_alias` ]"
                placeholder="请输入部门名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 10 }"
              :wrapperCol="{ span: 16, offset: 2 }">
              登录名：
              <a-input
                :style="{width:'65%'}"
                v-decorator="[
                  `endpoint_alias` ]"
                placeholder="请输入登录名"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }">
              用户名称：
              <a-input
                :style="{width:'62%'}"
                v-decorator="[
                  `metric_alias`
                ]"
                placeholder="请输入用户名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }">
              手机号码：
              <a-input
                :style="{width:'62%'}"
                v-decorator="[
                  `metric_alias`
                ]"
                placeholder="手机号码"></a-input>
            </a-form-item>
          </a-col>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 15, offset: 1 }">
              状态：
              <a-select
                :style="{width:'65%'}"
                v-bind="formItemLayout"
                v-decorator="[
                  `level` ]"
                placeholder="用户状态"
              >
                <a-select-option value="1">开启</a-select-option>
                <a-select-option value="2">关闭</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-bind="directiveLayout"
          >
            <a-form-item
              :labelCol="{ span: 5 }"
              :wrapperCol="{ span: 18, offset: 1 }">
              创建时间：
              <a-range-picker
                :style="{width:'61%'}"
                v-bind="formItemLayout"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间', '结束时间']"
                v-decorator="[
                  `level` ]"
              />
            </a-form-item>
          </a-col>
          <a-col :v-bind="directiveLayout" :style="{ textAlign: 'left' }">
            <a-button type="primary" @click="()=>handleSearch()">
              <a-icon type="search" />查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              <a-icon type="sync" />重置
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-button type="primary" style="margin-bottom: 5px">新建</a-button>
    <div class="wrapper_content">
      <div class="wrapper_content_left">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="gData"
          @expand="onExpand"
        >
          <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>

      <div class="wrapper_content_right">
        <a-table :columns="columns" :data-source="data">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template #address="text">
            <a-switch default-checked />
          </template>
          <template #operation="text">
            <a><a-icon type="edit"/>修改</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"><a-icon type="down" />更多</a>
              <a-menu slot="overlay" @click="moreOption">
                <a-menu-item key="1">
                  删除
                </a-menu-item>
                <a-menu-item key="2">
                  修改密码
                </a-menu-item>
                <a-menu-item key="3">
                  分配角色
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-table>
      </div>
      <assignModal ref="assign"></assignModal>
    </div>
  </div>
</template>

<script>
import { Confirm } from '~~~/Mixins'
import { Modal } from 'ant-design-vue'
import assignModal from '@/views/system/userManage/components/assignModal'

const x = 3
const y = 2
const z = 1
const gData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key, scopedSlots: { title: 'title' } })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(gData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
const columns = [
  {
    title: '用户编号',
    dataIndex: 'name',
    defaultFilteredValue: [1],
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '登录名',
    dataIndex: 'age',
    key: 'age',
    defaultFilteredValue: [1],
    width: 65
  },
  {
    title: '用户名称',
    dataIndex: 'address',
    key: 'address 1',
    defaultFilteredValue: [1],
    ellipsis: true
  },
  {
    title: '部门',
    dataIndex: 'abc',
    key: 'abc',
    defaultFilteredValue: [1],
    ellipsis: true
  },
  {
    title: '手机号码',
    dataIndex: 'address',
    key: 'address 2',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'address',
    key: 'address 3',
    ellipsis: true,
    scopedSlots: { customRender: 'address' }
  },
  {
    title: '创建时间',
    dataIndex: 'address',
    key: 'address 4',
    ellipsis: true
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'operation' }
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
export default {
  name: 'Index',
  mixins: [ Confirm ],
  components: {
    assignModal
  },
  data () {
    return {
      data,
      columns,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
      formItemLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 15, offset: 1 }
      },
      directiveLayout: {
        xs: 24,
        md: 8,
        xl: 6,
        xxl: 6
      },
      password: ''
    }
  },
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    change (value) {
      this.password = value.target.value
      console.log('value', value.target.value, this.password)
    },
    renderInput () {
      return (
        <div style={{ textAlign: 'center' }}>
          新密码为：
        <a-input style={{ width: '60%' }} value={this.password} onChange={this.change}></a-input>
        </div>
      )
    },
    renderIcon () {
      return <div></div>
    },
    moreOption ({ key }) {
      console.log(key)
      switch (key) {
        case '1':
          const title = '删除'
          const content = '此操作将永久删除该用户，是否继续？'
          this.$promiseConfirmDelete({
            title,
            content,
            closable: true,
            onOk: async () => {
              // const formData = new FormData()
              // formData.append('corpIds', this.selectedRowKeys.map(el => Number(el)))
              // axios.post('/corp/delete', formData, {
              //   headers: {
              //     'Content-type': 'application/x-www-form-urlencoded'
              //   }
              // })
              //   .then(() => {
              //     this.$notifyDeleteSuccess()
              //     this.query(false)
              //   })
              //   .catch(this.$notifyError)
            }
          })
          break
        case '2':
          Modal.confirm({
            icon: this.renderIcon,
            title: '提示',
            content: this.renderInput,
            centered: true,
            closable: true,
            onOk: async () => {}
          })
          break
        case '3':
          this.$refs.assign.onShow()
          break
        default:
          return null
      }
    }
  }
}
</script>

<style lang='less' scoped>
.wrapper {
  padding: 8px 0;
  &_content {
    margin-top: 3px;
    display: flex;
    justify-content: space-between;

    &_left {
      width: 10vw;
      background-color: rgba(250, 250, 250);
      border: rgb(232, 232, 232) 1px solid;
      border-radius: 5px;
      padding: 5px;
    }

    &_right {
      width: 75vw;
      margin-left: .3vw;
    }
  }
}

.modal_input {
  width: 69%;
}

.modal_input::before {
  content: '新密码：';
  font-size: 15px;
}
</style>
