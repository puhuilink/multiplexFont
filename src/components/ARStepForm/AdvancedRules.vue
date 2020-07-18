/*
 * 规则高级设置
 */

<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="节点过滤"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'nodeFilter',
            {initialValue: record.nodeFilter}
          ]"
          placeholder="请选择"
          @change="nodeFilterChange"
        >
          <a-select-option value="checkall" key="checkall" >全选</a-select-option>
          <a-select-opt-group
            v-for="(group,index) in queryList.nodeList"
            :key="index"
            :label="group[0].parentname_s"
            :allowClear="true"
          >
            <template v-for="(groupitem,indexs) in group">
              <a-select-option :value="groupitem.name_s" :key="indexs">{{ groupitem.label_s }}</a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="采集系统"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'agentIdFilter',
            {initialValue: record.agentIdFilter}
          ]"
          placeholder="请选择采集系统"
          @change="agentChange"
        >
          <a-select-option value="checkall" key="checkall" >全选</a-select-option>
          <a-select-opt-group
            v-for="(group,index) in queryList.agentList"
            :key="index"
            :label="group[0].parentname_s"
            :allowClear="true"
          >
            <template v-for="(groupitem,indexs) in group">
              <a-select-option :value="groupitem.name_s" :key="indexs">{{ groupitem.label_s }}</a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="告警时间过滤"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="[
            'timeRangeType',
            {
              initialValue: record.timeRangeType
            }
          ]"
          @change="timeRangeTypeChange"
        >
          <a-radio value="-1">任意</a-radio>
          <a-radio value="0">绝对</a-radio>
          <a-radio value="1">相对</a-radio>
          <a-radio value="2">重复</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="重复机制"
        v-show="timeRangeType==='2'"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          v-decorator="[
            'timeRangeTypeEd2',
            {
              initialValue: record.timeRangeTypeEd2
            }
          ]"
        >
          <a-select-option
            v-for="item in rangeTypeList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-show="timeRangeType==='1'"
        label="相对时间范围"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-decorator="[
          '',
          {
            initialValue: [record.timeFromStr, record.timeToStr]
          }
        ]"
      >
        <a-input style="width:50%" addonAfter="至" :defaultValue="record.timeFrom" />
        <a-input style="width:50%" addonAfter="秒" :defaultValue="record.timeTo" />
      </a-form-item>
      <a-form-item
        v-show="timeRangeType==='0' || timeRangeType==='2'"
        label="时间范围"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-range-picker
          allowClear
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['Min Date', 'Max Date']"
          :showTime="{ format: 'HH:mm:ss' }"
          style="width: 100%"
          @ok="timeOk"
        />
      </a-form-item>
      <a-form-item
        label="内容关键词"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :style="{width: 'calc(100% - 100px)'}"
          v-decorator="[
            'messageFilter',
            {
              initialValue: record.messageFilter
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        label="此规则为例外"
        v-if="ruleType==='alert-filter' || ruleType==='alert-merge'"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['accept', {
            initialValue: record.accept
          }]"
        >
          <a-radio value="true">是</a-radio>
          <a-radio value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'
import queryList from '@/api/controller/AlarmqQueryList'

export default {
  name: 'AdvancedRules',
  props: {
    record: {
      type: Object,
      default: () => ({})
    },
    nodeType: {
      type: String,
      default: ''
    },
    ruleType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      screening,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      timer: 0,
      queryList: {},
      timeRangeType: this.record.timeRangeType,
      rangeTypeList: [
        {
          value: '2',
          label: '每天'
        },
        {
          value: '3',
          label: '每周'
        },
        {
          value: '4',
          label: '每月'
        },
        {
          value: '5',
          label: '每年'
        }
      ],
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.getQueryList()
  },
  watch: {
    nodeType (val) {
      console.log(val)
    }
  },
  methods: {
    async getQueryList () {
      this.queryList.agentList = await queryList.agentList()
      this.queryList.nodeList = await queryList.nodeList(this.nodeType)
    },
    /**
     * 节点过滤改变 筛选是否全选
     */
    nodeFilterChange (value) {
      this.queryParam.nodeFilter = screening.checkAll(value, this.queryList.CIInstance)
    },
    /**
     * 采集系统下拉改变
     */
    agentChange (value) {
      this.queryParam.agentIdFilter = screening.checkAll(value, this.queryList.agentList)
    },
    /**
     * 选中时间但还未确定，或取消时间
     * @param {Array<Moment>} e
     */
    // timeChange (e) {
    //   // 执行了 clear 操作
    //   if (!e.length) {
    //     delete (this.queryParam.send_time)
    //   }
    // },
    /**
     * 选中时间并确定
     * @param {Array<Moment>} e
     */
    timeOk (e) {
      const [startTime, endTime] = e
      this.startTime = startTime.format('YYYY-MM-DDTHH:mm:ss')
      this.endTime = endTime.format('YYYY-MM-DDTHH:mm:ss')
    },
    // timeCancel () {
    //   delete (this.queryParam.send_time)
    //   // TODO: allowclear 触发后
    // },
    timeRangeTypeChange (e) {
      this.timeRangeType = e.target.value
    },
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          values.timeFrom = this.startTime ? this.startTime : 0
          values.timeTo = this.endTime ? this.endTime : 0
          this.$emit('nextStep', values)
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
