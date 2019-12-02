// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/view/display',
    children: [
      // view
      {
        path: '/view',
        name: 'view',
        redirect: '/view/display',
        component: RouteView,
        meta: { title: '视图管理', keepAlive: true, icon: 'home', permission: [ 'view' ] },
        children: [
          {
            path: '/view/display',
            name: 'ViewDisplay',
            component: () => import('@/views/view/display/ViewDisplay'),
            meta: { title: '视图展示', keepAlive: true, permission: [ 'view' ] }
          },
          {
            path: '/view/design',
            name: 'ViewDesign',
            component: () => import('@/views/view/design/ViewDesign'),
            meta: { title: '视图设计', keepAlive: true, permission: [ 'view' ] }
          }
        ]
      },

      // alarm
      {
        path: '/alarm',
        name: 'alarm',
        redirect: '/alarm/monitor',
        component: RouteView,
        meta: { title: '告警管理', keepAlive: true, icon: 'alert', permission: [ 'alarm' ] },
        children: [
          {
            path: '/alarm/monitor',
            name: 'AlarmMonitor',
            component: () => import('@/views/alarm/monitor/AlarmMonitor'),
            meta: { title: '告警监控', keepAlive: true, permission: [ 'alarm' ] }
          },
          {
            path: '/alarm/handle',
            name: 'AlarmHandle',
            component: () => import('@/views/alarm/handle/AlarmHandle'),
            meta: { title: '告警处理', keepAlive: true, permission: [ 'alarm' ] }
          },
          {
            path: '/alarm/config',
            name: 'AlarmConfig',
            component: () => import('@/views/alarm/config/AlarmConfig'),
            meta: { title: '告警监控', keepAlive: true, permission: [ 'alarm' ] }
          }
        ]
      },

      // performance
      {
        path: '/performance',
        name: 'performance',
        redirect: '/performance/navigation',
        component: RouteView,
        meta: { title: '性能管理', keepAlive: true, icon: 'thunderbolt', permission: [ 'performance' ] },
        children: [
          {
            path: '/performance/navigation',
            name: 'TreeNavigation',
            component: () => import('@/views/performance/navigation/TreeNavigation'),
            meta: { title: '树形导航图', keepAlive: true, permission: [ 'performance' ] }
          },
          {
            path: '/performance/quota',
            name: 'QuotaList',
            component: () => import('@/views/performance/quota/QuotaList'),
            meta: { title: '指标列表', keepAlive: true, permission: [ 'performance' ] }
          },
          {
            path: 'https://cn.bing.com/search?q=视频监控',
            name: 'VideoMonitor',
            meta: { title: '视频监控', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=360安全',
            name: '360安全',
            meta: { title: '360安全', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=北京Pigoss',
            name: '北京Pigoss',
            meta: { title: '北京Pigoss', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=厦门Pigoss',
            name: '厦门Pigoss',
            meta: { title: '厦门Pigoss', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=北京动环',
            name: '北京动环',
            meta: { title: '北京动环', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=厦门动环',
            name: '厦门动环',
            meta: { title: '厦门动环', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=APM',
            name: 'APM',
            meta: { title: 'APM', target: '_blank' }
          },
          {
            path: 'https://cn.bing.com/search?q=NPM',
            name: 'NPM',
            meta: { title: 'NPM', target: '_blank' }
          }
        ]
      },

      // config
      {
        path: '/config',
        name: 'config',
        redirect: '/config/model',
        component: RouteView,
        meta: { title: '配置管理', keepAlive: true, icon: 'idcard', permission: [ 'config' ] },
        children: [
          {
            path: '/config/model',
            name: 'ResourceModel',
            component: () => import('@/views/config/model/ResourceModel'),
            meta: { title: '资源模型', keepAlive: true, permission: [ 'config' ] }
          },
          {
            path: '/config/instance',
            name: 'ResourceInstance',
            component: () => import('@/views/config/instance/ResourceInstance'),
            meta: { title: '资源实例', keepAlive: true, permission: [ 'config' ] }
          }
        ]
      },

      // analysis
      {
        path: '/analysis',
        name: 'analysis',
        redirect: '/analysis/strategy',
        component: RouteView,
        meta: { title: '数据分析', keepAlive: true, icon: 'deployment-unit', permission: [ 'analysis' ] },
        children: [
          {
            path: '/analysis/strategy',
            name: 'BaselineStrategy',
            component: () => import('@/views/analysis/strategy/BaselineStrategy'),
            meta: { title: '动态基线策略管理', keepAlive: true, permission: [ 'analysis' ] }
          },
          {
            path: '/analysis/definition',
            name: 'BaselineDefinition',
            component: () => import('@/views/analysis/definition/BaselineDefinition'),
            meta: { title: '动态基线定义管理', keepAlive: true, permission: [ 'analysis' ] }
          }
        ]
      },

      // patrol
      {
        path: '/patrol',
        name: 'patrol',
        redirect: '/patrol/calendar',
        component: RouteView,
        meta: { title: '巡检管理', keepAlive: true, icon: 'environment', permission: [ 'patrol' ] },
        children: [
          {
            path: '/patrol/calendar',
            name: 'Calendar',
            component: () => import('@/views/patrol/calendar/TaskCalendar'),
            meta: { title: '任务日历', keepAlive: true, permission: [ 'patrol' ] }
          },
          {
            path: '/patrol/route',
            name: 'RouteManagement',
            component: () => import('@/views/patrol/route/RouteManagement'),
            meta: { title: '路线管理', keepAlive: true, permission: [ 'patrol' ] }
          },
          {
            path: '/patrol/plan',
            name: 'Plan',
            component: () => import('@/views/patrol/plan/Plan'),
            meta: { title: '计划管理', keepAlive: true, permission: [ 'patrol' ] }
          },
          {
            path: '/patrol/task',
            name: 'PatrolTask',
            component: () => import('@/views/patrol/task/PatrolTask'),
            meta: { title: '巡检任务管理', keepAlive: true, permission: [ 'patrol' ] }
          },
          {
            path: '/patrol/object',
            name: 'PatrolObject',
            component: () => import('@/views/patrol/object/PatrolObject'),
            meta: { title: '巡检检查对象', keepAlive: true, permission: [ 'patrol' ] }
          }
        ]
      },

      // system
      {
        path: '/system',
        name: 'system',
        redirect: '/system/user',
        component: RouteView,
        meta: { title: '系统设置', keepAlive: true, icon: 'setting', permission: [ 'system' ] },
        children: [
          {
            path: '/system/user',
            name: 'User',
            component: () => import('@/views/system/user/User'),
            meta: { title: '用户管理', keepAlive: true, permission: [ 'system' ] }
          },
          {
            path: '/system/group',
            name: 'Group',
            component: () => import('@/views/system/group/Group'),
            meta: { title: '工作组管理', keepAlive: true, permission: [ 'system' ] }
          },
          {
            path: '/system/audit',
            name: 'Audit',
            component: () => import('@/views/system/audit/Audit'),
            meta: { title: '审计管理', keepAlive: true, permission: [ 'system' ] }
          }
        ]
      },

      // 以下是示例页面路由，待之后进行删除
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: PageView,
        meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      },

      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/table-list',
        meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      },

      // other
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'view' ] },
        redirect: '/other/list',
        children: [
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
