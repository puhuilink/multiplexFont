import { UserLayout, BasicLayout, RouteView } from '@/layouts'

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
            component: () => import('@/views/alarm/AlarmMonitor'),
            meta: { title: '告警监控', keepAlive: true, permission: [ 'F003001' ] }
          },
          {
            path: '/alarm/history',
            component: RouteView,
            meta: { title: '告警记录', keepAlive: true, permission: [ 'F003002' ] },
            redirect: '/alarm/history/AlarmHistory',
            children: [
              {
                path: '/alarm/history/alarm-history',
                name: 'AlarmHistory',
                component: () => import('@/views/alarm/history/AlarmHistory'),
                meta: { title: '历史告警', keepAlive: true, permission: [ 'F003002001' ] }
              },
              {
                path: '/alarm/history/forward-history',
                name: 'ForwardHistory',
                component: () => import('@/views/alarm/history/ForwardHistory'),
                meta: { title: '通知记录', keepAlive: true, permission: [ 'F003002002' ] }
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
                path: '/alarm/config/alarm-strategy',
                name: 'AlarmStrategy',
                component: () => import('@/views/alarm/config/AlarmStrategy/index'),
                meta: { title: '阈值规则', keepAlive: true, permission: [ 'F003003003' ] }
              },
              {
                path: '/alarm/config/describe-temp',
                name: 'DescribeTemp',
                component: () => import('@/views/alarm/config/DescribeTemp/index'),
                meta: { title: '告警描述模板', keepAlive: true, permission: [ 'F003003003' ] }
              },
              {
                path: '/alarm/config/forward-temp',
                name: 'ForwardTemp',
                component: () => import('@/views/alarm/config/ForwardTemp/index'),
                meta: { title: '通知模板规则', keepAlive: true, permission: ['F003002003'] }
              },
              {
                path: '/alarm/config/forward-rules',
                name: 'ForwardRules',
                component: () => import('@/views/alarm/config/ForwardRules/index'),
                meta: { title: '告警通知规则', keepAlive: true }
              },
              {
                path: '/alarm/config/alarm-rules',
                name: 'AlarmRules',
                component: () => import('@/views/alarm/config/AlarmRules/index'),
                meta: { title: '告警规则', keepAlive: true, permission: [ 'F003003002' ] }
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
            component: () => import('@/views/performance/navigation'),
            meta: { title: '树形导航图', keepAlive: true, permission: [ 'F004002' ] }
          },
          // {
          //   path: '/performance/quota',
          //   name: 'QuotaList',
          //   component: () => import('@/views/performance/quota/QuotaList'),
          //   meta: { title: '指标列表', keepAlive: true, permission: [ 'F004001' ] }
          // },
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
      // 废弃
      // {
      //   path: '/config',
      //   name: 'config',
      //   redirect: '/config/model',
      //   component: RouteView,
      //   meta: { title: '配置管理', keepAlive: true, icon: 'idcard', permission: [ 'F007' ] },
      //   children: [
      //     {
      //       path: '/config/model',
      //       name: 'ResourceModel',
      //       component: () => import('@/views/config/model/ResourceModel'),
      //       meta: { title: '资源模型', keepAlive: true, permission: [ 'F007001' ] }
      //     },
      //     {
      //       path: '/config/instance',
      //       name: 'ResourceInstance',
      //       component: () => import('@/views/config/instance/ResourceInstance'),
      //       meta: { title: '资源实例', keepAlive: true, permission: [ 'F007002' ] }
      //     }
      //   ]
      // },

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
        meta: { title: '巡更管理', keepAlive: true, icon: 'environment', permission: [ 'F010' ] },
        children: [
          {
            path: '/patrol/config',
            name: 'PatrolConfig',
            component: () => import('@/views/patrol/config/index'),
            meta: { title: '巡更配置', keepAlive: true, permission: [ 'F010001' ] }
          },
          // {
          //   path: '/patrol/calendar',
          //   name: 'Calendar',
          //   component: () => import('@/views/patrol/calendar/TaskCalendar'),
          //   meta: { title: '任务日历', keepAlive: true, permission: [ 'F010001' ] }
          // },
          // {
          //   path: '/patrol/route',
          //   name: 'RouteManagement',
          //   component: () => import('@/views/patrol/route/RouteManagement'),
          //   meta: { title: '路线展示', keepAlive: true, permission: [ 'F010002' ] }
          // },
          {
            path: '/patrol/plan',
            name: 'Plan',
            component: () => import('@/views/patrol/plan/index'),
            meta: { title: '计划管理', keepAlive: true, permission: [ 'F010003' ] }
          },
          {
            path: '/patrol/change-shift',
            name: 'ChangeShift',
            component: () => import('@/views/patrol/ChangeShift'),
            meta: { title: '交接班查询', keepAlive: true, permission: [ 'F010003' ] }
          },
          {
            path: '/patrol/task',
            name: 'PatrolTask',
            component: () => import('@/views/patrol/task/PatrolTask'),
            meta: { title: '巡更记录单', keepAlive: true, permission: [ 'F010004' ] }
          },
          // {
          //   path: '/patrol/object',
          //   name: 'PatrolObject',
          //   component: () => import('@/views/patrol/object/PatrolObject'),
          //   meta: { title: '巡更检查对象', keepAlive: true, permission: [ 'F010005' ] }
          // },
          {
            path: '/patrol/alarm-approve',
            name: 'AlarmApprove',
            component: () => import('@/views/patrol/alarm-approve/index'),
            meta: { title: '告警审批', keepAlive: true, permission: [ 'F010005' ] }
          }
        ]
      },

      // 个人设置
      {
        path: '/user',
        name: 'user',
        redirect: '/user/psd-change',
        component: RouteView,
        meta: { title: '个人中心', keepAlive: true, icon: 'user' },
        children: [
          {
            path: '/psd-change',
            name: 'PsdChange',
            component: () => import('@/views/user/PsdChange'),
            meta: { title: '重置密码' }
          }
        ]
      }
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
 * FIXME: 因权限分配可能导致 redirect 到的路由不存在，需要通过函数进行判断
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
      }
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
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]

export const defaultPathList = constantRouterMap.map(({ path }) => path)
export const logicPathList = asyncRouterMap[0].children.map(({ path }) => path)
