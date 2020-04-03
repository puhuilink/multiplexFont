import gql from 'graphql-tag'

export const queryKpiList = gql`query instanceList($where: ngecc_instance_values_bool_exp! = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_instance_values_order_by!]) {
  pagination: ngecc_instance_values_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_instance_values(offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    did
    domain_s
    label_s
    name_s
    parentname_s
    valuecode_s
    valuelabel_s
    nodetype_s
  }
}`
