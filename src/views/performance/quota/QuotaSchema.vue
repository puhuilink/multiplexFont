<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    @afterClose="reset"
    okText="保存"
    cancelText="取消"
  >
    <a-form :form="form" layout="vertical">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1">
          <a-row>
            <a-col :md="12" :span="24">
              <a-form-item
                label="巡检填写类型"
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
                label="名称"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username',
                    { rules: [{ required: true, message: '名称必填' }] },
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :md="12" :span="24">
              <a-form-item
                label="显示名称"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'username',
                    { rules: [{ required: true, message: '名称必填' }] },
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
                    'username'
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
                    'username',

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
                    'username',
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
                    'username',

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
                    'username',
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
                    'username',

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
                    'username',
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
                    'username',

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
                    'username',
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
                    'username',
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
                    'username',

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
                    'username',
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
                    'username',

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
                label="计算时间差"
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
                label="所属节点类型"
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
                label="KPI层级"
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
                label="基础KPI"
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
                label="是否聚合"
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
                label="计算KPI周期"
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
                label="更新时间"
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-date-picker v-decorator="['time-picker']" />
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
                    'username',
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
const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'QuotaSchema',
  components: {},
  props: {},
  data: (vm) => ({
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
     * @return {Undefined}
     */
    edit (record) {
      this.title = '编辑'
      this.visible = true
      this.record = {
        ...record
      }
    },
    cancel () {
      this.visible = false
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
      .ant-modal-body {
        /*height: 700px;*/
        /*overflow-y: hidden;*/
      }
      .ant-tabs-tabpane {
        height: 615px;
        overflow-y: scroll;
        /*overflow-x: hidden;*/
      }

      .ant-calendar-picker {
        width: 100%;
      }
    }
  }
</style>
