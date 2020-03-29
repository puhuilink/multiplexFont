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

export const queryModelList = gql`query modelListWithChildren ($withChildren: Boolean! = false) {
  groups: ngecc_model {
    label: label_s
    value: name_s
    children @include(if: $withChildren) {
      label: label_s
      value: name_s
      parentName: parentname_s
    }
  }
}`

export const queryInsanceList = gql`query ($where: ngecc_instance_bool_exp! = {}) {
  data: ngecc_instance (where: $where) {
    label: label_s
    value: _id_s
    parentName: parentname_s
  }
}`

export const queryKpiList = gql`query ($where: ngecc_instance_values_bool_exp! = {}) {
  data: ngecc_instance_values (where: $where) {
    label: label_s
  }
}`

export const queryKpiSelectList = nodeType => {
  if (nodeType === 'CommonCi') {
    return gql`query ($nodeType: String!) {
      data: ngecc_instance_values (where: {
        nodetype_s: {
          _eq: $nodeType
        }
        parentname_s: {
          _eq: "Kpi"
        }
      }) {
        label: label_s
        rid: rid
        value: kpicode_s
      }
    }`
  } else {
    return gql`query ($nodeType: String!) {
      data: ngecc_instance_values (where: {
        nodetype_s: {
          _eq: $nodeType
        }
        parentname_s: {
          _eq: "Kpi"
        }
      }) {
        label: label_s
        rid: rid
        value: kpicode_s
      }
      data2: ngecc_instance_values (where: {
        nodetype_s: {
          _eq: "CommonCi"
        },
        parentname_s: {
          _eq: "Kpi"
        }
      }) {
        label: label_s
        rid: rid
        value: kpicode_s
      }
    }`
  }
}

// export const queryKpiSelectList = gql`query ($where: ngecc_instance_values_bool_exp! = {}) {
//   data: ngecc_instance_values (where: $where) {
//     label: label_s
//   }
//   data2: ngecc_instance_values (where: {
//     nodetype_s: {
//       _eq: "CommonCi"
//     },
//     parentname_s: {
//       _eq: "Kpi"
//     }
//   }) {
//     label: label_s
//   }
// }`

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
