<template>
  <a-modal
    centered
    :confirmLoading="loading"
    destroyOnClose
    :title="title"
    v-model="visible"
    :width="940"
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
        >
          <a-input v-model="formData1.title" placeholder />
        </a-form-item>
        <a-form-item
          label="基线标题"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
        >
          <a-input v-model="formData1.title" placeholder />
        </a-form-item>
        <a-form-item
          label="Ci类型"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
        >
          <CiModelSelect
            :value="formData1.model"
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
            :parentNameS="formData1.model"
            :value="formData1.instance"
            @input="onInstanceInput"
          />
        </a-form-item>
        <!-- TODO: 数据库关系？ -->
        <a-form-item
          label="Kpi"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
        >
          <KpiSelect v-model="formData1.title" placeholder />
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
        >
          <BaselineStrategySelect v-model="formData2.policy" placeholder />
        </a-form-item>

        <a-form-item
          label="数值精度"
          :labelCol="layout.labelCol"
          :wrapperCol="layout.wrapperCol"
          style="width: 80%"
        >
          <a-input type="number" v-model="formData2.title" placeholder />
        </a-form-item>

        <div>
          <a-form-item
            label="周期类型（日）"
            :labelCol="layout.labelCol"
            :wrapperCol="layout.wrapperCol"
            style="width: 80%"
          >
            <a-input type="number" :min="1" v-model="formData2.title" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="isDefault"
                :value="1"
                :checked="formData2.isDefault === 1"
                @change="formData2.isDefault = 1"
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
          >
            <a-input type="number" :min="1" v-model="formData2.title" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="isDefault"
                :value="2"
                :checked="formData2.isDefault === 2"
                @change="formData2.isDefault = 2"
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
          >
            <a-input type="number" :min="1" v-model="formData2.title" placeholder />
          </a-form-item>
          <a-form-item>
            <a-form-item>
              <a-radio
                name="isDefault"
                :value="3"
                :checked="formData2.isDefault === 3"
                @change="formData2.isDefault = 3"
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
          >
            <a-input type="number" :min="1" v-model="formData2.title" placeholder />
          </a-form-item>
          <a-form-item>
            <a-radio
              name="isDefault"
              :value="4"
              :checked="formData2.isDefault === 4"
              @change="formData2.isDefault = 4"
            >是否默认</a-radio>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <!-- 第三步 -->
    <div class="BaselineDefinitionSchema__content" v-show="current === 2">
      <a-calendar />
    </div>

    <template #footer>
      <a-button v-show="current !== 0" @click="prev">上一步</a-button>
      <a-button v-show="current !== 2" @click="next">下一步</a-button>
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

const layout = {
  labelCol: {
    span: 3,
    offset: 5
  },
  wrapperCol: {
    span: 15,
    offset: 1
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
  data: (vm) => ({
    // 当前步骤
    current: 1,
    form0: vm.$form.createForm(vm),
    form1: vm.$form.createForm(vm),
    form2: vm.$form.createForm(vm),
    formData1: {
      instance: []
    },
    formData2: {
      isDefault: false
    },
    // 按钮是否 loading
    loading: false,
    layout,
    // 弹窗标题
    title: '',
    // 弹窗是否可见
    visible: false,
    // 保存指向的操作
    submit: () => { }
  }),
  computed: {},
  methods: {
    add () {
      this.visible = true
      this.title = '新建动态基线定义'
    },
    edit () {

    },
    cancel () {
      this.visible = false
    },
    onModelInput (str = '') {
      this.formData1.model = str
      // 重置选中的 Ci 实例
      this.formData1.instance = []
    },
    onInstanceInput (arr = []) {
      // FIXME: 有时候抛出的 arr 是字符串？
      this.formData1.instance = Array.isArray(arr) ? arr : []
      // TODO: 重置 kpi ？
    },
    /**
     * 下一步
     */
    next () {
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
    reset () {
      // this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
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
