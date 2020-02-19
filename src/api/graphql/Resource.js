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
