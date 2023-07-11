import { axios } from '@/utils/request'
import request from '@/views/SecurityMonitoring/api/request'

const baseUrl = '/h5/xjapp/v1/cloudNet'

// 获取安全狗-漏洞总览
export function getPatchStat () {
  return request({
    url: `${baseUrl}/patchStat`,
    method: 'GET'
  })
}

// 获取安全狗-已经安装Agent数
export function getServerNum () {
  return request({
    url: `${baseUrl}/serverNum`,
    method: 'GET'
  })
}

// 获取安全狗-周漏洞修复走势
export function getWeekRender () {
  return request({
    url: `${baseUrl}/weekRender`,
    method: 'GET'
  })
}

// 获取安全狗-月漏洞修复走势
export function getMonthRender () {
  return request({
    url: `${baseUrl}/monthRender`,
    method: 'GET'
  })
}

export const card = [{
  id: 1,
  title: '全网已修复漏洞数', // totalRepaired
  value: '-',
  unit: '个',
  img: '..../static/icon_p04.png',
  style: 'background: linear-gradient(135deg, #19D98B 0%, #138182 100%);border-radius: 4rpx;'
}, {
  id: 2,
  title: '全网未修复漏洞数',
  value: '-', // totalUnRepaired
  unit: '个',
  img: '../static/icon_p02.png',
  style: 'background: linear-gradient(135deg, #E179E1 0%, #8041BC 100%);border-radius: 4rpx;'
}, {
  id: 3,
  title: '全网响应总数',
  value: '-', // totalNum
  unit: '个',
  img: '../static/icon_p03.png',
  style: 'background: linear-gradient(135deg, #D8B073 0%, #936525 100%);border-radius: 4rpx;'
}, {
  id: 4,
  title: '全网平均修复率', // avgRepairedRate
  value: '-',
  unit: '%',
  img: '../static/icon_p01.png',
  style: 'background: linear-gradient(135deg, #04C0FE 0%, #6161FF 100%);border-radius: 4rpx;'
}]

export const level_option = {
  tooltip: {
    trigger: 'none'
  },
  grid: {
    top: '20'
  },
  series: [{
    name: 'Access From',
    type: 'pie',
    radius: ['30%', '65%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    hoverAnimation: false,
    label: {
      normal: {
        position: 'bottom',
        fontSize: 8,
        color: '#FFFFFF',
        formatter: function (params) {
          var label = `${params.name}: ${params.value} %`
          return label
        }
      }
    },
    labelLine: {
      normal: {
        show: false,
        length: 1,
        length2: 1
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 4, // 设置border的宽度有多大
        borderColor: '#0C233A'
      }
    },
    emphasis: {
      label: {
        show: false,
        fontSize: 20,
        fontWeight: 'bold'
      }
    },
    data: [{
      value: 41,
      name: '中危漏洞',
      itemStyle: {
        normal: {
          color: '#3CA6FF'
        },
        emphasis: {
          color: '#3CA6FF'
        }
      }
    },

    {
      value: 40,
      name: '高危漏洞',
      itemStyle: {
        normal: {
          color: '#FFA044'
        },
        emphasis: {
          color: '#FFA044'
        }
      }
    },
    {
      value: 7,
      name: '低危漏洞',
      itemStyle: {
        normal: {
          color: '#1BBF90'
        },
        emphasis: {
          color: '#1BBF90'
        }
      }
    }, {
      value: 12,
      name: '危急漏洞',
      itemStyle: {
        normal: {
          color: '#DC5656'
        },
        emphasis: {
          color: '#DC5656'
        }
      }
    }

    ]
  }]
}

export const catogray_option = {
  tooltip: {
    trigger: 'none'
  },
  grid: {
    top: '10%',
    left: '10%',
    right: '3%'
  },
  series: [{
    name: 'Access From',
    type: 'pie',
    radius: ['30%', '65%'],
    avoidLabelOverlap: false,
    hoverAnimation: false,
    label: {
      normal: {
        fontSize: 8,
        color: '#FFFFFF',
        formatter: function (params) {
          var label = `${params.name}: ${params.value} %`
          return label
        }
      }
    },
    labelLine: {
      normal: {
        show: false,
        length: 1,
        length2: 1
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 4, // 设置border的宽度有多大
        borderColor: '#0C233A'
      }
    },
    emphasis: {
      label: {
        show: false,
        fontSize: 20,
        fontWeight: 'bold'
      }
    },
    data: [{
      value: 10,
      name: '资源管理错误',
      itemStyle: {
        normal: {
          color: '#3CA6FF'
        },
        emphasis: {
          color: '#3CA6FF'
        }
      }
    },
    {
      value: 17,
      name: '输入验证漏洞',
      itemStyle: {
        normal: {
          color: '#EAE174'
        },
        emphasis: {
          color: '#EAE174'
        }
      }
    },
    {
      value: 9,
      name: '缓冲区溢出漏洞',
      itemStyle: {
        normal: {
          color: '#FFA044'
        },
        emphasis: {
          color: '#FFA044'
        }
      }
    },
    {
      value: 56,
      name: '其他漏洞',
      itemStyle: {
        normal: {
          color: '#DC5656'
        },
        emphasis: {
          color: '#DC5656'
        }
      }
    }, {
      value: 8,
      name: '信息泄露',
      itemStyle: {
        normal: {
          color: '#1BBF90'
        },
        emphasis: {
          color: '#1BBF90'
        }
      }
    }
    ]
  }]
}

export const total_option = {
  tooltip: {
    trigger: 'none'
  },
  legend: {
    show: false,
    top: '5%',
    left: 'center'
  },
  series: [{
    name: 'Access From',
    type: 'pie',
    radius: ['30%', '65%'],
    avoidLabelOverlap: false,
    hoverAnimation: false,
    startAngle: 20,
    label: {
      normal: {
        fontSize: 8,
        color: '#FFFFFF',
        formatter: function (params) {
          var label = `${params.name}: ${params.value}`
          // if(params.name==='已安装agent主机总数'){
          // return label = `${label.slice(0, 8)}\n${label.slice(8, 12)}: ${params.value}`
          // }else
          return label
        }
      }
    },
    labelLine: {
      normal: {
        show: false,
        length: 1,
        length2: 1
      }
    },
    itemStyle: {
      normal: {
        borderWidth: 4, // 设置border的宽度有多大
        borderColor: '#0C233A'
      }
    },
    emphasis: {
      label: {
        show: false,
        fontSize: 20,
        fontWeight: 'bold'
      }
    },
    data: [{
      value: 1026, // serverNum
      name: '已安装agent主机总数',
      itemStyle: {
        normal: {
          color: '#3CA6FF'
        },
        emphasis: {
          color: '#3CA6FF'
        }
      }
    },
    {
      value: 1241, // serverNum
      name: '主机总数',
      itemStyle: {
        normal: {
          color: '#FFA044'
        },
        emphasis: {
          color: '#FFA044'
        }
      }
    }
    ]
  }]
}
export const lines_option_month = {
  grid: {
    left: '40',
    right: '1',
    top: '40',
    bottom: '0',
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    triggerOn: 'click',
    backgroundColor: '#18629A',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    type: '',
    data: [],
    boundaryGap: false,
    splitLine: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3B6F9F' // x轴轴线颜色
      }
    },
    axisLabel: {
      showMaxLabel: true,
      color: '#81BAE5',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    tooltip: {
      trigger: 'item'
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3B6F9F' // y轴轴线颜色
      },
      axisLabel: {
        color: '#81BAE5'
      }
    },
    axisLabel: {
      showMaxLabel: true,
      color: '#81BAE5',
      rotate: 30
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: 'dashed', // 虚线
        color: ['#3B6F9F']
      },
      show: true // 隐藏
    }
  },
  series: [{
    name: '修复率',
    type: 'line',
    data: [],
    itemStyle: {
      normal: {
        color: '#3CA6FF'
      }
    },
    showSymbol: false
  }]
}
