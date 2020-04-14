import gql from 'graphql-tag'

export const queryAllBaselinePolicyList = gql`query {
  data: t_baseline_policy {
    label: title
    value: uuid
  }
}`
