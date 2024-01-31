<template>
  <a-popover placement="rightBottom" :visible="hovered" @visibleChange="handleHoverChange">
    <template slot="content">
      <h3>{{ innerTable.title }}</h3>
      <a-table
        :columns="innerTable.columns"
        :data-source="dataSource"
        :pagination="false"
        :locale="locale"
        :loading="loading"
        size="small"
      >
      </a-table>
    </template>
    <dv-charts v-if="visible" :style="{ width: width+'px', height:height+'px'}" :option="option" />
  </a-popover>
</template>

<script>

import { sql } from '@/utils/request'
import { dealQuery } from '@/utils/util'

export default {
  name: 'PercentElement',
  data () {
    return {
      elementProps: {
        styleConfig: {}
      },
      locale: {
        emptyText: <a-empty></a-empty>
      },
      dataSource: [],
      visible: false,
      loading: false,
      width: 800,
      height: 600,
      hovered: false,
      innerTable: {
        show: false,
        columns: [{ title: '', dataIndex: '' }],
        sql: '',
        title: ''
      },
      style: {
        isOneColor: false,
        lineOneColor: '#fff',
        lineGradColor: [
          '#fff', '#000'
        ]
      },
      value: 0
    }
  },
  watch: {
    'elementProps.innerTable': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.innerTable = { ...value }
        }
      }
    },
    'elementProps.data.text': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.value = value
        }
      }
    },
    'elementProps.style': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.style = { ...value }
          this.visible = false
          this.$nextTick(() => {
            this.visible = true
          })
        }
      }
    },
    'elementProps.common': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          const { grid } = value.getOption()
          this.grid = grid
          this.width = value.width
          this.height = value.height
          this.visible = false
          this.$nextTick(() => {
            this.visible = true
          })
        }
      }
    }
  },
  methods: {
    handleHoverChange (visible) {
      if (!this.innerTable.show) {
        this.hovered = false
        return
      }
      this.hovered = visible
      this.loading = visible
      if (visible && this.innerTable.sql) {
        sql(this.innerTable.sql).then(result => {
          this.dataSource = dealQuery(result)
          this.loading = false
        })
      }
    }
  },
  mounted () {
  },
  computed: {
    option () {
      const { style } = this
      return {
        style: {
          fill: 'transparent'
        },
        series: [
          {
            type: 'gauge',
            data: [
              { name: 'itemA', value: Number(this.value), gradient: style.isOneColor ? [style.lineOneColor] : style.lineGradColor }
            ],
            axisLabel: {
              show: false,
              formatter: '{value}%'
            },
            animationCurve: 'easeOutBounce',
            pointer: {
              show: false
            },
            details: {
              show: true,
              formatter: '{value}%',
              style: {
                fill: '#1ed3e5',
                fontSize: 12
              },
              valueToFixed: 2
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
