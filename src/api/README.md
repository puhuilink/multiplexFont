# HasuraORM + Service

本模块封装用于降低手写 hasura 语句的复杂度、增强 hasura 语句间的可复用性，并在 hasura 语句之上建立一层用于处理业务逻辑

> 封装基于 [hasura-orm](https://github.com/timeshift92/hasura-orm.git)

## 目录结构

```
├─api
    ├─config
    │  ├─client
    │  └─daoMapping
    ├─dao hasura ORM 映射
    ├─service 接口层
    │  ├─BaseService.js 所有Service需要继承该类，用于后期扩充
    │  ├─UserService.js 用户相关业务接口封装
    │  ├─xxx
```



## （Dao）接口文档

### find ({ where = {}, orderBy = {}, fields = [], limit = 0, offset = 0, alias = '' })

- where 与 [hasura.where](https://hasura.io/docs/1.0/graphql/core/queries/query-filters.html#the-where-argument)  一致，不传时查询所有数据
- orderBy 与 [hasura.order_by](https://hasura.io/docs/1.0/graphql/core/queries/sorting.html#the-order-by-argument) 一致，不传时按数据库默认排序
- limit 与 [hasura.limit](https://hasura.io/docs/1.0/graphql/core/queries/pagination.html#limit-results-from-an-offset) 一致，不传时默认查询所有数据
- offset 与 [hasura.offset](https://hasura.io/docs/1.0/graphql/core/queries/pagination.html#limit-results-from-an-offset) 一致，不传时默认为 0
- alias {String} 指定返回结果的键名（默认返回数据表名），必传
- fields {Array<String>} 要查询的字段

#### add (set)

- set {Object}，要插入的一行数据的对象形式

### update (set, where)

- 同 add 中 set
- where 同 find 中 where

### batchDelete(where)

- where 同 find 中 where

## Utils/hasura-orm 接口文档

### mutate (dao1, dao2, dao3, ...)

（批量）新增 / 删除 / 更新

传入任意个数的 Dao 实例，将组合这些 Dao 实例生成一条完整的 hasura mutation 语句，一条 mutatiion 中的内容属于一个事务

### query (dao1, dao2, dao3, ...)

（批量）查询

传入任意个数的 Dao 实例，将组合这些 Dao 实例生成一条完整的 hasura query 语句

## 数据流向（以删除用户为例）

```javascript
class UserService extends BaseService {
  static async batchDelete (userIdList = []) {
    await mutate(
      // 删除用户
      UserDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户自定义桌面
      ViewDesktopDao.batchDelete({ view_name: { _in: userIdList } }),
      // 删除用户与用户组关联
      UserGroupDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户的权限
      AuthorizeObjectDao.batchDelete({ user_id: { _in: userIdList } })
    )
}
```

1. 页面调用 UserService 层下 batchDelete 接口
2. 相应的 Dao 层进行 CRUD（add / find / update / batchDelete）
3. 使用 await mutate 组合多个 Dao ，生成一条 hasura mutation 语句并进行调用

## 试验功能

### decorator

每个 Service 以类静态方法暴露接口，可以利用装饰器对每次接口调用情况进行简单的日志记录；

目前功能已实现，并未运用到项目中（可以为后期做预留）

## 注意事项

- Dao 层部分 class 通过配置项在运行时动态生成，因此无法在编译器间跳转

