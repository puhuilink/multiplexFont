<script>
import _ from 'lodash'
import uuid from 'uuid/v4'
import { fromEvent, merge } from 'rxjs'
import { takeWhile } from 'rxjs/operators'
import { observeOnMutation } from '@/utils/domUtil'
import { defaultListProprietaryConfig } from '@/model/config/proprietaryConfigs/ListProprietaryConfig'
import { levelColorMapping } from '~~~/Alarm/color.config'

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
    }
  },
  data: () => ({
    elementProps: {
      styleConfig: _.cloneDeep(defaultListProprietaryConfig),
      columns: [],
      dataSource: []
    },
    isSubscribed: true,
    scroll: {
      x: false,
      y: '100%'
    }
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
              'fontSize': '10px',
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
    align () {
      const { elementProps } = this
      return elementProps.styleConfig.align
    },
    columns () {
      const { align } = this
      return [{
        title: '告警级别',
        dataIndex: 'alarm_level',
        width: '10%',
        align,
        show: true,
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
                color: levelColorMapping.get(Number(alarmLevel)),
                fontSize: '20px'
              }}
              type="flag"
              theme="filled"
            /> : <svg t="1629272702868" className="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="1114" width="20" height="20"
              data-spm-anchor-id="a313x.7781069.0.i4">
              <path
                d="M881.387 297.813c38.08 65.387 57.28 136.747 57.28 214.187s-19.094 148.8-57.28 214.187c-38.187 65.28-89.92 117.12-155.2 155.2S589.44 938.667 512 938.667s-148.8-19.094-214.187-57.28c-65.28-38.08-117.013-89.814-155.306-155.307C104.427 660.8 85.333 589.44 85.333 512c0-77.333 19.094-148.693 57.28-214.187 38.08-65.28 89.814-117.013 155.307-155.306C363.2 104.533 434.56 85.333 512 85.333c77.333 0 148.693 19.094 214.187 57.28 65.28 38.187 117.013 89.92 155.2 155.2z m-217.707-47.36C617.387 223.467 566.827 209.92 512 209.92s-105.387 13.547-151.68 40.533-82.987 63.68-109.973 109.974c-26.987 46.293-40.534 96.853-40.534 151.68s13.547 105.386 40.534 151.68c26.986 46.293 63.68 82.986 109.973 109.973 46.293 26.987 96.853 40.533 151.68 40.533s105.387-13.546 151.68-40.533c46.293-26.987 82.987-63.68 109.973-109.973 26.987-46.294 40.534-96.854 40.534-151.68s-13.547-105.387-40.534-151.68c-27.093-46.294-63.786-82.987-109.973-109.974z"
                p-id="1115" fill={`${levelColorMapping.get(Number(alarmLevel))}`}></path>
            </svg>}
          </div>

        )
      },
      {
        title: '告警类型',
        dataIndex: `alarm_type`,
        width: '15%',
        align,
        show: true,
        ellipsis: true
      },
      {
        title: '告警详细信息',
        dataIndex: 'detail',
        width: '65%',
        show: true,
        align
      }]
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
    // 实时计算 scroll
    calScroll () {
      this.$table = this.$table || this.$el.getElementsByClassName('ant-table')[0]
      this.$thead = this.$thead || this.$el.getElementsByClassName('ant-table-thead')[0]
      const { height: elHeight } = window.getComputedStyle(this.$el)
      const { height: thHeight } = window.getComputedStyle(this.$thead)

      const elH = Number(elHeight.split('px')[0])
      const thH = Number(thHeight.split('px')[0])

      Object.assign(this.scroll, { y: elH - thH })
    },
    customRow (record, index) {
      const { backgroundColor = {}, ...rest } = this.rowStyle
      return {
        style: {
          backgroundColor: index % 2 === 0 ? backgroundColor.odd : backgroundColor.even,
          ...rest
        }
      }
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
