<template>
  <div class="wrapper">
    <!--      操作-->
    <div>
      <a-form>
        <a-row :gutter="[3,6]">
          <a-col
            :span="6"
          >
            <a-form-item >
              部门：
              <a-input
                :style="{width:'63%'}"
                v-decorator="[
                  `host_alias` ]"
                placeholder="请输入部门名称"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="6"
          >
            <a-form-item >
              登录名：
              <a-input
                :style="{width:'60%'}"
                v-decorator="[
                  `endpoint_alias` ]"
                placeholder="请输入登录名"
              />
            </a-form-item>
          </a-col><a-col
            :span="6"
          >
            <a-form-item >
              用户名称：
              <a-input
                :style="{width:'60%'}"
                v-decorator="[
                  `metric_alias`
                ]"
                placeholder="请输入用户名称"
              />
            </a-form-item>
          </a-col><a-col
            :span="6"
          >
            <a-form-item >
              手机号码：
              <a-input
                :style="{width:'60%'}"
                v-decorator="[
                  `metric_alias`
                ]"
                placeholder="手机号码"></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :span="6"
          >
            <a-form-item >
              状态：
              <a-select
                :style="{width:'60%'}"
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
            :span="6"
          >
            <a-form-item >
              创建时间：
              <a-range-picker
                :style="{width:'60%'}"
                :show-time="{ format: 'HH:mm' }"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间', '结束时间']"
                v-decorator="[
                  `level` ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" :style="{ textAlign: 'left' }">
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
    <div class="wrapper_content">
      <div class="wrapper_content_left">
        <a-directory-tree multiple default-expand-all @select="onSelect" @expand="onExpand">
          <a-tree-node key="0-0" title="parent 0">
            <a-tree-node key="0-0-0" title="leaf 0-0" is-leaf />
            <a-tree-node key="0-0-1" title="leaf 0-1" is-leaf />
          </a-tree-node>
          <a-tree-node key="0-1" title="parent 1">
            <a-tree-node key="0-1-0" title="leaf 1-0" is-leaf />
            <a-tree-node key="0-1-1" title="leaf 1-1" is-leaf />
          </a-tree-node>
        </a-directory-tree>
      </div>

      <div class="wrapper_content_right">
        <a-table :columns="columns" :data-source="data">
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address 1',
    ellipsis: true
  },
  {
    title: 'Long Column Long Column Long Column',
    dataIndex: 'address',
    key: 'address 2',
    ellipsis: true
  },
  {
    title: 'Long Column Long Column',
    dataIndex: 'address',
    key: 'address 3',
    ellipsis: true
  },
  {
    title: 'Long Column',
    dataIndex: 'address',
    key: 'address 4',
    ellipsis: true
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
  data () {
    return {
      data,
      columns
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
    }

    &_right {
      width: 85vw;
    }
  }
}
</style>
