import axios from 'axios'

const {
  VUE_APP_HASURA_IMP_URI,
  VUE_APP_HASURA_IMP_KEY
} = process.env

const MAIN = axios.create({
  baseURL: `${VUE_APP_HASURA_IMP_URI}/v1`,
  headers: { 'x-hasura-admin-secret': VUE_APP_HASURA_IMP_KEY }
})

const HASURA_IMP_AXIOS = {
  sql (sql, config = {}) {
    return MAIN.post('/query', {
      'type': 'run_sql',
      'args': {
        'sql': sql
      }
    }, config)
  }
}

export {
  HASURA_IMP_AXIOS
}
