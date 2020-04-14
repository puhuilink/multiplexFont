import {
  mutationInsert,
  mutationUpdate
} from '../graphql/Group'
import apollo from '@/utils/apollo'
import moment from 'moment'

const addGroups = function (groups = [], desktops = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationInsert,
    variables: {
      groups,
      views: desktops
    }
  })
}

export const addGroup = function (group) {
  const desktop = {
    view_name: group.group_id,
    view_title: `${group.group_id}桌面`,
    view_type: 'desktop',
    creator: group.group_id,
    content: '',
    protect_level: '1'
  }
  console.log(desktop)
  return addGroups([{
    ...group,
    createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
  }], [desktop])
}

export const editGroup = function (variables) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdate,
    variables: {
      ...variables
    }
  })
}
