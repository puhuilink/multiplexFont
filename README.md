# Unified_Monitoring_Platform
统一监控平台

## 基础
本项目基于 [ant-design-pro-vue](https://github.com/sendya/ant-design-pro-vue) 改造，如遇问题请查看[文档](https://pro.loacg.com/docs/getting-started)

## 代码规范
* Git: [Git提交规范](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
* Git: [Git emoji 规范](https://gitmoji.carloscuesta.me/)

## 组件选型
* 前端框架： vue - 2.6.x
* 路由库：vue-router - 3.x
* 状态管理库：vuex - 3.x
* http请求库：axios - 0.19.x
* Graphql 中间件：[hasura](https://hasura.io/docs/1.0/graphql/core/schema/basics.html)
* 响应式编程库：rxjs - 6.x
* 层叠样式表：less
* 工具库：lodash、moment、html2canvas
* 富文本编辑器：tiptap、tiptap-extensions
* 图表库：echarts、G6
* UI框架：[vue ant design](https://www.antdv.com/docs/vue/introduce-cn/)

## 注意
* lodash 于 [vue.config.js](./vue.config.js) 中配置了 tree-shaking，若部分函数异常请参阅 [lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin#readme) 做相应调整
## 视图设计器说明

#### 依赖
* vue, vuex, vue-router
* rxjs, vue-rx
* lodash
* echarts
* antv/g6
* ant-design-vue
* ...

#### 实现功能
- [x] 视图设计
- [x] 视图预览
- [x] 折线图
- [x] 柱形图
- [x] 拓扑图
- [x] 文本
- [x] 文本健康度
- [x] 环度
- [x] 时间
- [x] 图片
- [x] 饼图
- [x] 极坐标图
- [ ] 列表
- [ ] 告警列表
- [ ] 视图间跳转
- [ ] 地图

#### 项目结构
```
├─public
└─src
    ├─assets
    │  ├─icons  拓扑默认图标
    │  └─less  公共样式表
    ├─api 接口层
    │  ├─config
    │  ├─dao  hasura的ORM封装，用于动态生成hasura语句
    │  ├─service  接口暴露层，由页面直接调用；本身是dao层的直接调用者
    ├─components  公共组件
    │  ├─colorPicker  颜色选择组件
    │  ├─iconPicker  图标选择组件
    │  ├─linearColorSelector  线性颜色选择组件
    │  ├─renderer  视图渲染组件
    │  ├─singleColorSelector 单一颜色选择组件
    │  ├─widget  部件组件
    │  └─wrapper  部件选择器组件
    ├─model  对象模型
    │  ├─charts  图表对象
    │  ├─common  公共配置
    │  ├─config  配置
    │  │  ├─dataConfig  数据配置
    │  │  │  └─staticData  静态数据
    │  │  │─proprietaryConfigs  专有配置
    │  │  └─commonConfig  通用配置
    │  ├─edges  拓扑边对象
    │  ├─element  元素对象（未启用）
    │  ├─factory  对象工厂
    │  ├─nodes  拓扑节点对象
    │  ├─template  组件库模板对象
    │  ├─view  视图对象
    │  └─widget  部件对象
    ├─plugins  插件
    ├─router  vue-router
    ├─store  vuex
    │  └─modules
    └─views  视图模块
        ├─design  视图设计模块
        │  └─modules  
        │      ├─config  配置区块视图
        │      │  ├─chartProprietary  图表专有配置视图
        │      │  ├─charts  图表配置视图
        │      │  ├─common  公共配置视图
        │      │  ├─dataSource  数据源配置视图
        │      │  ├─edges  拓扑边配置视图
        │      │  ├─nodes  拓扑节点配置视图
        │      │  └─view  视图配置视图
        │      ├─screen  屏幕设计区块视图
        │      └─template  组件库模板区块视图
        ├─exception  异常视图
        └─preview  预览视图
```

### 定义结构
视图设计器分为组件库区域，设计区域，窗口配置区域以及模型

#### 组件库
##### 目录：src/views/design/modules/template

* 内容：
    * 组件库视图
    * 其中包括部件模板和拓扑图节点模板数据

* 行为
    * 将部件模板以及拓扑节点拖拽至视图区域行为

#### 设计区域
##### 目录：src/views/design/modules/screen

* 内容：
    * 设计器画板视图
    * 部件视图，部件选择器视图

* 行为
    * 选择激活部件行为
    * 调整部件基础属性（大小，位置）行为
    
#### 配置区域
##### 目录：src/views/design/modules/config

* 内容：
    * 画板及部件的配置视图
    * 公共属性配置，专有属性配置记忆数据配置

* 行为
    * 根据配置面板数据映射为图表库指定图表的配置，进而更新视图
    
#### 模型
##### 目录：src/model/charts

* 内容：
    * 图表基类Chart
    * 不同类型图表类
    
* 行为：
    * 图表的初始化，映射配置等方法
    
##### 目录：src/model/common  

* 内容：
    * 通用类
    
##### 目录：src/model/config/index

* 内容：
    * 配置类
    * 分为commonConfig，proprietaryConfig及dataConfig
    
* 行为：
    * 定义部件及视图配置
    
##### 目录：src/model/config/commonConfig/index

* 内容：
    * 公共配置类
    * 配置图表基础布局
    
* 行为：
    * 定义配置图表基础布局属性
    
##### 目录：src/model/config/proprietaryConfig

* 内容：
    * 专有配置基类以及图表专有配置类
    
* 行为：
    * 定义配置图表专有属性
    
##### 目录：src/model/config/dataConfig

* 内容：
    * 图表数据配置类以及静态数据
    
* 行为：
    * 定义配置图表数据配置属性以及提供图表静态数据
    
##### 目录：src/model/config/edges

* 内容：
    * 拓扑图边配置
    
* 行为：
    * 定义拓扑图边对象属性
    
##### 目录：src/model/config/elements

* 内容：
    * 元素对象（未使用）
    
* 行为：
    * 定义元素对象属性（未使用）
    
##### 目录：src/model/config/factory

* 内容：
    * 工厂类
    * 图表工厂类
    * 图表专有属性工厂类
    * 元素工厂类 （未使用）
    * 拓扑节点工厂类
    * 静态数据工厂类
    
* 行为：
    * 定义项目所用到的工厂类
    * 创建工厂类
    * 创建图表对象
    * 创建图表专有属性对象
    * 创建拓扑节点对象
    * 映射对象静态数据
    
##### 目录：src/model/config/nodes

* 内容：
    * 拓扑图节点基类
    * 拓扑圆形节点类
    * 拓扑椭圆形节点类
    * 拓扑矩形节点类
    * 拓扑图片节点类
    
* 行为：
    * 定义拓扑元素圆形、椭圆形、矩形及图片节点属性
    
##### 目录：src/model/config/template

* 内容：
    * 组件库模板类
    
* 行为：
    * 定义组件库模板对象属性
    
##### 目录：src/model/config/view

* 内容：
    * 视图类
    
* 行为：
    * 定义视图对象属性
    
##### 目录：src/model/config/widget

* 内容：
    * 部件类
    
* 行为：
    * 定义部件对象属性
    
##### 目录：src/plugins/g6

* 内容：
    * antV/g6 视图缩放鼠标位置计算异常补丁
    * antV/g6 全局注册属性
    
* 行为：
    * 注册节点事件
    * 覆写节点对象，注册新节点对象
    * 覆写边对象，注册新边对象
    
#### 事件流程
1. 拖动目标部件模板至画板
2. 根据模板类型，工厂函数创建该类型实例并挂在配置对象
3. 渲染该对象并渲染至画板
4. 将当前部件对象作为激活部件（activeWidget）（vuex），并将其添加至视图对象widgets中
5. 渲染激活部件配置面板
6. 配置面板属性更新，更新当前部件配置
7. 重新映射部件配置为部件实例对象规则的属性，更新该部件对象
8. 重新渲染该部件视图

#### （动态）数据查询配置

1. @/model/config/dataConfig/dynamicData 下建立数据配置文件
2. @/model/factory/dynamicDataFactory 处注册数据配置文件
3. @/views/design/modules/config/dataSource 下建立数据源组件
4. 将第3步建立的组件注册到@/views/design/modules/config/charts/xxx.vue下

#### （动态）数据流向

1. 实例化 Chart 的同时也实例化其 DataConfig （StaticDataConfig + DynamicDataConig）
2. 数据源组件的表单信息与 DataConfig.dbDataConfig 进行双向绑定
3. 显式调用 widget.render.mergeOption() 会强制刷新组件配置
4. Chart.mappingOption 方法里显式调用 dataConfig.getOption() 加载动态数据，此时需返回 promise
5. dataConfig.getOption 方法负责调取接口与数据处理（调用失败或记录不存在时返回0）
6. 第4步的promise被reslove，合并 option 并刷新 echarts

#### （动态）数据接口

1. 配置监控对象（监控类型 / 品牌类型 / 品牌设备 / 设备名称 / 监控实体 / 检查项）
2. 配置可选内容（查询时间、刷新时间）
3. 调用后端接口
4. 取到数据后根据每个图自身情况实现绘制逻辑
5. 刷新 echart