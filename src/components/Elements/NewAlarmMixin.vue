<script>
import _ from 'lodash'
import uuid from 'uuid/v4'
import { fromEvent, merge } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { observeOnMutation } from '@/utils/domUtil'
import { defaultListProprietaryConfig } from '@/model/config/proprietaryConfigs/ListProprietaryConfig'
import { newLevelColorMapping } from '~~~/Alarm/color.config'

export default {
  name: 'NewAlarmMixin',
  components: {},
  props: {
    col: {
      type: Array,
      default: () => []
    },
    propsData: {
      type: Array,
      default: () => []
    },
    isComponents: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    apiType: {
      type: String,
      default: 'sdwan'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    elementProps: {
      styleConfig: _.cloneDeep(defaultListProprietaryConfig),
      columns: [],
      dataSource: []
    },
    isSubscribed: true,
    searchText: '',
    searchInput: null,
    searchedColumn: '',
    status_list: [
      {
        text: '恢复',
        value: 'OK'
      },
      {
        text: '报警',
        value: 'PROBLEM'
      }
    ],
    status_mapping:
      {
        'OK': '恢复',
        'PROBLEM': '报警',
        'L3NETWORK': '云网络',
        'ENDPOINT': '延伸监控'
      },
    locale: { emptyText: '暂无数据' }
  }),
  watch: {
    'propsData': {
      immediate: true,
      handler (value) {
        if (value) {
          this.elementProps.styleConfig = {
            'header': {
              'backgroundColor': 'transparent',
              'color': '#7b9bc6',
              'fontSize': '12px',
              'fontWeight': 'normal'
            },
            'rows': {
              'backgroundColor': {
                'odd': '#Fbfbfc',
                'even': '#Fbfbfc'
              },
              'color': '#0b0b06',
              'fontSize': '5px',
              'fontWeight': 'lighter'
            },
            'align': 'center'
          }
          this.elementProps.dataSource = value
        }
      }
    }
  },
  computed: {
    scroll () {
      return {
        x: false,
        y: 500
      }
    },
    pagination () {
      return this.isComponents ? { pageSize: 5 } : false
    },
    align () {
      const { elementProps } = this
      return elementProps.styleConfig.align
    },
    api () {
      const { elementProps } = this
      return elementProps.api || this.apiType
    },
    columns () {
      const { align, api } = this
      switch (api) {
        case 'mv':
          return [
            {
              title: '资源名称',
              dataIndex: 'targetName',
              width: '35%',
              align,
              show: true,
              ellipsis: true,
              scopedSlots: this.isComponents ? {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
              } : false,
              onFilter: (value, record) => record.targetName
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            },
            ...this.isComponents ? [{
              title: '资源类型',
              dataIndex: 'type',
              width: '13%',
              align,
              filters: this.isComponents ? [
                {
                  text: '云网络',
                  value: 'L3NETWORK'
                },
                {
                  text: '延伸监控',
                  value: 'ENDPOINT'
                }
              ] : false,
              onFilter: (value, record) => record.type.indexOf(value) === 0,
              customRender: (value) => this.status_mapping[value]
            }] : [],
            {
              title: '告警时间',
              dataIndex: 'alarmTime',
              width: '20%',
              align,
              show: true,
              ellipsis: true,
              sorter: (a, b) => new Date(a.alarmTime).getTime() - new Date(b.alarmTime).getTime()
            },
            ...this.isComponents ? [{
              title: '持续时间(s)',
              width: '12%',
              align,
              show: this.isComponents,
              sorter: (a, b) => {
                const aTime = this.translateTimeNumber(a)
                const bTime = this.translateTimeNumber(b)
                return aTime - bTime
              },
              customRender: (value, record) => {
                let endTime = new Date(record.recoverTime).getTime()
                if (!endTime) {
                  endTime = new Date().getTime()
                }
                const result = endTime - new Date(record.alarmTime).getTime()
                return (result - result % 1000) / 1000
              }
            }] : [],
            {
              title: '恢复时间',
              dataIndex: 'recoverTime',
              width: '20%',
              align,
              show: true,
              ellipsis: true,
              sorter: (a, b) => new Date(a.recoverTime).getTime() - new Date(b.recoverTime).getTime()
            },
            {
              title: '告警详细信息',
              dataIndex: 'details',
              width: '30%',
              align,
              show: true,
              scopedSlots: this.isComponents ? {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
              } : false,
              onFilter: (value, record) => record.details
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
                if (visible) {
                  setTimeout(() => {
                    this.searchInput.focus()
                  })
                }
              }
            },
            {
              title: '告警状态',
              dataIndex: 'status',
              width: '15%',
              align,
              show: true,
              filters: this.isComponents ? this.status_list : false,
              onFilter: (value, record) => record.status === value,
              customRender: (value) => {
                const val = this.status_mapping[value]
                return (<div style={{ color: value === 'OK' ? '#8cfc4f' : 'red' }}>{val}</div>)
              }
            }
          ]
        case 'sdwan':
          return [
            {
              title: '告警级别',
              dataIndex: 'alarm_level',
              width: '10%',
              align,
              show: true,
              sorter: (a, b) => a.alarm_level - b.alarm_level,
              filters: this.isComponents ? [
                {
                  text: '紧急',
                  value: 1
                },
                {
                  text: '重要',
                  value: 2
                },
                {
                  text: '一般',
                  value: 3
                }
              ] : false,
              onFilter: (value, record) => record.alarm_level === value,
              customRender: (alarmLevel) => (
                <div
                  style={{
                    // borderColor: 'transparent',
                    color: 'rgba(0,0,0,.5)',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '5px'
                  }}
                >
                  {this.showAlarmIcon ? <a-icon
                    style={{
                      color: newLevelColorMapping.get(Number(alarmLevel)),
                      fontSize: '20px'
                    }}
                    type="flag"
                    theme="filled"
                  /> : <svg t="1629272702868" className="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1114" width="20" height="20"
                    data-spm-anchor-id="a313x.7781069.0.i4">
                    <path
                      d="M881.387 297.813c38.08 65.387 57.28 136.747 57.28 214.187s-19.094 148.8-57.28 214.187c-38.187 65.28-89.92 117.12-155.2 155.2S589.44 938.667 512 938.667s-148.8-19.094-214.187-57.28c-65.28-38.08-117.013-89.814-155.306-155.307C104.427 660.8 85.333 589.44 85.333 512c0-77.333 19.094-148.693 57.28-214.187 38.08-65.28 89.814-117.013 155.307-155.306C363.2 104.533 434.56 85.333 512 85.333c77.333 0 148.693 19.094 214.187 57.28 65.28 38.187 117.013 89.92 155.2 155.2z m-217.707-47.36C617.387 223.467 566.827 209.92 512 209.92s-105.387 13.547-151.68 40.533-82.987 63.68-109.973 109.974c-26.987 46.293-40.534 96.853-40.534 151.68s13.547 105.386 40.534 151.68c26.986 46.293 63.68 82.986 109.973 109.973 46.293 26.987 96.853 40.533 151.68 40.533s105.387-13.546 151.68-40.533c46.293-26.987 82.987-63.68 109.973-109.973 26.987-46.294 40.534-96.854 40.534-151.68s-13.547-105.387-40.534-151.68c-27.093-46.294-63.786-82.987-109.973-109.974z"
                      p-id="1115" fill={`${newLevelColorMapping.get(Number(alarmLevel))}`}></path>
                  </svg>}
                </div>
              )
            },
            {
              title: '告警状态',
              dataIndex: `status`,
              width: '10%',
              align,
              show: true,
              sorter: (a, b) => a.status.length - b.status.length,
              filters: this.isComponents ? [
                {
                  text: 'firing',
                  value: 'firing'
                },
                {
                  text: 'closed',
                  value: 'closed'
                },
                {
                  text: 'acknowledged',
                  value: 'acknowledged'
                }
              ] : false,
              onFilter: (value, record) => record.status.indexOf(value) === 0,
              ellipsis: true
            },
            {
              title: '告警对象',
              dataIndex: `target`,
              width: '10%',
              align,
              show: true,
              sorter: (a, b) => a.target.length - b.target.length,
              filters: this.isComponents ? [
                {
                  text: 'CPE',
                  value: 'CPE'
                },
                {
                  text: 'Site',
                  value: 'Site'
                },
                {
                  text: 'Policy',
                  value: 'Policy'
                },
                {
                  text: 'Subscription',
                  value: 'Subscription'
                }
              ] : false,
              onFilter: (value, record) => record.target.indexOf(value) === 0,
              ellipsis: true
            },
            {
              title: '告警类型',
              dataIndex: `alarm_type`,
              width: '15%',
              align,
              show: true,
              sorter: (a, b) => a.alarm_type.length - b.alarm_type.length,
              scopedSlots: this.isComponents ? {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
              } : false,
              onFilter: (value, record) => record.alarm_type
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
                if (visible) {
                  setTimeout(() => {
                    this.searchInput.focus()
                  })
                }
              },
              ellipsis: true
            },
            {
              title: '告警详细信息',
              dataIndex: 'detail',
              width: '35%',
              show: true,
              ellipsis: !this.isComponents,
              align,
              customRender: (text) => {
                const result = this.splitDetail(text)
                return this.isComponents ? <div>{ result }</div> : text
              },
              scopedSlots: this.isComponents ? {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
              } : false,
              onFilter: (value, record) => record.detail
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
                if (visible) {
                  setTimeout(() => {
                    this.searchInput.focus()
                  })
                }
              }
            }]
        default:
          return []
      }
    },
    dataSource () {
      const { elementProps } = this
      return this.isComponents ? this.propsData : elementProps.dataSource.map(data => Object.assign({}, data, { uuid: uuid() }))
    },
    headerRowStyle () {
      const { elementProps } = this
      return elementProps.styleConfig.header
    },
    rowStyle () {
      const { elementProps } = this
      return elementProps.styleConfig.rows
    }
  },
  methods: {
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    // 实时计算 scroll
    calScroll () {
      this.$table = this.$table || this.$el.getElementsByClassName('ant-table')[0]
      this.$thead = this.$thead || this.$el.getElementsByClassName('ant-table-thead')[0]
      const { height: elHeight } = window.getComputedStyle(this.$el)
      const { height: thHeight } = window.getComputedStyle(this.$thead)

      const elH = Number(elHeight.split('px')[0])
      const thH = Number(thHeight.split('px')[0])
      const yLength = elH - elH % thH - thH

      Object.assign(this.scroll, { y: yLength })
    },
    customRow (record, index) {
      const { backgroundColor = {}, ...rest } = this.rowStyle
      return {
        style: {
          backgroundColor: index % 2 === 0 ? backgroundColor.odd : backgroundColor.even,
          ...rest,
          cursor: 'default'
        }
      }
    },
    splitDetail (text) {
      const ts = _.split(text, ',')
      const str = []
      ts.forEach(t => {
        str.push(<li>{ t }</li>)
      })
      return str
    },
    translateTimeNumber (record) {
      let endTime = new Date(record.recoverTime).getTime()
      if (!endTime) {
        endTime = new Date().getTime()
      }
      const result = endTime - new Date(record.alarmTime).getTime()
      return (result - result % 1000) / 1000
    }
  },
  mounted () {
    merge(
      fromEvent(window, 'resize'),
      // subtree必须为true，当table组件渲染、更新时也能触发
      observeOnMutation(this.$el.parentElement, { attributes: true, childList: false, subtree: true })
    )
      .pipe(
        takeWhile(() => this.isSubscribed)
      )
      .subscribe(() => {
        this.calScroll()
      })
  },
  beforeDestroy () {
    this.isSubscribed = false
  }

}
</script>

<style lang="less">
.list-element {
  height: 100%;
  overflow: hidden;

  .ant-table td { white-space: nowrap; }

  .ant-table-thead > tr > th {
    color:inherit !important;
    font-weight: inherit !important;
    background-color: inherit !important;
  }

  .ant-table-header {
    background-color: transparent;
    overflow: hidden !important;
  }

  .ant-table-scroll {
    .ant-table-body {
      // 隐藏右侧滚动条
      width: calc(100% + 10px);
    }
  }
}
tr > th {
  color:inherit !important;
  font-weight: inherit !important;
}
</style>
