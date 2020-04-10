import apollo from '@/utils/apollo'
import {
  mutationInsert,
  mutationUpdate
} from '../graphql/BaselinePolicy'
import uuid from 'uuid/v4'

export const addBaselinePolicy = function (value) {
  return apollo.clients.alert.mutate({
    mutation: mutationInsert,
    variables: {
      objects: [{
        // 控制长度在33之内（与数据表保持一致）
        uuid: uuid().replace(/-/g, ''),
        ...value
      }]
    }
  })
}

export const editBaselinePolicy = function ({ uuid, ...value }) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdate,
    variables: {
      uuid,
      object: value
    }
  })
}
