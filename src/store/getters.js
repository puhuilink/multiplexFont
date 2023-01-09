import _ from 'lodash'

const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  roles: state => state.user.roles,
  groupList: state => _.get(state, 'user.info.organizeList', []).filter(group => group && group.groupId),
  groupIdList: state => _.get(state, 'user.info.organizeList', []).filter(group => group && group.groupId).map(({ groupId }) => groupId),
  userInfo: state => state.user.info,
  userId: state => _.get(state, 'user.info.userId'),
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => _.get(state, 'i18n.lang'),
  orm: state => state.cache.orm,
  platformList: state => state.alert.platformList
}

export default getters
