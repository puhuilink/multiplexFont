// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// 引入外部 svg icon
// import { bxAnalyse } from '@/core/icons'

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
        meta: { title: '视图管理', keepAlive: true, icon: 'home', permission: [ 'F002' ] },
        children: [
          {
            path: '/view/display',
            name: 'ViewDisplay',
            component: () => import('@/views/view/display/ViewDisplay'),
            meta: { title: '视图展示', keepAlive: true, permission: [ 'F002001', 'F002003' ] }
          },
          {
            path: '/view/list',
            name: 'ViewList',
            component: () => import('@/views/view/list/ViewList'),
            meta: { title: '视图定制', keepAlive: true, permission: [ 'F002002' ] }
          }
        ]
      },

      // alarm
      {
        path: '/alarm',
        name: 'alarm',
        redirect: '/alarm/monitor',
        component: RouteView,
        meta: { title: '告警管理', keepAlive: true, icon: 'alert', permission: [ 'F003' ] },
        children: [
          {
            path: '/alarm/monitor',
            name: 'AlarmMonitor',
            component: () => import('@/views/alarm/monitor/AlarmMonitor'),
            meta: { title: '告警监控', keepAlive: true, permission: [ 'F003001' ] }
          },
          {
            path: '/alarm/handle',
            component: RouteView,
            meta: { title: '告警处理', keepAlive: true, permission: [ 'F003002' ] },
            redirect: '/alarm/handle/HistoricalAlarms',
            children: [
              {
                path: '/alarm/handle/HistoricalAlarms',
                name: 'HistoricalAlarms',
                component: () => import('@/views/alarm/handle/HistoricalAlarms'),
                meta: { title: '历史告警', keepAlive: true, permission: [ 'F003002001' ] }
              },
              {
                path: '/alarm/handle/PrequelRecord',
                name: 'PrequelRecord',
                component: () => import('@/views/alarm/handle/PrequelRecord'),
                meta: { title: '前转记录', keepAlive: true, permission: [ 'F003002002' ] }
              },
              {
                path: '/alarm/handle/GenerateFault',
                name: 'GenerateFault',
                component: () => import('@/views/alarm/handle/GenerateFault'),
                meta: { title: '生成故障', keepAlive: true, permission: [ 'F003002003' ] }
              }
            ]
          },
          {
            path: '/alarm/config',
            name: 'AlarmConfig',
            component: RouteView,
            meta: { title: '告警配置', keepAlive: true, permission: [ 'F003003' ] },
            children: [
              {
                path: '/alarm/config/AlarmTypes',
                name: 'AlarmTypes',
                component: () => import('@/views/alarm/config/AlarmTypes'),
                meta: { title: '告警类型', keepAlive: true, permission: [ 'F003003001' ] }
              },
              {
                path: '/alarm/config/AlarmRules',
                name: 'AlarmRules',
                component: () => import('@/views/alarm/config/AlarmRules'),
                meta: { title: '告警规则', keepAlive: true, permission: [ 'F003003002' ] }
              },
              {
                path: '/alarm/config/ThresholdRules',
                name: 'ThresholdRules',
                component: () => import('@/views/alarm/config/ThresholdRules'),
                meta: { title: '阈值规则', keepAlive: true, permission: [ 'F003003003' ] }
              },
              {
                path: '/alarm/config/FaultTypes',
                name: 'FaultTypes',
                component: () => import('@/views/alarm/config/FaultTypes'),
                meta: { title: '故障类型', keepAlive: true, permission: [ 'F003003004' ] }
              },
              {
                path: '/alarm/config/GeneratingFaultRules',
                name: 'GeneratingFaultRules',
                component: () => import('@/views/alarm/config/GeneratingFaultRules'),
                meta: { title: '生成故障规则', keepAlive: true, permission: [ 'F003003005' ] }
              },
              {
                path: '/alarm/config/FaultManagement',
                name: 'FaultManagement',
                component: () => import('@/views/alarm/config/FaultManagement'),
                meta: { title: '故障前转路径管理', keepAlive: true, permission: [ 'F003003006' ] }
              }
            ]
          }
        ]
      },

      // performance
      {
        path: '/performance',
        name: 'performance',
        redirect: '/performance/navigation',
        component: RouteView,
        meta: { title: '性能管理', keepAlive: true, icon: 'thunderbolt', permission: [ 'F004' ] },
        children: [
          {
            path: '/performance/navigation',
            name: 'TreeNavigation',
            component: () => import('@/views/performance/navigation/TreeNavigation'),
            meta: { title: '树形导航图', keepAlive: true, permission: [ 'F004002' ] }
          },
          {
            path: '/performance/quota',
            name: 'QuotaList',
            component: () => import('@/views/performance/quota/QuotaList'),
            meta: { title: '指标列表', keepAlive: true, permission: [ 'F004001' ] }
          },
          {
            path: 'http://10.201.53.101/doc/page/login.asp?_1572316965780',
            name: 'VideoMonitor',
            meta: { title: '视频监控', target: '_blank', permission: [ 'F004003' ] }
          },
          {
            path: 'http://vicube.ccccltd.cn:48080/PlatformDockingURL?type=IMS',
            name: '服务管理',
            meta: { title: '服务管理', target: '_blank', permission: [ 'F004008' ] }
          },
          /* {
            path: '/performance/',
            name: '安全态势',
            meta: { title: '安全态势', target: '_blank', permission: [ 'F004007' ] },
            children: [
              {
                path: 'https://10.1.1.113/libra/tsa/#/overview',
                name: '整体态势',
                meta: { title: '整体态势', target: '_blank', permission: [ 'F004007001' ] }
              },
              {
                path: 'https://10.1.1.113/libra/tsa/#/intrusion',
                name: '入侵态势',
                meta: { title: '入侵态势', target: '_blank', permission: [ 'F004007002' ] }
              }
            ]
          },
          {
            path: '/performance/',
            name: '360安全',
            meta: { title: '360安全', target: '_blank', permission: [ 'F004009' ] },
            children: [
              {
                path: 'http://10.1.1.114:8080/login?refer=%2F',
                name: '360天擎',
                meta: { title: '360天擎', target: '_blank', permission: [ 'F004009001' ] }
              },
              {
                path: 'https://10.1.1.8/',
                name: '360天眼',
                meta: { title: '360天眼', target: '_blank', permission: [ 'F004009002' ] }
              },
              {
                path: 'https://10.1.1.9/',
                name: '分析平台',
                meta: { title: '分析平台', target: '_blank', permission: [ 'F004009003' ] }
              }
            ]
          }, */
          {
            path: 'http://10.1.1.7/login.jsp',
            name: '北京Pigoss',
            meta: { title: '北京Pigoss', target: '_blank', permission: [ 'F004004' ] }
          },
          {
            path: 'http://10.201.1.38/login.jsp',
            name: '厦门Pigoss',
            meta: { title: '厦门Pigoss', target: '_blank', permission: [ 'F004004' ] }
          },
          {
            path: 'http://10.1.1.10/',
            name: '北京动环',
            // 东环不存在权限配置项，则和主视图同等权重
            meta: { title: '北京动环', target: '_blank', permission: [ 'F004' ] }
          },
          {
            path: 'http://10.201.52.2/',
            name: '厦门动环',
            // 东环不存在权限配置项，则和主视图同等权重
            meta: { title: '厦门动环', target: '_blank', permission: [ 'F004' ] }
          },
          {
            path: 'http://10.1.1.192:7900/#/ccc?u=admin&p=admin',
            name: 'APM',
            meta: { title: 'APM', target: '_blank', permission: [ 'F004005' ] }
          },
          {
            path: 'http://10.1.1.211/zh-hans/accounts/login/?next=/',
            name: 'NPM',
            meta: { title: 'NPM', target: '_blank', permission: [ 'F004006' ] }
          }
        ]
      },

      // config
      {
        path: '/config',
        name: 'config',
        redirect: '/config/model',
        component: RouteView,
        meta: { title: '配置管理', keepAlive: true, icon: 'idcard', permission: [ 'F007' ] },
        children: [
          {
            path: '/config/model',
            name: 'ResourceModel',
            component: () => import('@/views/config/model/ResourceModel'),
            meta: { title: '资源模型', keepAlive: true, permission: [ 'F007001' ] }
          },
          {
            path: '/config/instance',
            name: 'ResourceInstance',
            component: () => import('@/views/config/instance/ResourceInstance'),
            meta: { title: '资源实例', keepAlive: true, permission: [ 'F007002' ] }
          }
        ]
      },

      // analysis
      {
        path: '/analysis',
        name: 'analysis',
        redirect: '/analysis/policy',
        component: RouteView,
        meta: { title: '数据分析', keepAlive: true, icon: 'deployment-unit', permission: [ 'F008' ] },
        children: [
          {
            path: '/analysis/policy',
            name: 'BaselineStrategy',
            component: () => import('@/views/analysis/policy/BaselinePolicy'),
            meta: { title: '动态基线策略管理', keepAlive: true, permission: [ 'F008001' ] }
          },
          {
            path: '/analysis/definition',
            name: 'BaselineDefinition',
            component: () => import('@/views/analysis/definition/BaselineDefinition'),
            meta: { title: '动态基线定义管理', keepAlive: true, permission: [ 'F008002' ] }
          }
        ]
      },

      // system
      {
        path: '/system',
        name: 'system',
        redirect: '/system/user',
        component: RouteView,
        meta: { title: '系统设置', keepAlive: true, icon: 'setting', permission: [ 'F001' ] },
        children: [
          {
            path: '/system/user',
            name: 'User',
            component: () => import('@/views/system/user/User'),
            meta: { title: '用户管理', keepAlive: true, permission: [ 'F001001' ] }
          },
          {
            path: '/system/group',
            name: 'Group',
            component: () => import('@/views/system/group/Group'),
            meta: { title: '工作组管理', keepAlive: true, permission: [ 'F001002' ] }
          },
          {
            path: '/system/audit',
            name: 'Audit',
            component: () => import('@/views/system/audit/Audit'),
            meta: { title: '审计管理', keepAlive: true, permission: [ 'F001003' ] }
          }
        ]
      },

      // patrol
      {
        path: '/patrol',
        name: 'patrol',
        redirect: '/patrol/calendar',
        component: RouteView,
        meta: { title: '巡检管理', keepAlive: true, icon: 'environment', permission: [ 'F010' ] },
        children: [
          {
            path: '/patrol/calendar',
            name: 'Calendar',
            component: () => import('@/views/patrol/calendar/TaskCalendar'),
            meta: { title: '任务日历', keepAlive: true, permission: [ 'F010001' ] }
          },
          {
            path: '/patrol/route',
            name: 'RouteManagement',
            component: () => import('@/views/patrol/route/RouteManagement'),
            meta: { title: '路线管理', keepAlive: true, permission: [ 'F010002' ] }
          },
          {
            path: '/patrol/plan',
            name: 'Plan',
            component: () => import('@/views/patrol/plan/Plan'),
            meta: { title: '计划管理', keepAlive: true, permission: [ 'F010003' ] }
          },
          {
            path: '/patrol/task',
            name: 'PatrolTask',
            component: () => import('@/views/patrol/task/PatrolTask'),
            meta: { title: '巡检任务单', keepAlive: true, permission: [ 'F010004' ] }
          },
          {
            path: '/patrol/object',
            name: 'PatrolObject',
            component: () => import('@/views/patrol/object/PatrolObject'),
            meta: { title: '巡检检查对象', keepAlive: true, permission: [ 'F010005' ] }
          }
        ]
      },

      // 个人设置
      {
        path: '/user',
        name: 'user',
        redirect: '/user/PsdChange',
        component: RouteView,
        meta: { title: '个人中心', keepAlive: true, icon: 'user' },
        children: [
          {
            path: '/PsdChange',
            name: 'PsdChange',
            component: () => import('@/views/user/PsdChange'),
            meta: { title: '重置密码' }
          }
        ]
      }

      // 以下是示例页面路由，待之后进行删除
      // forms
      // {
      //   path: '/form',
      //   redirect: '/form/base-form',
      //   component: PageView,
      //   meta: { title: '表单页', icon: 'form', permission: [ 'form' ] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/BasicForm'),
      //       meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
      //     }
      //   ]
      // },
      //
      // // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: PageView,
      //   redirect: '/list/table-list',
      //   meta: { title: '列表页', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
      //     }
      //   ]
      // },
      //
      // // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/settings',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
      //   children: [
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', keepAlive: true, permission: [ 'user' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },
      //
      // // other
      // {
      //   path: '/other',
      //   name: 'otherPage',
      //   component: PageView,
      //   meta: { title: '其他组件', icon: 'slack', permission: [ 'view' ] },
      //   redirect: '/other/list',
      //   children: [
      //     {
      //       path: '/other/list',
      //       component: RouteView,
      //       meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
      //       redirect: '/other/list/tree-list',
      //       children: [
      //         {
      //           path: '/other/list/tree-list',
      //           name: 'TreeList',
      //           component: () => import('@/views/other/TreeList'),
      //           meta: { title: '树目录表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/edit-table',
      //           name: 'EditList',
      //           component: () => import('@/views/other/TableInnerEditList'),
      //           meta: { title: '内联编辑表格', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/user-list',
      //           name: 'UserList',
      //           component: () => import('@/views/other/UserList'),
      //           meta: { title: '用户列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/role-list',
      //           name: 'RoleList',
      //           component: () => import('@/views/other/RoleList'),
      //           meta: { title: '角色列表', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/system-role',
      //           name: 'SystemRole',
      //           component: () => import('@/views/role/RoleList'),
      //           meta: { title: '角色列表2', keepAlive: true }
      //         },
      //         {
      //           path: '/other/list/permission-list',
      //           name: 'PermissionList',
      //           component: () => import('@/views/other/PermissionList'),
      //           meta: { title: '权限列表', keepAlive: true }
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  },
  // 视图设计
  {
    path: '/design',
    name: 'Design',
    hidden: true,
    component: () => import('@/views/design/Design'),
    meta: { title: '视图设计', permission: ['F002002'] },
    props: route => route.query
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
