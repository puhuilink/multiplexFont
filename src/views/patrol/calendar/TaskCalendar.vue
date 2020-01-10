<template>
  <div class="task-calendar">
    <a-card :bordered="false">

      <!-- S 选择器 -->
      <div class="opration">
        <a-button type="primary">全部</a-button>
        <a-button>北京机房</a-button>
        <a-button>厦门机房</a-button>
      </div>
      <!-- E 选择器 -->

      <!-- S 执行状况分类 -->
      <div class="perform">
        <div class="status-demo" v-for="p in performStatus" :key="p.label">
          <span class="demo-dot" :style="{background:p.color}"></span>
          <span>{{ p.label }}</span>
        </div>
      </div>
      <!-- E 执行状况分类 -->

      <!-- S 巡检日历 -->
      <a-calendar
        mode="month"
      >
        <ul class="events" slot="dateCellRender" slot-scope="value">
          <li class="item" v-for="(item, index) in getListData(value)" :key="index">
            <span
              class="dot"
              :style="item.type=='a'?{backgroundColor:'#f8f9fa'}:item.type=='b'?{backgroundColor:'#007bff'}:
                item.type=='c'?{backgroundColor:'#28a745'}:item.type=='d'?{backgroundColor:'#dc3545'}:
                  item.type=='e'?{backgroundColor:'#ffc107'}:{}"
            ></span>
            <span>{{ item.time }}</span>
            <span>{{ item.performer }}</span>
            <span>{{ item.content }}</span>
          </li>
        </ul>
        <template slot="monthCellRender" slot-scope="value">
          <div v-if="getMonthData(value)" class="notes-month">
            <section>{{ getMonthData(value) }}</section>
            <span>Backlog number</span>
          </div>
        </template>
      </a-calendar>
      <!-- E 巡检日历 -->
    </a-card>
  </div>
</template>

<script>
import { getCalendar } from '@/api/patrol'

export default {
  name: 'TaskCalendar',
  components: {},
  data () {
    return {
      performStatus: [
        {
          type: 'a',
          color: '#f8f9fa',
          label: '无状态'
        },
        {
          type: 'b',
          color: '#007bff',
          label: '未执行'
        },
        {
          type: 'c',
          color: '#28a745',
          label: '执行完成'
        },
        {
          type: 'd',
          color: '#dc3545',
          label: '执行失败'
        },
        {
          type: 'e',
          color: '#ffc107',
          label: '执行完成发现异常'
        }
      ],
      taskList: []
    }
  },
  filters: {},
  async created () {
    // this.getTaskList()
    await getCalendar()
      .then(res => {
        console.log(res)
      })
  },
  methods: {
    getListData (value) {
      let listData
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'b', time: '07:30', performer: '王忠友', content: '北京日常巡检' },
            { type: 'b', time: '15:30', performer: '李明君', content: '北京日常巡检' }
          ]
          break
        case 10:
          listData = [
            { type: 'b', time: '07:30', performer: '王忠友', content: '北京日常巡检' },
            { type: 'e', time: '14:30', performer: '李明君', content: '北京日常巡检' }
          ]
          break
        case 15:
          listData = [
            { type: 'b', time: '07:30', performer: '王忠友', content: '2020年度' },
            { type: 'd', time: '14:30', performer: '李明君', content: '2020年度' }
          ]
          break
        default:
      }
      return listData || []
    },

    getMonthData (value) {
      if (value.month() === 8) {
        return 1394
      }
    }
  }
}
</script>

<style scoped lang="less">
.status-demo {
  display: inline-block;
  margin-right: 6px;

  .demo-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
}

  .events {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .events .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .notes-month {
    text-align: center;
    font-size: 28px;
  }
  .notes-month section {
    font-size: 28px;
  }
.item {
  span {
    margin-right: 2px;
  }
  .dot  {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}
</style>
