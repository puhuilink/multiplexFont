## 用途

该文件夹下为 hasura-orm + 业务分层尝试，尚处于内部测试阶段

## 结构

-- controller           暴露api
-- model                持久化数据
-- utis
-------- hasura-orm     基于开源工程封装的针对当前项目的 hasura-orm
-------- hasuraFactory  hasuraOrm工厂函数
-- bootstrap.js         启动文件