/**
* 图表配置
* Author: dong xing
* Date: 2020/1/13
* Time: 2:55 下午
* Email: dong.xing@outlook.com
*/

import Template from '@/model/template'

// 图表模板
// 对应 CommonConfig 构造参数
const charts = [
  {
    category: 'CHART', type: 'Lines', name: '折线图', icon: 'line-chart', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Bar', name: '柱形图', icon: 'bar-chart', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Pie', name: '饼图', icon: 'pie-chart', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Polar', name: '极坐标图', icon: 'radar-chart', width: 600, height: 600
  },
  {
    category: 'CHART', type: 'Topology', name: '拓扑图', icon: 'branches', width: 800, height: 600, backgroundColor: 'rgba(230,226,226,1)'
  },
  {
    category: 'CHART', type: 'Texts', name: '文本', icon: 'font-colors', width: 200, height: 100
  },
  {
    category: 'CHART', type: 'Rect', name: '矩形', icon: 'border', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Circle', name: '圆形', icon: 'loading-3-quarters', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Clock', name: '时钟', icon: 'clock-circle', width: 300, height: 100
  },
  {
    category: 'CHART', type: 'Triangle', name: '三角形', icon: 'heat-map', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Image', name: '图片', icon: 'picture', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'Gauge', name: '仪表盘', icon: 'dashboard', width: 400, height: 400, backgroundColor: 'rgba(0, 0, 0, 1)'
  },
  {
    category: 'CHART', type: 'DegreeRing', name: '环度', icon: 'info-circle', width: 300, height: 300
  },
  {
    category: 'CHART', type: 'TextHealth', name: '文本健康度', icon: 'underline', width: 200, height: 100
  }
]

// 元素模板
const elements = [
  {
    category: 'ELEMENT', type: 'AlarmList', name: '告警列表', icon: 'bell', width: 1200, height: 560
  },
  {
    category: 'ELEMENT', type: 'List', name: '列表', icon: 'table', width: 1200, height: 560, backgroundColor: 'rgba(230, 230, 230, 1)'
  }
]

// 可拓展模板
const TEMPLATES = [
  ...charts.map(chart => new Template(chart)),
  ...elements.map(element => new Template(element))
]

export default TEMPLATES
