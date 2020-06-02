<template>
  <div class="ThresholdColor">
    <div class="comment-template__item">
      <p class="comment-template__leading">告警规则:</p>
      <div class="comment-template__inner">
        <a-button @click="onOpen">编辑规则</a-button>
      </div>
    </div>

    <a-modal
      :afterClose="afterClose"
      title="编辑规则"
      :visible="visible"
      :width="width"
      @ok="onSubmit"
      @cancel="onCancel"
    >

      <a-table
        ref="table"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
      ></a-table>
      <!-- FIXME: 传入 scroll 会导致 ColorPicker 选择时撑开表格高度 -->
      <!-- :scroll="scroll" -->

      <template slot="footer">
        <p class="text-left">注：多条规则同时生效时，以最后一条规则为准；无规则生效时展示默认颜色</p>
        <p class="text-right">
          <a-button @click="onAppendRule">新增</a-button>
          <a-button @click="onCancel">取消</a-button>
          <a-button @click="onSubmit" type="primary">确定</a-button>
        </p>
      </template>

    </a-modal>
  </div>
</template>

<script>
import ProprietaryMixins from '../proprietaryMixins'
import _ from 'lodash'
import ColorPicker from '@/components/ColorPicker'
import { scrollTo } from '@/utils/util'
import {
  ThresholdColorRule,
  THRESHOLD_RULE_NAME_EQUAL,
  THRESHOLD_RULE_NAME_NOT_EQUAL,
  THRESHOLD_RULE_NAME_GT,
  THRESHOLD_RULE_NAME_GTE,
  THRESHOLD_RULE_NAME_LT,
  THRESHOLD_RULE_NAME_LTE,
  THRESHOLD_RULE_NAME_TEST,
  THRESHOLD_RULE_NAME_NOT_TEST
} from '@/model/config/proprietaryConfigs/index'

const THRESHOLD_RULE_NAME_LIST = [
  THRESHOLD_RULE_NAME_EQUAL,
  THRESHOLD_RULE_NAME_NOT_EQUAL,
  THRESHOLD_RULE_NAME_GT,
  THRESHOLD_RULE_NAME_GTE,
  THRESHOLD_RULE_NAME_LT,
  THRESHOLD_RULE_NAME_LTE,
  THRESHOLD_RULE_NAME_TEST,
  THRESHOLD_RULE_NAME_NOT_TEST
]

export default {
  name: 'ThresholdColor',
  mixins: [ProprietaryMixins],
  components: {},
  props: {},
  data: () => ({
    dataSource: [],
    $scrollTable: null,
    visible: false
  }),
  computed: {
    columns () {
      const { dataSource } = this
      return [
        {
          align: 'center',
          fixed: 'left',
          title: '匹配顺序',
          width: 95,
          customRender: (text, record, idx) => idx + 1
        },
        {
          align: 'center',
          title: '规则',
          width: 180,
          dataIndex: 'ruleName',
          customRender: (ruleName, record, idx) => (
            <a-select class="fw" value={ruleName} onSelect={e => { record['ruleName'] = e }}>
              {
                ...THRESHOLD_RULE_NAME_LIST.map(ruleName => <a-select-option key={ruleName}>{ ruleName }</a-select-option>)
              }
            </a-select>
          )
        },
        {
          align: 'center',
          title: '阈值',
          width: 200,
          dataIndex: 'thresholdValue',
          customRender: (thresholdValue, record, idx) => <a-input value={thresholdValue} onChange={({ target: { value } }) => { record['thresholdValue'] = value }} />
        },
        {
          align: 'center',
          title: '颜色',
          width: 240,
          dataIndex: 'thresholdColor',
          customRender: (thresholdColor, record, idx) => <ColorPicker color={thresholdColor} onChange={e => { record['thresholdColor'] = e }} />
        },
        {
          align: 'center',
          fixed: 'right',
          width: 90,
          customRender: (text, record, idx) => <a-button type="link" onClick={() => dataSource.splice(idx, 1)}>删除</a-button>
        }
      ]
    },
    rules: {
      get () {
        return _.get(this, 'config.proprietaryConfig.thresholdColorRule.rules', [])
      },
      set (rules) {
        // this.config.proprietaryConfig.thresholdColorRule.rules = rules
        // 向前兼容
        this.config.proprietaryConfig.thresholdColorRule = new ThresholdColorRule({ rules })
      }
    },
    scroll () {
      const { scrollX: x, scrollY: y } = this
      return { x, y }
    },
    scrollX () {
      const { columns } = this
      return _.sum(columns.map(({ width }) => width))
    },
    scrollY () {
      return 300
    },
    width () {
      return this.scrollX + 60
    }
  },
  methods: {
    afterClose () {
      this.dataSource = []
    },
    onAppendRule: _.debounce(function () {
      this.dataSource.push({
        ruleName: THRESHOLD_RULE_NAME_EQUAL,
        thresholdValue: '',
        thresholdColor: 'rgba(84, 185, 228, 1)'
      })
      const { table: { $children: [child] } } = this.$refs
      const { vcTable } = child.$refs
      this.$scrollTable = this.$scrollTable || vcTable.getBodyTable()
      // https://github.com/vueComponent/ant-design-vue/blob/master/components/table/Table.jsx
      scrollTo(this.$scrollTable.scrollHeight, { getContainer: () => this.$scrollTable })
    }, 60),
    onCancel () {
      this.visible = false
    },
    onSubmit () {
      this.visible = false
      this.rules = _.cloneDeep(this.dataSource)
      this.change()
    },
    onOpen () {
      this.dataSource = _.cloneDeep(this.rules)
      this.visible = true
    }
  }
}
</script>

<style lang="less">
</style>
