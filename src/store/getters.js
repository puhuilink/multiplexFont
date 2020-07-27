import _ from 'lodash'

const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  groupList: state => state.user.info.organizeList.filter(group => !!group.groupId),
  userInfo: state => state.user.info,
  userId: state => _.get(state, 'user.info.userId'),
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang
}

export default getters
