import { label, log } from '../utils/decorator/log'
import { UserDao } from '../dao/UserDao'

class UserService {
  @log
  @label('新增用户')
  static add () {
    // 检测用户名是否可用
    // 新建用户
    // 新建用户自定义桌面
  }

  @log
  @label('删除用户')
  static batchDelete () {
    UserDao.batchDelete()
    // 删除用户
    // 删除用户与用户组关联
    // 删除用户的自定义桌面
    // 删除用户的权限
  }
}

export {
  UserService
}
