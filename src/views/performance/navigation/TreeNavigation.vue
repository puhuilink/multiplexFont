/*
 * 树形导航图
 * Author: yizhu liu
 * Date: 2019-12-27 09:21:14
 * Email: lyz02413@163.com
 */
<template>
  <div class="TreeNavigation">
    <a-row>
      <a-col :span="6">
        <ResourceTree
          hiddenTab
          :rootKeys="['BJDC', 'XMDC']"
        />
      </a-col>

      <a-col :span="18">
        视图 TODO
      </a-col>
    </a-row>
  </div>
</template>

<script>
import SubMenu from '@/components/SubMenu/SubMenu'
import {
  ResourceTree
} from '@/components/Resource'

export default {
  name: 'TreeNavigation',
  components: {
    'sub-menu': SubMenu,
    ResourceTree
  },
  data () {
    return {
      collapsed: false,
      list: [
        {
          key: 'BJ',
          title: '北京数据中心',
          children: [
            {
              key: 'BJ.1',
              title: '业务应用',
              children: [
                {
                  key: 'BJ.1.1',
                  title: '应用系统',
                  children: [
                    {
                      key: 'BJ.1.1.1',
                      title: '360天擎'
                    },
                    {
                      key: 'BJ.1.1.2',
                      title: '财务战略地图'
                    },
                    {
                      key: 'BJ.1.1.3',
                      title: '飞思动环监控系统'
                    },
                    {
                      key: 'BJ.1.1.4',
                      title: '高德AMp应用监控系统'
                    },
                    {
                      key: 'BJ.1.1.5',
                      title: '国资委大额资金监管系统'
                    },
                    {
                      key: 'BJ.1.1.6',
                      title: '天旦网络性能监控平台'
                    },
                    {
                      key: 'BJ.1.1.7',
                      title: '统一监控平台'
                    },
                    {
                      key: 'BJ.1.1.8',
                      title: '无线PORTAL认证'
                    },
                    {
                      key: 'BJ.1.1.9',
                      title: '无纸化会议服务'
                    },
                    {
                      key: 'BJ.1.1.10',
                      title: '运维流程平台'
                    },
                    {
                      key: 'BJ.1.1.11',
                      title: '审计管理'
                    },
                    {
                      key: 'BJ.1.1.12',
                      title: '青年网'
                    },
                    {
                      key: 'BJ.1.1.13',
                      title: '财务管理'
                    },
                    {
                      key: 'BJ.1.1.14',
                      title: '财务报表'
                    },
                    {
                      key: 'BJ.1.1.15',
                      title: '新财务报表'
                    },
                    {
                      key: 'BJ.1.1.16',
                      title: '管理会计'
                    },
                    {
                      key: 'BJ.1.1.17',
                      title: '财务共享'
                    },
                    {
                      key: 'BJ.1.1.18',
                      title: '财务网站'
                    },
                    {
                      key: 'BJ.1.1.19',
                      title: '科技创新'
                    },
                    {
                      key: 'BJ.1.1.20',
                      title: 'ELP翻译'
                    },
                    {
                      key: 'BJ.1.1.21',
                      title: '物资采购'
                    },
                    {
                      key: 'BJ.1.1.22',
                      title: '信息评测'
                    },
                    {
                      key: 'BJ.1.1.23',
                      title: '中交法律系统'
                    },
                    {
                      key: 'BJ.1.1.24',
                      title: '法律管理'
                    },
                    {
                      key: 'BJ.1.1.25',
                      title: '供应商'
                    },
                    {
                      key: 'BJ.1.1.26',
                      title: '人力资源'
                    },
                    {
                      key: 'BJ.1.1.27',
                      title: '新人力资源'
                    },
                    {
                      key: 'BJ.1.1.28',
                      title: '质量监督'
                    },
                    {
                      key: 'BJ.1.1.29',
                      title: '财务影像'
                    },
                    {
                      key: 'BJ.1.1.30',
                      title: '纪检监督'
                    },
                    {
                      key: 'BJ.1.1.31',
                      title: '已暂停：经营生产'
                    },
                    {
                      key: 'BJ.1.1.32',
                      title: '科技评审'
                    },
                    {
                      key: 'BJ.1.1.33',
                      title: '科技管理'
                    },
                    {
                      key: 'BJ.1.1.34',
                      title: '领导人员'
                    },
                    {
                      key: 'BJ.1.1.35',
                      title: '信息评测'
                    }
                  ]
                },
                {
                  key: 'BJ.2',
                  title: '应用性能监控',
                  children: [
                    {
                      key: 'BJ.2.1',
                      titleL: '采购12'
                    },
                    {
                      key: 'BJ.2.2',
                      title: '采购13'
                    },
                    {
                      key: 'BJ.2.3',
                      title: '采购14'
                    },
                    {
                      key: 'BJ.2.4',
                      title: '采购15'
                    },
                    {
                      key: 'BJ.2.5',
                      title: '采购16'
                    },
                    {
                      key: 'BJ.2.6',
                      title: '采购17'
                    },
                    {
                      key: 'BJ.2.7',
                      title: '生产经营115'
                    },
                    {
                      key: 'BJ.2.8',
                      title: '生产经营151'
                    },
                    {
                      key: 'BJ.2.9',
                      title: '生产经营152'
                    },
                    {
                      key: 'BJ.2.10',
                      title: '生产经营153'
                    },
                    {
                      key: 'BJ.2.11',
                      title: '办公11'
                    },
                    {
                      key: 'BJ.2.12',
                      title: '办公12'
                    },
                    {
                      key: 'BJ.2.13',
                      title: '人资11'
                    },
                    {
                      key: 'BJ.2.14',
                      title: '人资12'
                    },
                    {
                      key: 'BJ.2.15',
                      title: '生产经营161'
                    },
                    {
                      key: 'BJ.2.16',
                      title: '生产经营162'
                    },
                    {
                      key: 'BJ.2.17',
                      title: '生产经营163'
                    }
                  ]
                },
                {
                  key: 'BJ.3',
                  title: '网络性能监控',
                  children: [
                    {
                      key: 'BJ.3.1',
                      title: '交建通.AD负载均衡'
                    },
                    {
                      key: 'BJ.3.2',
                      title: '交建通.交换机'
                    },
                    {
                      key: 'BJ.3.3',
                      title: '交建通.应用'
                    },
                    {
                      key: 'BJ.3.4',
                      title: '人力资源.核心交换'
                    },
                    {
                      key: 'BJ.3.5',
                      title: '人力资源.负载均衡'
                    },
                    {
                      key: 'BJ.3.6',
                      title: '人力资源.网桥'
                    }
                  ]
                }
              ]
            },
            {
              key: 'BJ.2',
              title: '软件系统',
              children: [
                {
                  key: 'BJ.2,1',
                  title: '中间件'
                },
                {
                  key: 'BJ.2.2',
                  title: '数据库'
                },
                {
                  key: 'BJ.2.3',
                  title: '虚拟化'
                },
                {
                  key: 'BJ.2.4',
                  title: '操作系统'
                }
              ]
            },
            {
              key: 'BJ.3',
              title: '硬件设备'
            },
            {
              key: 'BJ.4',
              title: '基础设备'
            }
          ]
        },
        {
          key: 'XM',
          title: '厦门数据中心',
          children: [
            {
              key: 'BJ.1',
              title: '业务应用',
              children: [
                {
                  key: 'BJ.1.1',
                  title: '应用系统',
                  children: [
                    {
                      key: 'BJ.1.1.1',
                      title: '360天擎'
                    },
                    {
                      key: 'BJ.1.1.2',
                      title: '财务战略地图'
                    },
                    {
                      key: 'BJ.1.1.3',
                      title: '飞思动环监控系统'
                    },
                    {
                      key: 'BJ.1.1.4',
                      title: '高德AMp应用监控系统'
                    },
                    {
                      key: 'BJ.1.1.5',
                      title: '国资委大额资金监管系统'
                    },
                    {
                      key: 'BJ.1.1.6',
                      title: '天旦网络性能监控平台'
                    },
                    {
                      key: 'BJ.1.1.7',
                      title: '统一监控平台'
                    },
                    {
                      key: 'BJ.1.1.8',
                      title: '无线PORTAL认证'
                    },
                    {
                      key: 'BJ.1.1.9',
                      title: '无纸化会议服务'
                    },
                    {
                      key: 'BJ.1.1.10',
                      title: '运维流程平台'
                    },
                    {
                      key: 'BJ.1.1.11',
                      title: '审计管理'
                    },
                    {
                      key: 'BJ.1.1.12',
                      title: '青年网'
                    },
                    {
                      key: 'BJ.1.1.13',
                      title: '财务管理'
                    },
                    {
                      key: 'BJ.1.1.14',
                      title: '财务报表'
                    },
                    {
                      key: 'BJ.1.1.15',
                      title: '新财务报表'
                    },
                    {
                      key: 'BJ.1.1.16',
                      title: '管理会计'
                    },
                    {
                      key: 'BJ.1.1.17',
                      title: '财务共享'
                    },
                    {
                      key: 'BJ.1.1.18',
                      title: '财务网站'
                    },
                    {
                      key: 'BJ.1.1.19',
                      title: '科技创新'
                    },
                    {
                      key: 'BJ.1.1.20',
                      title: 'ELP翻译'
                    },
                    {
                      key: 'BJ.1.1.21',
                      title: '物资采购'
                    },
                    {
                      key: 'BJ.1.1.22',
                      title: '信息评测'
                    },
                    {
                      key: 'BJ.1.1.23',
                      title: '中交法律系统'
                    },
                    {
                      key: 'BJ.1.1.24',
                      title: '法律管理'
                    },
                    {
                      key: 'BJ.1.1.25',
                      title: '供应商'
                    },
                    {
                      key: 'BJ.1.1.26',
                      title: '人力资源'
                    },
                    {
                      key: 'BJ.1.1.27',
                      title: '新人力资源'
                    },
                    {
                      key: 'BJ.1.1.28',
                      title: '质量监督'
                    },
                    {
                      key: 'BJ.1.1.29',
                      title: '财务影像'
                    },
                    {
                      key: 'BJ.1.1.30',
                      title: '纪检监督'
                    },
                    {
                      key: 'BJ.1.1.31',
                      title: '已暂停：经营生产'
                    },
                    {
                      key: 'BJ.1.1.32',
                      title: '科技评审'
                    },
                    {
                      key: 'BJ.1.1.33',
                      title: '科技管理'
                    },
                    {
                      key: 'BJ.1.1.34',
                      title: '领导人员'
                    },
                    {
                      key: 'BJ.1.1.35',
                      title: '信息评测'
                    }
                  ]
                },
                {
                  key: 'BJ.2',
                  title: '应用性能监控',
                  children: [
                    {
                      key: 'BJ.2.1',
                      titleL: '采购12'
                    },
                    {
                      key: 'BJ.2.2',
                      title: '采购13'
                    },
                    {
                      key: 'BJ.2.3',
                      title: '采购14'
                    },
                    {
                      key: 'BJ.2.4',
                      title: '采购15'
                    },
                    {
                      key: 'BJ.2.5',
                      title: '采购16'
                    },
                    {
                      key: 'BJ.2.6',
                      title: '采购17'
                    },
                    {
                      key: 'BJ.2.7',
                      title: '生产经营115'
                    },
                    {
                      key: 'BJ.2.8',
                      title: '生产经营151'
                    },
                    {
                      key: 'BJ.2.9',
                      title: '生产经营152'
                    },
                    {
                      key: 'BJ.2.10',
                      title: '生产经营153'
                    },
                    {
                      key: 'BJ.2.11',
                      title: '办公11'
                    },
                    {
                      key: 'BJ.2.12',
                      title: '办公12'
                    },
                    {
                      key: 'BJ.2.13',
                      title: '人资11'
                    },
                    {
                      key: 'BJ.2.14',
                      title: '人资12'
                    },
                    {
                      key: 'BJ.2.15',
                      title: '生产经营161'
                    },
                    {
                      key: 'BJ.2.16',
                      title: '生产经营162'
                    },
                    {
                      key: 'BJ.2.17',
                      title: '生产经营163'
                    }
                  ]
                },
                {
                  key: 'BJ.3',
                  title: '网络性能监控',
                  children: [
                    {
                      key: 'BJ.3.1',
                      title: '交建通.AD负载均衡'
                    },
                    {
                      key: 'BJ.3.2',
                      title: '交建通.交换机'
                    },
                    {
                      key: 'BJ.3.3',
                      title: '交建通.应用'
                    },
                    {
                      key: 'BJ.3.4',
                      title: '人力资源.核心交换'
                    },
                    {
                      key: 'BJ.3.5',
                      title: '人力资源.负载均衡'
                    },
                    {
                      key: 'BJ.3.6',
                      title: '人力资源.网桥'
                    }
                  ]
                }
              ]
            },
            {
              key: 'BJ.2',
              title: '软件系统',
              children: [
                {
                  key: 'BJ.2,1',
                  title: '中间件'
                },
                {
                  key: 'BJ.2.2',
                  title: '数据库'
                },
                {
                  key: 'BJ.2.3',
                  title: '虚拟化'
                },
                {
                  key: 'BJ.2.4',
                  title: '操作系统'
                }
              ]
            },
            {
              key: 'BJ.3',
              title: '硬件设备'
            },
            {
              key: 'BJ.4',
              title: '基础设备'
            }
          ]
        }
      ]
    }
  },
  methods: {
    /**
     * 输入框查询
     */
    onSearch (value) {
      console.log(value)
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
      console.log(this.collapsed)
    }
  }
}
</script>

<style scoped lang='less'>
.tree-navigation{
  background: #fff;
  height: 100%;
}
.tn-header {
  background: #fff;
  color: black;
  button {
    margin-right: 7px;
    font-size: 16px;
    height: 32px;
  }
}
.ant-layout-sider-zero-width-trigger{
  background: #eee!important;
}

</style>
