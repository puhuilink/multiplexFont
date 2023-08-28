<template>
  <div class="topbigBox">
    <!-- 下拉 -->
    <div style="margin-left: 37px">
      <a-select
        show-search
        placeholder="请选择组织单位"
        option-filter-prop="children"
        style="width: 300px"
        :filter-option="filterOption"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
        <a-select-option :value="item.label" v-for="(item, index) in list" :key="index">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <!--  -->
    <div class="bigflexBox">
      <div class="EacherLeft">
        <div class="TextEacherbox1">综合风险趋势</div>
        <div ref="eacherbox1" class="eacherBox echarts"></div>
      </div>
      <div class="EacherRight">
        <div class="TextEacherbox1">未处置完成的告警</div>
        <div class="twoEacherBox">
          <div ref="eacherbox21" class="eacherBox echarts"></div>
          <div class="eacherBoxfu">
            <div class="textTime">
              <div class="textTime_1">时间范围</div>
              <!-- <div class="textTime_2">
                <div @click="openDateTimePicker('start')" class="startTimeBOX">{{ startTime }}</div>
                <div class="start_end">-</div>
                <div @click="openDateTimePicker('end')" class="endTimeBOX">{{ endTime }}</div>
              </div> -->
              <a-range-picker
                size="small"
                :disabled-date="disabledDate"
                :disabled-time="disabledRangeTime"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 330px"
              />
            </div>
            <div ref="eacherbox22" class="eacherBox echarts" id="eacherBoxid"></div>
          </div>
        </div>
      </div>
      <div class="EacherBottonLeft">
        <div class="TextEacherbox1">最近7天告警危害等级分布</div>
        <div ref="eacherbox3" class="eacherBox echarts"></div>
      </div>
      <div class="EacherBottonLeft">
        <div class="TextEacherbox1">最近7天威胁类型统计</div>
        <div ref="eacherbox4" class="eacherBox echarts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import echarts from 'echarts'
export default {
  name: 'SecondaryUnits',
  components: {
    // 'mt-datetime-picker': DatetimePicker,
  },
  data () {
    return {
      list: [
        { label: '二公局', value: 1 },
        { label: '路桥', value: 2 },
        { label: '一公局', value: 3 },
        { label: '港湾', value: 3 },
        { label: '二航局', value: 3 },
        { label: '路建', value: 3 },
        { label: '振华重工', value: 3 }
      ]
    }
  },

  mounted () {
    // if (this.list.length > 0) {
    //   this.searchValue = this.list[0].label
    // }
    this.ngsocGet()
    this.gettime()
    this.drawPolicitalStatus()
    this.drawPolicitalStatus2()
    this.drawPolicitalStatus22()
    this.drawPolicitalStatus3()
    this.drawPolicitalStatus4()

    // this.getNowTime(); //获取现在时间
  },
  watch: {},
  methods: {
    ngsocGet () {

    },
    // 下拉菜单
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur	失去焦点的时回调')
    },
    handleFocus () {
      console.log('focus获得焦点时回调')
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    // -----------------------------
    gettime () {
      // 获取当前日期
      const currentDate = new Date()

      // 获取年、月、日
      const year = currentDate.getFullYear()
      // const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      // const day = String(currentDate.getDate()).padStart(2, '0')

      // 生成日期数组
      const data = []
      for (let i = 0; i < 5; i++) {
        const date = new Date(year, currentDate.getMonth(), currentDate.getDate() - (9 - i))
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`
        data.push(formattedDate)
      }
      this.datatime = data
      // console.log(this.datatime);
    },

    drawPolicitalStatus () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.eacherbox1)
      const xLabel = this.datatime
      // 绘制图表
      myChart.setOption({
        color: ['#ff974c', '#00eaff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: 'rgb(126,199,255)'
            }
          }
        },
        legend: {
          show: false
          // top: '2%',
          // icon: 'roundRect',
          // itemWidth: 30, // 图例标记的图形宽度。
          // itemHeight: 2, //  图例标记的图形高度。
          // textStyle: {
          //   color: '#fff',
          //   fontSize: 14,
          //   padding: [0, 8, 0, 8],
          // },
        },
        grid: {
          top: '15%',
          left: '10%',
          right: '5%',
          bottom: '15%'
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              // 坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: 'rgb(41,188,245)'
              }
            },
            axisLabel: {
              // 坐标轴刻度标签的相关设置
              margin: 13.5,
              textStyle: {
                color: '#81BAE5',
                fontSize: 12
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#233653'
              }
            },
            axisTick: {
              show: false
            },
            data: xLabel
          }
        ],
        yAxis: [
          {
            name: '',
            nameTextStyle: {
              color: '#81BAE5',
              fontSize: 12,
              padding: [0, 60, 0, 0]
            },
            // minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#1160a0',
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#81BAE5',
                fonFamily: 'ArialMT',
                fontSize: 12
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#81BAE5',
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '基准情景值',
            type: 'line',

            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            lineStyle: {
              normal: {
                width: 2,
                color: '#ff974c' // 线条颜色
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  color: '#fff',
                  position: 'top', // 在上方显示
                  formatter: function (res) {
                    if (res.value) {
                      return res.value
                    } else {
                      return 0
                    }
                  }
                }
              }
            },
            symbolSize: 0, // 设定实心点的大小
            areaStyle: {
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#ff974c30'
                    },
                    {
                      offset: 0.6,
                      color: '#ff974c20'
                    },
                    {
                      offset: 1,
                      color: '#ff974c10'
                    }
                  ],
                  false
                )
              }
            },
            data: [40, 50, 70, 40, 50]
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 未处置---------------
    drawPolicitalStatus2 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart2 = echarts.init(this.$refs.eacherbox21)
      const data = [
        {
          value: 5,
          name: '危急',
          itemStyle: {
            normal: {
              color: '#DC5656'
            },
            emphasis: {
              color: '#DC5656'
            }
          }
        },
        {
          value: 21,
          name: '高危',
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
          value: 14,
          name: '中危',
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
          value: 17,
          name: '低危',
          itemStyle: {
            normal: {
              color: '#3CA6FF'
            },
            emphasis: {
              color: '#3CA6FF'
            }
          }
        }
      ]
      myChart2.setOption({
        title: {
          text: 612,
          subtext: '总数',
          left: 'center',
          top: '30%',
          textStyle: {
            color: '#000000',
            fontSize: 24,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: '400'
          },
          subtextStyle: {
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontSize: 14,
            color: '#000'
          }
        },
        tooltip: {
          // 下面的图标加文字
          show: true,
          //   trigger: 'item',
          trigger: 'none'
        },
        legend: [
          {
            left: '20%',
            bottom: '4%',
            icon: 'circle',
            itemWidth: 20,
            itemGap: 15,
            orient: 'vertical',
            textStyle: {
              fontSize: 15,
              color: 'rgba(0,0,0,0.7)'
            },
            // left: 'center',
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }

              return name + ' ' + value // 添加间距
            },
            textAlign: 'left', // 文本水平居中对齐
            data: [{ name: '低危' }, { name: '高危' }],
            width: 160
          },
          {
            left: '52%',
            bottom: '4%',
            icon: 'circle',
            itemWidth: 20,
            itemGap: 15,
            orient: 'vertical',
            textStyle: {
              fontSize: 15,
              color: 'rgba(0,0,0,0.7)'
            },
            // left: 'center',
            selectedMode: false,
            formatter: function (name) {
              let value = 0
              for (let i = 0; i < data.length; i++) {
                if (data[i].name === name) {
                  value = data[i].value
                  break
                }
              }

              return name + ' ' + value // 添加间距
            },
            textAlign: 'left', // 文本水平居中对齐
            data: [{ name: '中危' }, { name: '危急' }],
            width: 160
          }
        ],
        series: [
          // 我是圆环
          {
            type: 'pie',
            top: '0',
            botton: '20',
            center: ['50%', '40%'],
            radius: ['30%', '55%'],
            //  roseType:10,
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff'
            },
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart2.resize()
      })
    },
    // ---时间选择区间
    moment,
    range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },

    disabledDate (current) {
      // Can not select days before today and today
      return current && current >= moment().endOf('day')
    },

    disabledRangeTime (_, type) {
      if (type === 'start') {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56]
        }
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56]
      }
    },

    // 处理时间数据格式为2021.01.01 00:00:00
    timeformat (mytime) {
      const originalDate = new Date(mytime)

      const formattedDate = `${originalDate.getFullYear()}.${(originalDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${originalDate.getDate().toString().padStart(2, '0')} ${originalDate
        .getHours()
        .toString()
        .padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate
        .getSeconds()
        .toString()
        .padStart(2, '0')}`

      // console.log(formattedDate); // 输出: 2021.01.01 00:00:00

      return formattedDate
    },
    // 获取最近五天时间
    getNowTime () {
      const now = new Date()
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 通过减去相应的毫秒数来获得五天前的日期
      this.startTime = this.timeformat(fiveDaysAgo)
      this.endTime = this.timeformat(now)
    },

    // 未处置---------------
    drawPolicitalStatus22 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart22 = echarts.init(this.$refs.eacherbox22)
      const nameData = ['外部攻击告警', '横向移动告警', '资产外外连告警', '命中威胁告警', '恶意文件告警'] // 年份
      const data1Arr = [5, 70, 21, 15, 0] // 危机
      const data2Arr = [30, 70, 51, 85, 0] // 高危
      const data3Arr = [20, 90, 42, 50, 0] // 中
      const data4Arr = [20, 10, 31, 85, 0] // 低

      // var defaultData = [500, 500, 500, 500, 500, 500];

      const dataName = ['2023-7-21 9:50:00', '2023-7-22 9:50:00'] // 时间区间
      /* 整合 */
      const dataList = [data1Arr, data2Arr, data3Arr, data4Arr]
      const colorList = ['#DC5656', '#FFA044', '#EAE174', '#3CA6FF']
      const seriesList = []
      // dataName.map((item, index) => {    });

      for (let index = 0; index < nameData.length; index++) {
        seriesList.push({
          name: dataName[0] + '-' + dataName[1],
          stack: 'bar',
          itemStyle: {
            normal: {
              color: colorList[index]
            },
            emphasis: {
              color: colorList[index]
            }
          },

          type: 'bar',
          barWidth: '12', // 柱型宽度
          data: dataList[index],
          emphasis: {
            focus: 'series'
          },
          showBackground: true,
          backgroundStyle: {
            color: '#f1f1f1'
          },
          label: {
            show: false,
            position: 'left',
            color: '#000',
            fontFamily: 'HarmonyOS Sans-Regular'
          }
        })
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(151, 30, 35, 0.1)'
            }
          },
          position: function (point, params, dom, rect, size) {
            // 提示框位置
            let x = 0
            let y = 0
            // 提示框定位
            if (point[0] + size.contentSize[0] < size.viewSize[0]) {
              x = point[0]
            } else if (point[0] > size.contentSize[0]) {
              x = point[0] - size.contentSize[0]
            } else {
              x = '-100%'
            }
            if (point[1] > size.contentSize[1]) {
              y = point[1] - size.contentSize[1]
            } else if (point[1] + size.contentSize[1] < size.viewSize[1]) {
              y = point[1]
            } else {
              y = '30%'
            }
            return [x, y]
          },
          textStyle: {
            color: '#fff',
            fontFamily: 'Source Han Sans CN-Regular'
          },
          extraCssText:
            'opacity: 0.8;background-color:#050F1B;padding:16px;box-shadow: 1px 6px 15px 1px rgba(0,0,0,0.13);border-radius: 4px;filter: blur(undefinedpx);border:none;'
        },

        grid: {
          left: '0',
          right: '37',
          bottom: '0%', // 下边距,
          top: '6%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
              // color: '#000000',
              // fontSize: 12,
              // fontFamily: 'HarmonyOS Sans-Regular',
            },
            splitLine: {
              show: false
              // lineStyle: {
              //   color: 'rgba(255,255,255,0.09)',
              // },
            }
          }
        ],
        yAxis: [
          {
            // 第一个个y轴显示右边的数据
            position: 'right',
            z: 3,
            type: 'category',

            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: [20, 90, 42, 50, 0],
            axisLabel: {
              inside: true,
              // align: 'right',
              // verticalAlign: 'bottom',
              padding: [0, -30, 0, 0],
              textStyle: {
                color: '#81BAE5',
                fontSize: '12',
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fonWeight: 600
              }
            }
          },
          {
            // 第二个y轴显示nameData
            z: 3,
            type: 'category',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: nameData,
            axisLabel: {
              inside: true,
              align: 'left',
              // verticalAlign: 'bottom',
              padding: [0, 0, 25, -8],
              textStyle: {
                color: '#81BAE5',
                fontSize: '12',
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fonWeight: 600
              }
            }
          }
        ],

        series: seriesList.map((item) => {
          return {
            ...item
          }
        })
      }

      const optionWithData = []
      nameData.forEach((name, index) => {
        optionWithData.push(option.series[index])
        optionWithData.push(name)
      })

      myChart22.setOption({
        backgroundColor: option.backgroundColor,
        tooltip: option.tooltip,
        // legend: option.legend,
        grid: option.grid,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        series: optionWithData
      })
      window.addEventListener('resize', function () {
        myChart22.resize()
      })
    },
    // 最近7天告警危害等级分布
    drawPolicitalStatus3 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart3 = echarts.init(this.$refs.eacherbox3)
      const data = [
        {
          value: 5,
          name: '危急',
          itemStyle: {
            normal: {
              color: '#DC5656'
            },
            emphasis: {
              color: '#DC5656'
            }
          }
        },
        {
          value: 21,
          name: '高危',
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
          value: 14,
          name: '中危',
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
          value: 17,
          name: '低危',
          itemStyle: {
            normal: {
              color: '#3CA6FF'
            },
            emphasis: {
              color: '#3CA6FF'
            }
          }
        }
      ]
      // 绘制图表
      myChart3.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // 整体图形
          left: '37',
          right: '10',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        // legend: {
        //   left: 'center',
        //   top: '5%',
        //   textStyle: {
        //     color: '#fff',
        //   },
        //   itemWidth: 15,
        //   itemHeight: 10,
        //   itemGap: 25,
        // },
        legend: {
          // 上面的点
          top: '6%',
          left: 140,
          // align: 'center', // 将图例水平居中
          // left:37,
          icon: 'circle',
          textStyle: {
            fontSize: 12, // 字体大小
            color: '#81BAE5' // 字体颜色
          },
          itemWidth: 25,
          itemGap: 20, // 设置数据之间的间距为 10px
          selectedMode: false,
          formatter: function (name) {
            let value = 0
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                value = data[i].value
                break
              }
            }

            return name + ' ' + value // 添加间距
          },
          data: ['危急', '高危', '中危', '低危']
        },

        dataZoom: [
          {
            show: false,
            // height: 10,
            xAxisIndex: [0],
            bottom: 6,
            start: 0,
            end: 100,
            // handleIcon:
            // 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '100%',
            handleStyle: {
              color: 'rgba(255, 255, 255,0.5)'
            },
            textStyle: {
              color: '#fff',
              fontSize: 10
            },
            fillerColor: 'rgba(42, 131, 223,1)',
            borderColor: 'rgba(66, 130, 197,1)',
            backgroundColor: 'rgba(12, 67, 124,0.5)',
            showDataShadow: false,
            brushSelect: false
          },
          {
            type: 'inside',
            disabled: false
          }
        ],
        xAxis: {
          show: true,
          type: 'category',
          name: '',
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 12
          },
          inverse: false,
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '',
              width: 1
            }
          },
          axisTick: {
            show: false
            // alignWithLabel: false,
            // interval: 'auto',
            // inside: false,
            // length: 5,
            // lineStyle: {
            //   type: 'solid',
            //   width: 1,
            //   color: 'rgba(28, 158, 222, 1)',
            // },
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              width: 1,
              color: '#3B6F9F'
            }
          },
          axisLabel: {
            // x轴和下面的文字间距
            margin: 13.5,
            interval: 'auto',
            rotate: 0,
            fontSize: 12,
            color: '#81BAE5'
          },
          data: ['2023-07-13', '2023-07-14', '2023-07-15', '2023-07-16', '2023-07-17', '2023-07-18', '2023-07-19']
        },
        yAxis: [
          {
            show: true,
            type: 'value',
            name: '',
            min: 0, // y轴数据最小
            nameTextStyle: {
              color: 'rgba(255,255,255,0.7)'
            },
            axisLine: {
              // y轴样式
              show: false
              // lineStyle: {
              //   color: 'rgba(28, 158, 222, 1)',
              // },
            },
            // axisTick: {
            //   show: true,
            // },
            axisLabel: {
              // 刻度标签
              formatter: '{value}',
              rotate: 0,
              textStyle: {
                color: 'rgba(28, 158, 222, 1)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: 'rgba(0, 206, 209, 0.1)'
              }
            }
          }
        ],
        series: [
          {
            name: '危急',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#DC5656'
              }
            },
            /*  label: {
              show: true,
              rotate: 0,
              color: '#29acff',
              position: 'top',
              fontSize: 12,
            }, */
            label: {
              normal: {
                show: false
                // fontSize: 13,
                // color: '#14B6F3',
                // position: 'top',
              }
            },
            data: [40, 30, 30, 30, 40, 40, 40, 30]
          },
          {
            name: '高危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#FFA044'
              }
            },
            label: {
              // 柱子上的文字
              show: false
            },
            data: [50, 50, 50, 50, 80, 40, 50, 50]
          },
          {
            name: '中危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#EAE174'
              }
            },
            label: {
              show: false
            },
            data: [60, 70, 70, 10, 40, 40, 60, 70]
          },
          {
            name: '低危',
            type: 'bar',
            barWidth: '9px',
            barGap: 0.7, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#3CA6FF'
              }
            },
            label: {
              show: false
            },
            data: [60, 70, 70, 10, 4, 40, 60, 30]
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart3.resize()
      })
    },
    // 最近7天威胁类型统计
    drawPolicitalStatus4 () {
      // 基于准备好的dom，初始化echarts实例
      const myChart4 = echarts.init(this.$refs.eacherbox4)
      const dataList = [
        {
          value: 17,
          name: '信息泄漏',
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
          value: 14,
          name: '敏感操作',
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
          value: 5,
          name: '代码执行',
          itemStyle: {
            normal: {
              color: '#DC5656'
            },
            emphasis: {
              color: '#DC5656'
            }
          }
        },
        {
          value: 21,
          name: '远控木马',
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
          value: 21,
          name: '弱口令',
          itemStyle: {
            normal: {
              color: '#BF78C5'
            },
            emphasis: {
              color: '#BF78C5'
            }
          }
        }
      ]
      // 绘制图表
      myChart4.setOption({
        tooltip: {
          trigger: 'axis'
        },

        legend: {
          // 上面的点
          top: '6%',
          left: 100,

          icon: 'circle',
          textStyle: {
            fontSize: 12, // 字体大小
            color: '#81BAE5' // 字体颜色
          },
          itemWidth: 25,
          selectedMode: false,
          formatter: function (name) {
            let value = 0
            for (let i = 0; i < dataList.length; i++) {
              if (dataList[i].name === name) {
                value = dataList[i].value
                break
              }
            }

            return name + ' ' + value // 添加间距
          },
          data: ['信息泄漏', '敏感操作', '代码执行', '远控木马', '弱口令']
          // width: 160,
        },
        grid: {
          left: '37',
          right: '37',
          bottom: '5%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // boundaryGap: true,
          name: '',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3B6F9F'
            }
          },
          axisLabel: {
            // 文字于x轴间距
            margin: 13.5,
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },

          data: ['2023-07-13', '2023-07-14', '2023-07-15', '2023-07-16', '2023-07-17', '2023-07-18', '2023-07-19']
        },
        yAxis: {
          type: 'value',
          name: '',
          axisLabel: {
            fontFamily: 'ArialMT',
            color: '#81BAE5',
            lineHeight: 12
          },

          axisLine: {
            show: false // 关闭x轴线
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: '#f0f0f0',
              type: 'dotted'
            }
          },
          nameTextStyle: {
            show: false,
            color: 'white',
            fontSize: 12,
            fontWeight: 600
          }
        },
        series: [
          {
            name: '信息泄漏',
            type: 'line',
            data: [200, 105, 135, 120, 175, 205, 185, 195, 208, 150, 170, 180],
            smooth: true, // 平滑曲线
            itemStyle: {
              normal: {
                // #ff0066
                color: '#3CA6FF',
                borderColor: '#3CA6FF',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: null, // 实心圆,圆环emptyCircle
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: '敏感操作',
            type: 'line',
            data: [55, 135, 120, 175, 205, 185, 195, 208, 150, 170, 180, 150],
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#EAE174',
                borderColor: '#EAE174',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: '代码执行',
            type: 'line',
            data: [175, 120, 75, 205, 185, 195, 208, 150, 170, 80, 132, 80],
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#DC5656',
                borderColor: '#DC5656',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: '远控木马',
            type: 'line',
            data: [145, 80, 105, 95, 125, 95, 68, 130, 70, 80, 132, 180],
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#FFA044',
                borderColor: '#FFA044',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          },
          {
            name: '弱口令',
            type: 'line',
            data: [85, 140, 75, 105, 85, 95, 108, 50, 70, 80, 102, 80],
            smooth: true,
            itemStyle: {
              normal: {
                // #ff0066
                color: '#BF78C5',
                borderColor: '#BF78C5',
                borderWidth: 2 // 设置圆环中间空白的大小比例
              }
            },
            lineStyle: {
              // 线条的样式
              width: 4
            },
            // symbol: 'emptyCircle', // 圆环
            symbol: 'none', // 不显示连接点
            symbolSize: 8 // 根据需要设置圆环的大小
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart4.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .topbigBox {
//   // height: 660.8px;
//   // margin-top: 20px;
// }

.bigflexBox {
  width: 100%;
  // height: 612px;
  // overflow: hidden;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .TextEacherbox1 {
    // width: 88px;
    height: 18px;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #5bbbff;
    line-height: 18px;
    // padding-left: 37px;
    margin-left: 37px;
  }
  .EacherLeft {
    width: 50%;
    height: 278px;
    .eacherBox {
      height: 260px;
    }
  }
  .EacherRight {
    width: 50%;
    height: 278px;
  }
  .twoEacherBox {
    display: flex;
    width: 100%;
    // height: 260px;

    .eacherBox {
      //  flex-basis: 25%;
      width: 310px;
    }
    .eacherBoxfu {
      width: 330px;
    }
    .textTime {
      // width: 100px;
      height: 38px;
      .textTime_1 {
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #81bae5;
        line-height: 12px;
      }
      /* .textTime_2 {
        width: 288px;
        height: 22px;
        // box-sizing: border-box;
        border: 1px solid #2c5882;
        margin-top: 4px;
        display: flex;
        text-align: center;
        .startTimeBOX,
        .endTimeBOX,
        .start_end {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 22px;
        }
        .startTimeBOX {
          margin-left: 6.5px;
        }
        .start_end {
          margin: 0 8px;
        }
      } */
    }
  }
}
// .eacherBox {
//   flex-basis: 50%;
//   // height: 200px;
//   // text-align: center;
// }
#eacherBoxid {
  height: 215px;
  width: 330px;
}
.echarts {
  // height: 200px;
  width: 640px;
}
.EacherBottonLeft {
  // display: flex;
  margin-top: 20px;
  width: 50%;
  .eacherBox {
    height: 278px;
  }
}
</style>
