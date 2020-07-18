
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
/**
 * 获取domian(ci域)数组
 */
function domainList () {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query instanceList($where: ngecc_instance_values_bool_exp = {}) {
        data: ngecc_instance_values(where: $where) {
          name_s
          label_s
          domain_s
        }
      }`,
      variables: {
        where: {
          'parentname_s': {
            '_eq': 'Domain'
          }
        }
      }
    }).then(r => {
      resolve(r.data.data || [])
    })
  })
}

/**
 * 获取故障类型list
 */
function faultList () {
  return new Promise((resolve, reject) => {
    apollo.clients.alert.query({
      query: gql`query instanceList($where: t_incident_type_bool_exp = {}) {
        data: t_incident_type(where: $where) {
          parent_type_id
          comments
          parent_type_title
          type_id
          type_title
        }
      }`,
      variables: {
        where: {}
      }
    }).then(r => {
      resolve(r.data.data || [])
    })
  })
}

/**
 * 获取前转目标List
 */
function userList () {
  return new Promise((resolve, reject) => {
    apollo.clients.alert.query({
      query: gql`query instanceList($where: t_user_bool_exp = {}) {
        data: t_user(where: $where) {
          auth_method
          createdate
          creator
          email
          user_id
          staff_name
          mobile_phone
        }
      }`,
      variables: {
        where: {}
      }
    }).then(r => {
      resolve(r.data.data || [])
    })
  })
}
/**
 * 获取cI类型list
 */
function typeList () {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query {
        ngecc_model {
          name_s
          label_s
          parentname_s
        }
      }`,
      variables: {}
    }).then(r => {
      // resolve(r.data.ngecc_model || [])
      const a = r.data.ngecc_model
      var arrayTwo = Object.values(a.reduce((res, item) => {
        res[item.parentname_s] ? res[item.parentname_s].push(item) : res[item.parentname_s] = [item]
        return res
      }, {}))
      resolve(arrayTwo || [])
    })
  })
}

/**
 * 获取节点过滤
 */
function nodeList (e) {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query instanceList($where: ngecc_instance_values_bool_exp = {}) {
        data:  ngecc_instance_values(where: $where) {
          rid
          id_s
          icon_s
          ispageadd_s
          description_1_s
          name_s
          domain_s
          enable_b
          label_s
          nodetype_s
          parentname_s
          updatetime_t
        }
      }`,
      variables: {
        where: {
          parentname_s: {
            _eq: e
          }
        }
      }
    }).then(r => {
      // resolve(r.data.ngecc_model || [])
      const a = r.data.data
      var arrayTwo = Object.values(a.reduce((res, item) => {
        res[item.parentname_s] ? res[item.parentname_s].push(item) : res[item.parentname_s] = [item]
        return res
      }, {}))
      resolve(arrayTwo || [])
    })
  })
}

/**
 * 获取告警列表
 */
function alertList () {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query instanceList($where: ngecc_instance_values_bool_exp = {}) {
        data: ngecc_instance_values(where: $where) {
          id_s
          name_s
          label_s
          domain_s
          parentname_s
        }
      }`,
      variables: {
        where: {
          'parentname_s': {
            '_eq': 'Alert'
          }
        }
      }
    }).then(r => {
      // resolve(r.data.data || [])
      const a = r.data.data
      var arrayTwo = Object.values(a.reduce((res, item) => {
        res[item.parentname_s] ? res[item.parentname_s].push(item) : res[item.parentname_s] = [item]
        return res
      }, {}))
      resolve(arrayTwo || [])
    })
  })
}
/**
 * 获取KPI list
 */
function kpiList (e) {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query instanceList($where: ngecc_instance_values_bool_exp = {}) {
        data:  ngecc_instance_values(where: $where) {
          rid
          id_s
          icon_s
          ispageadd_s
          description_1_s
          name_s
          domain_s
          enable_b
          label_s
          nodetype_s
          parentname_s
          kpicode_s
        }
      }`,
      variables: {
        where: {
          nodetype_s: {
            _eq: e
          }
        }
      }
    }).then(r => {
      resolve(r.data.data || [])
      // const a = r.data.data
      // var arrayTwo = Object.values(a.reduce((res, item) => {
      //   res[item.parentname_s] ? res[item.parentname_s].push(item) : res[item.parentname_s] = [item]
      //   return res
      // }, {}))
      // resolve(arrayTwo || [])
    })
  })
}

/**
 * 获取采集系统list
 */
function agentList () {
  return new Promise((resolve, reject) => {
    apollo.clients.resource.query({
      query: gql`query instanceList($where: ngecc_instance_values_bool_exp = {}) {
        data: ngecc_instance_values(where: $where) {
          id_s
          name_s
          label_s
          parentname_s
        }
      }`,
      variables: {
        where: {
          'parentname_s': {
            '_eq': 'Agent'
          }
        }
      }
    }).then(r => {
      // resolve(r.data.data || [])
      const a = r.data.data
      var arrayTwo = Object.values(a.reduce((res, item) => {
        res[item.parentname_s] ? res[item.parentname_s].push(item) : res[item.parentname_s] = [item]
        return res
      }, {}))
      resolve(arrayTwo || [])
    })
  })
}

export default {
  domainList,
  faultList,
  userList,
  typeList,
  nodeList,
  kpiList,
  alertList,
  agentList
}
