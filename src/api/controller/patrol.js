import apollo from '@/utils/apollo'
import {
  queryRouteList,
  queryRouteDetail,
  queryRoutePointDetail,
  queryPlanList,
  queryUserGroupList,
  queryTaskInfo,
  queryTaskCiList,
  queryTaskKpi,
  queryTaskPointDetail,
  updatePlan,
  deleteRouteArr,
  deletePlanArr,
  insertPlanObj
} from '../graphql/patrol'
import { wrapperLogFunc } from '@/api-hasura/utils/decorator/log'

const MODULE_NAME = '巡更模块'

// get
export const getRouteList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryRouteList,
    variables: {
      ...variables
    }
  })
}
export const getRouteDetail = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryRouteDetail,
    variables: {
      ...variables
    }
  })
}
export const getRoutePointDetail = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryRoutePointDetail,
    variables: {
      ...variables
    }
  })
}

export const getPlanList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryPlanList,
    variables: {
      ...variables
    }
  })
}

export const getUserGroupList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryUserGroupList,
    variables: {
      ...variables
    }
  })
}

export const getTaskInfoList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryTaskInfo,
    variables: {
      ...variables
    }
  })
}

export const getTaskCiList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryTaskCiList,
    variables: {
      ...variables
    }
  })
}

export const getTaskKpi = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryTaskKpi,
    variables: {
      ...variables
    }
  })
}

export const getTaskPointDetail = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryTaskPointDetail,
    variables: {
      ...variables
    }
  })
}
// mutation
export const mutatePlan = function (variables = {}) {
  return apollo.clients.alert.mutate({
    mutation: updatePlan,
    variables: {
      ...variables
    }
  })
}
// delete
export const deleteRoute = function (variables = {}) {
  return apollo.clients.alert.mutate({
    mutation: deleteRouteArr,
    variables: {
      ...variables
    }
  })
}

export const deletePlan = wrapperLogFunc(function (variables = {}) {
  // return true
  return apollo.clients.alert.mutate({
    mutation: deletePlanArr,
    variables: {
      ...variables
    }
  })
}, MODULE_NAME, '删除计划')

// insert
export const insertPlan = function (variables = {}) {
  return apollo.clients.alert.mutate({
    mutation: insertPlanObj,
    variables: {
      ...variables
    }
  })
}
