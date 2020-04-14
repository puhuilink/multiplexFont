import gql from 'graphql-tag'

export const queryModelAttributeList = gql`query ($where:ngecc_model_attributes_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_model_attributes_order_by!]) {
  pagination: ngecc_model_attributes_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_model_attributes (offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    alertmessage_s
    allowinheritance_b
    allownull_b
    assetsattr_b
    datatype_s
    displaytype_s
    did
    defaultvalue_s
    edit_b
    _id_s
    label_s
    matchtype_s
    hidden_b
    name_s
    operationvalue_s
    order_i
    rid
    sourcevalue_s
    sourcetype_s
    searchfield_b
    tabgroup_s
    uniquenessscope_s
    uniqueness_b
    width_i
  }
}`
