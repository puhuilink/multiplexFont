import {
  mutationInsert,
  mutationUpdate
} from '../graphql/Group'
import apollo from '@/utils/apollo'
import moment from 'moment'

const addGroups = function (groups = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationInsert,
    variables: {
      groups
    }
  })
}

export const addGroup = function (group) {
  return addGroups([{
    ...group,
    createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
  }])
}

export const editGroup = function (variables) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdate,
    variables: {
      ...variables
    }
  })
}
