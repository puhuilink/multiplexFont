export const option = {
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      detail: {
        formatter: '{value}%'
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      pointer: {
        show: false
      },
      progress: {
        show: true,
        width: 30,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'red' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue' // 100% 处的颜色
              }
            ],
            globalCoord: false // 缺省为 false
          }
        }
      },
      title: {
        show: false
      },
      data: [
        {
          value: 50,
          name: 'SCORE'
        }
      ]
    }
  ]
}
