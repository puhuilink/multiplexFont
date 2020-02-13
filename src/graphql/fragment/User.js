import gql from 'graphql-tag'

const defaultUserFragment = gql`fragment user on t_user {
  user_id
  staff_name
  job_title
  phone
  mobile_phone
  email
  flag
  note
}`
