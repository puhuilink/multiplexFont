import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

export class User {
  static getUserList ({
    where = {},
    limit,
    offset = 0,
    orderBy = { 'createdate': 'desc_nulls_last' }
  }, paginationFragment, dataFragment) {

  }
}
