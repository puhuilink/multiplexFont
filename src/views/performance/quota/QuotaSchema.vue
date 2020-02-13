<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="980"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-form :form="form" layout="vertical">
      <a-tabs v-model="activeTabKey">
        <a-tab-pane tab="基本信息" key="1">
          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="巡检填写类型"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select
                  v-decorator="[
                    'username',
                  ]"
                >
                  <a-select-option v-for="item in []" :key="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="结果项"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="是否巡检"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username',
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="名称"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'name_s',
                    {
                      rules: [
                        {
                          required: true,
                          message: '名称必填'
                        }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="显示名称"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'label_s',
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="中文描述"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'description_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="图标"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'icon_s'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="KPI编码"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'kpicode_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="是否KPI"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'ispki_b'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="组合表达式"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'expression_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="单位"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'unit_s'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="是否数值类型"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'isnumber_b'
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="取值范围"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username',

                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="触发时间"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-date-picker
                  v-decorator="[
                    'triggertime_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="入库时间间隔"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'saveinterval_s'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="库中保留时长"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'keepperiod_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="采集频率"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'granularity_s'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="采集频率单位"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <!-- TODO: select ? 时分秒 -->
                <a-input
                  v-decorator="[
                    'granularityunit_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="计算时间差"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="所属节点类型"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'nodetype_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="KPI层级"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  type="number"
                  v-decorator="[
                    'depth_i'
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="基础KPI"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'basekpicode_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="是否聚合"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'isaggregate_s',
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="计算KPI周期"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'callkpiperiod_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="更新时间"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-date-picker v-decorator="['updatetime_t']" />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="数据权限域"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'domain_s',
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane tab="关系信息" key="2" forceRender>
          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="关联KPI"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-select
                  mode="multiple"
                  v-decorator="[
                    'gender',
                    {
                    },
                  ]"
                >
                  <a-select-option
                    v-for="item in options.kpi"
                    :key="item.value"
                    :value="item.value"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

// TODO: 每次编辑，version_s + 1
const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const query = gql`query ($rid: Int!) {
  data: ngecc_instance_values_by_pk(rid: $rid) {
    iskpi_b
    description_s
    icon_s
    kpicode_s
    expression_s
    isaggregate_s
    label_s
    isnumber_b
    name_s
    saveinterval_s
    triggertime_s
    updatetime_t
    domain_s
    nodetype_s
    description_s
    granularity_s
    depth_i
    basekpicode_s
    keepperiod_s
    granularityunit_s
    isaggregate_s
    granularityunit_s
    callkpiperiod_s
    updatetime_t
    resultitem_s
    unit_s
  }
}
`

export default {
  name: 'QuotaSchema',
  components: {},
  props: {},
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    options: {
      kpi: []
    },
    record: null,
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    add () {
      this.title = '新增'
      this.visible = true
    },
    /**
     * 编辑
     * @param {Object} record
     * @return {Promise<Undefined>}
     */
    async edit (record) {
      this.title = '编辑'
      this.visible = true
      this.record = {
        ...record
      }
      const { data } = await this.fetch(record.rid)
      await this.$nextTick()
      this.form.setFieldsValue(data)
    },
    cancel () {
      this.visible = false
    },
    fetch (rid) {
      return apollo.clients.resource.query({
        query,
        variables: {
          rid
        }
      }).then(r => r.data)
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
  .QuotaSchema {
    &__modal {
      .ant-tabs-tabpane {
        height: 615px;
        overflow-y: scroll;
      }

      .ant-calendar-picker {
        width: 100%;
      }
    }
  }
</style>
