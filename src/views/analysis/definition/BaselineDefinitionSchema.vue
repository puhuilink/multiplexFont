<template>
  <a-modal
    centered
    :confirmLoading="loading"
    destroyOnClose
    :maskClosable="false"
    :title="title"
    v-model="visible"
    :width="1024"
    wrapClassName="BaselineDefinitionSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-steps :current="current">
      <a-step title="选择动态指标"></a-step>
      <a-step title="选择计算策略" />
      <a-step title="选择日期策略" />
    </a-steps>

    <!-- 第一步 -->
    <div class="BaselineDefinitionSchema__content" v-show="current === 0">
      <a-form :form="form0" layout="inline">
        <a-form-item
          label="计算方式"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <a-select
            v-model="formData0.gen_type"
          >
            <a-select-option
              v-for="item in options.types"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="基线标题"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <a-input v-model="formData0.title" placeholder />
        </a-form-item>
        <a-form-item
          label="Ci类型"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <CiModelSelect
            :value="formData0.model"
            @input="onModelInput"
          />
        </a-form-item>
        <a-form-item
          label="Ci实例"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
        >
          <CiInstanceSelect
            multiple
            :parentNameS="formData0.model"
            :value="formData0.ci"
            @input="onInstanceInput"
          />
        </a-form-item>
        <!-- TODO: 数据库关系？ -->
        <a-form-item
          label="Kpi"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <KpiSelect
            multiple
            v-model="formData0.kpi"
            :nodetypeS="formData0.model"
            placeholder />
        </a-form-item>
      </a-form>
    </div>

    <!-- 第二步 -->
    <div class="BaselineDefinitionSchema__content" v-show="current === 1">
      <a-form :form="form2" layout="inline">
        <a-form-item
          label="计算策略"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <BaselineStrategySelect v-model="formData1.uuid_policy" placeholder />
        </a-form-item>

        <a-form-item
          label="数值精度"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
          required
        >
          <a-input-number
            v-bind="numberProps"
            v-model="formData1.round_num"
            placeholder />
        </a-form-item>

        <div>
          <a-form-item
            label="周期类型（日）"
            :labelCol="layout.labelCol"
            :wrapperCol="layout.wrapperCol"
            style="width: 80%"
            required
          >
            <a-input-number v-bind="numberProps" v-model.number="formData1.cycle_day_num" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="cycle_default_type"
                :value="'cycle_day_num'"
                :checked="formData1.cycle_default_type === 'Day'"
                @change="formData1.cycle_default_type = 'Day'"
              >是否默认</a-radio>
            </a-form-item>
          </a-form-item>
        </div>

        <div>
          <a-form-item
            label="周期类型（周）"
            :labelCol="layout.labelCol"
            :wrapperCol="layout.wrapperCol"
            style="width: 80%"
            required
          >
            <a-input-number v-bind="numberProps" v-model.number="formData1.cycle_week_num" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="cycle_default_type"
                :value="'cycle_week_num'"
                :checked="formData1.cycle_default_type === 'Week'"
                @change="formData1.cycle_default_type = 'Week'"
              >是否默认</a-radio>
            </a-form-item>
          </a-form-item>
        </div>

        <div>
          <a-form-item
            label="周期类型（月）"
            :labelCol="layout.labelCol"
            :wrapperCol="layout.wrapperCol"
            style="width: 80%"
            required
          >
            <a-input-number v-bind="numberProps" v-model.number="formData1.cycle_month_num" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="cycle_default_type"
                :value="'cycle_month_num'"
                :checked="formData1.cycle_default_type === 'Month'"
                @change="formData1.cycle_default_type = 'Month'"
              >是否默认</a-radio>
            </a-form-item>
          </a-form-item>
        </div>

        <div>
          <a-form-item
            label="周期类型（年）"
            :labelCol="layout.labelCol"
            :wrapperCol="layout.wrapperCol"
            style="width: 80%"
            required
          >
            <a-input-number v-bind="numberProps" v-model.number="formData1.cycle_year_num" placeholder />
          </a-form-item>
          <a-form-item>
            <a-radio
              name="cycle_default_type"
              value="cycle_year_num"
              :checked="formData1.cycle_default_type === 'Year'"
              @change="formData1.cycle_default_type = 'Year'"
            >是否默认</a-radio>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <!-- 第三步 -->
    <div class="BaselineDefinitionSchema__content" v-show="current === 2">
      <a-calendar @panelChange="panelChange" @select="panelChange">
        <template slot="dateCellRender" slot-scope="value" v-if="calenderItem(value)">
          <a-select
            :value="calenderItem(value).cycle_info"
            :key="`${calenderItem(value).calendar}`"
            style="width: 100%"
            @change="e => setCalendarDate(e, calenderItem(value))"
          >
            <a-select-option
              v-for="(option, idx) in calenderItemOptionList"
              :key="`${calenderItem(value).calendar}/${idx}/${option.name}`"
            >
              {{ option.name }}
            </a-select-option>
          </a-select>
        </template>
      </a-calendar>
    </div>

    <template #footer>
      <a-button v-show="current !== 0" @click="prev">上一步</a-button>
      <a-button v-show="current !== 2" @click="next" :disabled="disabled">下一步</a-button>
      <a-button @click="cancel">取消</a-button>
      <a-button v-show="current === 2">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  CiModelSelect,
  CiInstanceSelect,
  KpiSelect,
  BaselineStrategySelect
} from '@/components/Common'
import { getBaselintCalendar } from '@/api/controller/BaselineCalendar'
import _ from 'lodash'

const TYPES = [
  {
    label: '按Ci实例计算',
    value: 'standalone'
  },
  {
    label: '按Ci类型计算',
    value: 'converged'
  }
]

const layout = {
  labelCol: {
    span: 4,
    offset: 5
  },
  wrapperCol: {
    span: 13,
    offset: 2
  }
}

export default {
  name: 'BaselineDefinitionSchema',
  components: {
    CiModelSelect,
    CiInstanceSelect,
    KpiSelect,
    BaselineStrategySelect
  },
  props: {},
  // TODO: 库里不光存放了 ci、kpi的值，还存放其 label 作为冗余
  // FIXME: 关联查询只差了父子代，子孙代未查出
  data: (vm) => ({
    // 当前步骤
    current: 0,
    form0: vm.$form.createForm(vm),
    form1: vm.$form.createForm(vm),
    form2: vm.$form.createForm(vm),
    formData0: {
      // 计算方式 generate type ?
      'gen_type': 'standalone',
      // 基线标题
      title: '',
      // Kpi，以逗号分隔的字符串数组
      kpi: [],
      // Ci 实例，以逗号分隔的字符串数组
      ci: [],
      // Ci 类型
      model: ''
    },
    formData1: {
      // 计算策略 id
      'uuid_policy': '',
      // 周期类型（年）
      'cycle_year_num': 3,
      // 周期类型（月）
      'cycle_month_num': 10,
      // 周期类型（周）
      'cycle_week_num': 10,
      // 周期类型（天）
      'cycle_day_num': 10,
      // 周期类型（季度）
      // FIXME: 季度当前未使用到
      // 'cycle_quarter_num': 0,
      // 默认周期类型
      'cycle_default_type': 'Week',
      // 数值精度
      'round_num': 0
    },
    formData2: [],
    // 按钮是否 loading
    loading: false,
    layout,
    options: {
      types: TYPES
    },
    record: null,
    // 弹窗标题
    title: '',
    // 弹窗是否可见
    visible: false,
    // 保存指向的操作
    submit: () => { }
  }),
  computed: {
    calenderItemOptionList: {
      get () {
        const { formData1 } = this
        /* eslint-disable camelcase */
        const {
          cycle_year_num,
          cycle_month_num,
          cycle_week_num,
          cycle_day_num
          // cycle_default_type
        } = formData1
        return [
          {
            name: `${cycle_year_num} （年）`,
            value: cycle_year_num
          },
          {
            name: `${cycle_month_num} （月）`,
            value: cycle_month_num
          },
          {
            name: `${cycle_week_num} （周）`,
            value: cycle_week_num
          },
          {
            name: `${cycle_day_num} （日）`,
            value: cycle_day_num
          }
        ]
      }
    },

    defaultOptionValue: {
      get () {
        /* eslint-disable camelcase */
        const {
          cycle_year_num,
          cycle_month_num,
          cycle_week_num,
          cycle_day_num,
          cycle_default_type
        } = this.formData1
        let value
        switch (cycle_default_type) {
          case 'Year':
            value = `${cycle_year_num} （年）`
            break
          case 'Month':
            value = `${cycle_month_num} （月）`
            break
          case 'Week':
            value = `${cycle_week_num} （周）`
            break
          case 'Day':
            value = `${cycle_day_num} （日）`
            break
          default:
            break
        }
        return value
      }
    },
    // 数字输入框默认配置
    numberProps: {
      get () {
        return {
          min: 0,
          max: 9999,
          parser: this.parseInt,
          style: {
            width: '100%'
          }
        }
      }
    },
    // 下一步是否可用
    disabled: {
      get () {
        let disabled = true
        switch (this.current) {
          case 0:
            disabled = !(
              this.formData0.gen_type &&
              this.formData0.title &&
              this.formData0.kpi.length &&
              Object.values(this.formData0.model).length
            )
            break
          case 1:
            // 存在空值时
            disabled = Object.values(this.formData1).filter(v => v === '' || v === undefined).length !== 0
            break
          case 2:
            // 最后一步没有下一步
            disabled = true
            break
          default:
            disabled = true
            break
        }
        return disabled
      }
    }
  },
  watch: {
    current: {
      immediate: true,
      async handler (current) {
        // 到第三部日期选择时，默认请求当月配置
        if (current === 2) {
          await this.fetchCalenderList()
        }
      }
    }
  },
  methods: {
    add () {
      this.visible = true
      this.title = '新建动态基线定义'
    },
    edit (record = {}) {
      this.visible = true
      this.title = '编辑动态基线定义'
      this.record = {
        ...record
      }
      // 合并第一步数据
      Object.assign(this.formData0, {
        'gen_type': record.gen_type,
        'kpi': record.kpi_code.split(',').filter(e => !!e),
        title: record.title,
        ci: record.ci_id.split(',').filter(e => !!e),
        model: record.ci_type_name
      })
      // 合并第二步数据
      Object.assign(
        this.formData1,
        _.pick(record, Object.keys(this.formData1))
      )
    },
    cancel () {
      this.visible = false
    },
    async fetchCalenderList (moment) {
      const uuid = _.get(this, 'record.uuid')
      try {
        // TODO: loading
        const list = await getBaselintCalendar(uuid, moment)
        list.forEach(el => {
          el.cycle_info = el.cycle_info || this.defaultOptionValue
        })
        this.formData2 = list
      } catch (e) {
        this.formData2 = []
      }
    },
    /**
     * 转换输入的文字为整数
     * @param {String} val
     * @return {Number}
     */
    parseInt (val) {
      const num = Number(val)
      return isNaN(num) ? 0 : num.toFixed(0)
    },
    onModelInput (str = '') {
      this.formData0.model = str
      // 重置选中的 Ci 实例
      this.formData0.ci = []
      this.formData0.kpi = []
      console.log(
        this.formData0.kpi
      )
    },
    onInstanceInput (arr = []) {
      // FIXME: 有时候抛出的 arr 是字符串？
      this.formData0.ci = Array.isArray(arr) ? arr : []
      // TODO: 重置 kpi ？
    },
    /**
     * 下一步
     */
    async next () {
      // if (this.current === 1) {
      //   this.form1.validateFields((err, value) => {
      //     if (!err) {
      //       console.log(value)
      //       this.current++
      //     }
      //   })
      // }
      this.current++
    },
    /**
     * 上一步
     */
    prev () {
      this.current--
    },
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    calenderItem (value) {
      const date = value.format('YYYY-MM-DD')
      const item = this.formData2.find(({ calendar }) => calendar === date)
      if (item) {
        // return (
        //   <a-select>
        //     <a-select-option>test</a-select-option>
        //   </a-select>
        // )
        return item
      } else {
        return ''
      }
    },
    reset () {
      // this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    setCalendarDate (event, item) {
      // select-option 的 key
      const [calendar, , value] = event.split('/')
      // item.calendar_info = value
      const targetItem = this.formData2.find(el => el.calendar === calendar)
      targetItem.cycle_info = value
      console.log(targetItem)
    },
    /**
     * 切换年份 / 月份回调
     * @param {Moment} moment 切换的 moment 实例对象
     */
    async panelChange (moment) {
      await this.fetchCalenderList(moment)
    }
  }
}
</script>

<style lang="less">
.BaselineDefinitionSchema {
  &__content {
    margin-top: 28px;
  }

  &__modal {

    .ant-fullcalendar-date {
      height: 90px !important;
    }
  }

}
</style>
