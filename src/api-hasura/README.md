## 目录说明

该目录下内容，为 hasura 接口封装与改进内容，从传统手写 graphql 语句转换到编程式语句，在引入灵活性的同时也摒弃了一些特性

### 优点

- 省去拼写 graphql 语句与字符串拼接
- 提供更人性化的语法糖，如 { id: 123 } 等价于 { id: { _eq: 123 } }
- 采用灵活的链式调用方式，如 hasuraORM.where({ id: 123 }).paginate(1, 10).alias(['id', 'name'])

### 缺点

- graphql 语句与 UI 层完全解耦，不应当再在 UI 层采用 vue-apollo 语句组件
- apollo-client 缓存被弃用（当前未使用，不排除日后用使用场景）
- 虽然将接口层与 UI 层隔离符合传统开发思路，但这或许不是 graphql 的正确应用方式，此举的可行性与可维护性扔有待观察

### 文件结构

```
├─dao 与数据库（hasura）进行联系
├─service 接口与可彼此复用的业务逻辑
├─utils
  ├─hasura-orm 编程式实现 graphql 语句的生成
  ├─mixin 常用但不属于 class 内部的方法
  ├─decorator 装饰器支持，用于提供日志拦截与写入（后期需求）等
```

### 分层细节

#### Dao

- 生成 graphql 语句
- 为数据实体提供默认值处理（自增id、时间戳...）

#### Service

- 为 UI 层提供接口
- 转发 Dao 层进行 query 和 mutate
- 组合 Dao 层进行批量 query 和 mutate

### 编码细节

#### Dao

- 每个 Class 需继承 BaseDao，并定义自身的静态属性：SCHEMA、UNIQUE_FIELDS等
- 每个 Class 方法以静态方法暴露，使用时不需要对 Class 进行实例化（事实上其并没有自身状态需要维护，所有的上下文在函数体内即可实现）
- Class 虽然没有内部状态进行维护，但 hasuraORM 需要维护自身状态（这也是为什么它可以采用链式调用的原因），因此当需要多个不相关的操作时，需要生成独立的 hasuraORM

### 命名规范

- 私有方法以 _ 开头命名
- 继承方法重写需保持一致的入参出参
- 静态变量以大写加下划线命名