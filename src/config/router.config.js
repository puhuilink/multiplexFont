import { UserLayout, BasicLayout, RouteView } from '@/layouts'
import { decrypt } from '@/utils/aes'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/view/display',
    children: [
      ...process.env.NODE_ENV === 'production' ? [] : [
        {
          path: '/dev-debug',
          component: () => import('@/views/dev-debug'),
          meta: { title: '开发调试页面', keepAlive: true, icon: 'bug' },
          name: 'devTest'
        }
      ],

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
            component: () => import('@/views/view/display/index'),
            meta: { title: '视图展示', keepAlive: true, permission: [ 'F002001', 'F002003' ] }
          },
          {
            path: '/view/list',
            name: 'ViewList',
            component: () => import('@/views/view/list/index'),
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
            component: () => import('@/views/alarm/monitor/index'),
            meta: { title: '告警监控', keepAlive: true, permission: [ 'F003001' ] }
          },
          {
            path: '/alarm/log',
            component: RouteView,
            meta: { title: '告警记录', keepAlive: true, permission: [ 'F003002' ] },
            redirect: '/alarm/log/alarm',
            children: [
              {
                path: '/alarm/log/history',
                name: 'AlarmLogHistory',
                component: () => import('@/views/alarm/log/history/index'),
                meta: { title: '历史告警', keepAlive: true, permission: [ 'F003002001' ] }
              },
              {
                path: '/alarm/log/forward',
                name: 'AlarmLogForward',
                component: () => import('@/views/alarm/log/forward/index'),
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
                path: '/alarm/config/strategy',
                name: 'AlarmStrategy',
                component: () => import('@/views/alarm/config/strategy/index'),
                meta: { title: '阈值规则', keepAlive: true, permission: [ 'F003003001' ] }
              },
              // {
              //   path: '/alarm/config/describe-temp',
              //   name: 'DescribeTemp',
              //   component: () => import('@/views/alarm/config/describe-temp/index'),
              //   meta: { title: '告警描述模板', keepAlive: true, permission: [ 'F003003003' ] }
              // },
              {
                path: '/alarm/config/forward-temp',
                name: 'ForwardTemp',
                component: () => import('@/views/alarm/config/forward-temp/index'),
                meta: { title: '告警通知模板', keepAlive: true, permission: ['F003003002'] }
              },
              // 前转规则合并
              // {
              //   path: '/alarm/config/forward-rules',
              //   name: 'ForwardRules',
              //   component: () => import('@/views/alarm/config/forward-rules/index'),
              //   meta: { title: '告警通知规则', keepAlive: true, permission: ['F003003003'] }
              // },
              {
                path: '/alarm/config/rules',
                name: 'AlarmRules',
                component: () => import('@/views/alarm/config/rules/index'),
                meta: { title: '告警规则', keepAlive: true, permission: [ 'F003003004' ] }
              },
              {
                path: '/alarm/config/forward-bind',
                name: 'ForwardBind',
                component: () => import('@/views/alarm/config/forward-bind/index'),
                // TODO 告警绑定没加权限位
                meta: { title: '告警绑定', keepAlive: true }
              }
            ]
          }
        ]
      },

      // performance
      {
        path: '/performance',
        name: 'performance',
        redirect: '/performance/tree-navigation',
        component: RouteView,
        meta: { title: '性能管理', keepAlive: true, icon: 'thunderbolt', permission: [ 'F004' ] },
        children: [
          {
            path: '/performance/tree-navigation',
            name: 'TreeNavigation',
            component: () => import('@/views/performance/tree-navigation/index'),
            meta: { title: '树形导航图', keepAlive: true, permission: [ 'F004001' ] }
          },
          {
            path: 'http://10.201.53.101/doc/page/login.asp?_1572316965780',
            name: 'VideoMonitor',
            meta: { title: '视频监控', target: '_blank', permission: [ 'F004002' ] }
          },
          {
            path: 'http://vicube.ccccltd.cn:48080/PlatformDockingURL?type=IMS',
            name: '服务管理',
            meta: { title: '服务管理', target: '_blank', permission: [ 'F004003' ] }
          },
          {
            path: 'http://10.1.1.7/login.jsp',
            name: '北京Pigoss',
            meta: { title: '北京Pigoss', target: '_blank', permission: [ 'F004004' ] }
          },
          {
            path: 'http://10.201.1.38/login.jsp',
            name: '厦门Pigoss',
            meta: { title: '厦门Pigoss', target: '_blank', permission: [ 'F004008' ] }
          },
          {
            path: 'http://10.1.1.10/',
            name: '北京动环',
            // 东环不存在权限配置项，则和主视图同等权重
            meta: { title: '北京动环', target: '_blank', permission: [ 'F004009' ] }
          },
          {
            path: 'http://10.201.52.2/',
            name: '厦门动环',
            // 东环不存在权限配置项，则和主视图同等权重
            meta: { title: '厦门动环', target: '_blank', permission: [ 'F004010' ] }
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
            component: () => import('@/views/system/user/index'),
            meta: { title: '用户管理', keepAlive: true, permission: [ 'F001001' ] }
          },
          {
            path: '/system/group',
            name: 'Group',
            component: () => import('@/views/system/group/index'),
            meta: { title: '工作组管理', keepAlive: true, permission: [ 'F001002' ] }
          },
          {
            path: '/system/audit',
            name: 'Audit',
            component: () => import('@/views/system/audit/index'),
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
            redirect: '/patrol/config/path',
            component: RouteView,
            meta: { title: '巡更配置', keepAlive: true, permission: [ 'F010' ] },
            children: [{
              path: '/patrol/config/path',
              name: 'PatrolConfigPath',
              component: () => import('@/views/patrol/config/index'),
              meta: { title: '巡更路径', keepAlive: true, permission: ['F010'] }
            },
            {
              path: '/patrol/config/metric',
              name: 'PatrolConfigMetric',
              component: () => import('@/views/patrol/config/MetricTable/MetricTable'),
              meta: { title: '检查项管理', keepAlive: true, permission: ['F010'] }
            },
            {
              path: '/patrol/config/answer',
              name: 'PatrolConfigAnswer',
              component: () => import('@/views/patrol/config/AnswerTable/index'),
              meta: { title: '检查值管理', keepAlive: true, permission: ['F010'] }
            },
            {
              path: '/patrol/config/threshold',
              name: 'PatrolConfigThreshold',
              component: () => import('@/views/patrol/config/ThresholdConfig/index'),
              meta: { title: '阈值管理', keepAlive: true, permission: ['F010'] }
            }
            ]
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
            meta: { title: '计划管理', keepAlive: true, permission: [ 'F010002' ] }
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
          },
          {
            path: '/patrol/NoticeTemp',
            name: 'NoticeTemp',
            component: () => import('@/views/patrol/NoticeTemp/index'),
            meta: { title: '巡更通知模板', keepAlive: true }
          },
          {
            path: '/patrol/informConfig',
            name: 'InformConfig',
            component: () => import('@/views/patrol/informConfig/index'),
            meta: { title: '巡更通知配置', keepAlive: true }
          }
        ]
      },
      // capacity
      {
        path: '/prediction',
        name: 'prediction',
        redirect: '/prediction/capacity',
        component: RouteView,
        meta: { title: '数据预测', keepAlive: true, icon: 'environment', permission: 'F011' },
        children: [
          {
            path: '/prediction/capacity',
            name: 'capacity',
            redirect: '/prediction/capacity/Summary',
            component: RouteView,
            meta: { title: '容量视图', keepAlive: true },
            children: [
              {
                path: '/prediction/capacity/Summary',
                name: 'Summary',
                component: () => import('@/views/prediction/capacity/Summary'),
                meta: { title: '容量总览', keepAlive: true }
              },
              {
                path: '/prediction/capacity/EchartsView',
                name: '容量预测',
                component: RouteView,
                meta: { title: '容量预测', keepAlive: true },
                redirect: '/prediction/capacity/EchartsView',
                // hideChildrenInMenu: 'MetadataBasic',
                children: [
                  {
                    path: '/prediction/capacity/capacityForcastBusinessSystem',
                    name: '业务系统容量预测',
                    component: () => import('@/views/prediction/capacity/EchartsView/capacityForcastBusinessSystem'),
                    meta: { title: '业务系统容量预测', keepAlive: true }
                  },
                  {
                    path: '/prediction/capacity/capacityForcastFileSystem',
                    name: '文件系统容量预测',
                    component: () => import('@/views/prediction/capacity/EchartsView/capacityForcastFileSystem'),
                    meta: { title: '文件系统容量预测', keepAlive: true }
                  }]
              }
            ]
          },
          {
            path: '/prediction/report',
            name: 'report',
            redirect: '/prediction/report/sql',
            component: RouteView,
            meta: { title: '报表管理', keepAlive: true },
            children: [
              {
                path: '/report/NEW',
                name: 'NEW',
                component: () => import('@/views/prediction/report/new'),
                meta: { title: '报表生成', keepAlive: true }
              },
              {
                path: '/report/sql',
                name: 'sql',
                component: () => import('@/views/prediction/report/sql'),
                meta: { title: '子表数据源管理', keepAlive: true }
              }
            ]
          },
          {
            path: '/prediction/metadata',
            name: 'metadataPage',
            component: RouteView,
            meta: { title: '数据管理' },
            redirect: '/prediction/metadata/source',
            children: [
              {
                path: '/prediction/metadata/Information',
                name: 'Information',
                component: () => import('@/views/prediction/metadata/InformationList'),
                meta: { title: '容量管理', keepAlive: true }
              },
              {
                path: '/metadata/source',
                name: 'SourceList',
                component: () => import('@/views/prediction/metadata/SourceList'),
                meta: { title: '数据源管理', keepAlive: true }
              },
              {
                path: '/metadata/Label',
                name: 'LabelList',
                component: () => import('@/views/prediction/metadata/LabelList'),
                meta: { title: '标签列表', keepAlive: true },
                hidden: true
              },
              {
                path: '/metadata/Dimension',
                name: 'DimensionList',
                component: () => import('@/views/prediction/metadata/DimensionList'),
                meta: { title: '维度列表', keepAlive: true },
                hidden: true
              },
              {
                path: '/prediction/metadata/metadataModel',
                name: 'MetadataModelList',
                component: RouteView,
                meta: { title: '元模型', keepAlive: true },
                redirect: '/prediction/metadata/MetadataModel',
                // hideChildrenInMenu: 'MetadataBasic',
                children: [
                  {
                    path: '/prediction/metadata/MetadataModel',
                    name: 'metamodelModelList',
                    component: () => import('@/views/prediction/metadata/MetadataModelList'),
                    meta: { title: '元模型列表', keepAlive: true }
                  }
                  // {
                  //   hidden: true,
                  //   path: '/prediction/metadata/metadataModel/create',
                  //   name: 'metamodelCreate',
                  //   component: () => import('@/views/prediction/metadata/modules/CreateMetadataModel/stepForm/StepForm'),
                  //   meta: { title: '元模型新建', keepAlive: true }
                  // },
                  // {
                  //   hidden: true,
                  //   path: '/prediction/metadata/metadataModel/graph/:id',
                  //   name: 'metamodelGraph',
                  //   component: () => import('@/views/prediction/metadata/modules/MetadataModelGraph'),
                  //   meta: { title: '元模型关系图', keepAlive: true }
                  // },
                  // {
                  //   hidden: true,
                  //   path: '/prediction/metadata/modules/MetadataBasic/:id',
                  //   name: 'MetadataBasic',
                  //   component: () => import('@/views/prediction/metadata/modules/MetadataBasic'),
                  //   meta: { title: '基础详情页', permission: ['profile'] }
                  // },
                  // {
                  //   hidden: true,
                  //   path: '/metadata/modules/QueryData/:sourceId/:dbName/:tableName',
                  //   name: 'QueryData',
                  //   component: () => import('@/views/metadata/modules/QueryData'),
                  //   meta: { title: '模型数据', permission: ['profile'] }
                  // }
                ]
              }
              // {
              //   hidden: true,
              //   path: '/metadata/MetadataModel1/:id',
              //   name: 'metamodelModelList1',
              //   component: () => import('@/views/metadata/MetadataModelList1'),
              //   meta: { title: '主题域元模型列表', keepAlive: true, permission: ['profile'] }
              // }
            ]
          }
          // {
          //   path: '/prediction/serverauth',
          //   name: 'serverAuth',
          //   redirect: '/prediction/serverAuth/managment',
          //   component: RouteView,
          //   meta: { title: '服务授权', keepAlive: true },
          //   children: [
          //     {
          //       path: '/prediction/serverAuth/managment',
          //       name: 'serverAuthMg',
          //       component: () => import('@/views/prediction/serverAuth/serverAuth'),
          //       meta: { title: '服务注册', keepAlive: true }
          //     }
          //   ]
          // }
        ]
      },

      // 个人设置
      {
        path: '/user',
        name: 'user',
        redirect: '/user/pwd-change',
        component: RouteView,
        meta: { title: '个人中心', keepAlive: true, icon: 'user' },
        children: [
          {
            path: '/pwd-change',
            name: 'PwdChange',
            component: () => import('@/views/user/PwdChange'),
            meta: { title: '重置密码' }
          },
          {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/user/settings/index'),
            meta: { title: '个人设置', hideHeader: true }
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
    component: () => import('@/views/design/index'),
    meta: { title: '视图设计', permission: ['F002002'] },
    props: route => route.query
  },

  // 数据管理平台
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
      }
    ]
  },

  // 视图设计
  {
    path: '/design',
    name: 'Design',
    hidden: true,
    component: () => import('@/views/design/index'),
    meta: { title: '视图设计', permission: ['F002002'] },
    props: route => route.query
  },

  // 视图直接访问(大屏)
  {
    path: '/preview/:id',
    name: 'Preview',
    hidden: true,
    component: () => import('@/views/preview/index'),
    meta: { title: '大屏' },
    props: route => ({
      id: decrypt(route.params.id)
    })
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]

export const defaultPathList = constantRouterMap.map(({ path }) => path)
export const logicPathList = asyncRouterMap[0].children.map(({ path }) => path)
