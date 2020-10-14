Table 重封装组件说明
====


封装说明
----

>  基础的使用方式与 API 与 [官方版(Table)](https://vuecomponent.github.io/ant-design-vue/components/table-cn/) 本一致，在其基础上，封装了加载数据的方法。
>
>  你无需在你是用表格的页面进行分页逻辑处理，仅需向 Table 组件传递绑定 `:data="Promise"` 对象即可
>
>  经与 hasura对接，Promise 返回的对象需为以下数据结构
>
>  ```javascript
>  {
>    // data为与columns对应的dataSource
>    data: [
>      { xxx },
>      { xxx }
>    ],
>    // pagination输出总条数
>    pagination: {
>      aggregate: {
>        count: xxx
>      }
>    }
>  }
>  ```
>
>  


例子1
----
（基础使用）

```vue

<template>
  <CTable
    ref="table"
    size="default"
    :rowKey="(record) => record.data.id"
    :columns="columns"
    :data="loadData"
    :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
  >
  </CTable>
</template>

<script>
  import CTable from '@/components/Table/CTable'

  export default {
    components: {
      CTable
    },
    data() {
      return {
        columns: [
          {
            title: '规则编号',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          },
          {
            title: '状态',
            dataIndex: 'status',
            needTotal: true
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true
          }
        ],
        // 查询条件参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
         this.selectedRowKeys = selectedRowKeys
         this.selectedRows = selectedRows
       }
    }
  }
</script>

```



例子2
----

（简单的表格，最后一列是各种操作）

```vue
<template>
  <CTable
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
  >
    <span slot="action" slot-scope="text, record">
      <a>编辑</a>
      <a-divider type="vertical"/>
      <a-dropdown>
        <a class="ant-dropdown-link">
          更多 <a-icon type="down"/>
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;">1st menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">2nd menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">3rd menu item</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
  </CTable>
</template>

<script>
  import CTable from '@/components/table/CTable'

  export default {
    components: {
      STable
    },
    data() {
      return {
        columns: [
          {
            title: '规则编号',
            dataIndex: 'no',
            // 传入tooltip为true时，该列会渲染为ATooltip包裹的内容
            tooltip: true
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服务调用次数',
            dataIndex: 'callNo',
          },
          {
            title: '状态',
            dataIndex: 'status',
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
          },
          {
            table: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
          }
        ],
        // 查询条件参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },
      }
    },
    methods: {
      edit(row) {
        // axios 发送数据到后端 修改数据成功后
        // 调用 refresh() 重新加载列表数据
        // 这里 setTimeout 模拟发起请求的网络延迟..
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1500)

      }
    }
  }
</script>
```



内置方法
----

通过 `this.$refs.table` 调用

`this.$refs.table.refresh(true)` 刷新列表 (用户新增/修改数据后，重载列表数据)

> 注意：要调用 `refresh(bool)` 需要给表格组件设定 `ref` 值
>
> `refresh()` 方法可以传一个 `bool` 值，当有传值 或值为 `true` 时，则刷新时会强制刷新到第一页（常用户页面 搜索 按钮进行搜索时，结果从第一页开始分页）


内置属性
----
> 除去 `a-table` 自带属性外，还而外提供了一些额外属性属性  


| 属性           | 说明                                            | 类型              | 默认值 |
| -------------- | ----------------------------------------------- | ----------------- | ------ |
| alert          | 设置是否显示表格信息栏                          | [object, boolean] | null   |
| showPagination | 显示分页选择器，可传 'auto' \| boolean          | [string, boolean] | 'auto' |
| data           | 加载数据方法 必须为 `Promise` 对象 **必须绑定** | Promise           | -      |


`alert` 属性对象：

```javascript
alert: {
  show: Boolean, 
  clear: [Function, Boolean]
}
```



返回 JSON 例子：
```json
{
    "data":{
        "pagination":{
            "aggregate":{
                "count":28
            }
        },
        "data":[
            {
                "view_id":9778,
                "view_title":"litest",
                "creator":"LiTest",
                "view_img":null
            },
            {
                "view_id":9743,
                "view_title":"ln-view_test",
                "creator":"administrator",
                "view_img":"/view/20200825/136eca52c7f842999fca3845fcb963f3.png"
            }
        ]
    }
}
```



更新时间
----

该文档最后更新于： 2020-09-21 PM 17:46