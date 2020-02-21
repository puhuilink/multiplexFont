import gql from 'graphql-tag'

export const queryResourceModelList = gql`query ($instanceListCount: Boolean! = false) {
  dataSource: ngecc_model {
    did
    label_s
    name_s
    title: label_s
    key: name_s
    parentKey: parentname_s
    instanceList: instanceList_aggregate @include(if: $instanceListCount) {
      aggregate {
        count
      }
    }
  }
}`

// name_s 属性只读（主键）
export const mutationUpdateModel = gql`mutation ($did: Int, $set: ngecc_model_set_input = {}) {
  update_ngecc_model (where: {
    did: {
      _eq: $did
    }
  }, _set: $set) {
    returning {
      icon_s
    }
  }
}`

export const mutationInsertModels = gql`mutation ($objects: [ngecc_model_insert_input!]! = []) {
  insert_ngecc_model (objects:$objects) {
    affected_rows
  }
}`
