<template>
  <a-modal
    v-if="visible"
    v-show="visible"
    centered
    :title="title"
    :width="720"
    wrapClassName="QuotaSchema__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-form-model
      ref="form"
      :model="formModel"
      :rules="rules"
      layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="单位名称"
            v-bind="formItemLayout"
            prop="name"
          >
            <a-input
              :disabled="title === '查看'"
              v-model="formModel.name"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="城市名称"
            v-bind="formItemLayout"
            prop="city"
          >
            <a-input
              :disabled="title === '查看'"
              v-model="formModel.city"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="地址"
            v-bind="formItemLayout"
            prop="address"
          >
            <a-input
              :disabled="title === '查看'"
              v-model="formModel.address"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="纬度"
            v-bind="formItemLayout"
            prop="lat"
          >
            <a-input
              :disabled="title === '查看'"
              v-model="formModel.lat"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="经度"
            v-bind="formItemLayout"
            prop="lng"
          >
            <a-input
              :disabled="title === '查看'"
              v-model="formModel.lng"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-model-item
            label="启用"
            v-bind="formItemLayout"
            prop="enabled"
          >
            <a-select
              :disabled="title === '查看'"
              v-model="formModel.enabled"
            >
              <a-select-option :value="'true'">启用</a-select-option>
              <a-select-option :value="'false'">关闭</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col>
          <a-form-model-item
            label="关系"
            v-bind="formItemLayout"
            prop="relation"
          >
            <!--            <a-cascader-->
            <!--              :disabled="title === '查看'"-->
            <!--              :options="relation"-->
            <!--              v-model="formModel.relation"-->
            <!--              multiple-->
            <!--            >-->
            <!--            </a-cascader>-->
            <a-select mode="multiple" v-model="formModel.relation">
              <a-select-opt-group
                v-for="(item) in relation"
                :key="item.value">
                <span>{{ item.label }}</span>
                <a-select-option
                  v-for="opt in item.children"
                  :value="`${item.value}/${opt.value}`"
                  :key="opt.value"
                >
                  {{ item.label + '---' + opt.label }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import Schema from '~~~/Mixins/Modal/Schema'
import _ from 'lodash'
import { dataDomain } from '~~~/Common'
import { axios } from '@/utils/request'

export default {
  name: 'UnitSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: (vm) => ({
    relation: [],
    formModel: {},
    rules: {
      name: [
        {
          required: true,
          message: '单位名称必填'
        },
        {
          max: 20,
          message: '最多输入20个字符'
        }
      ],
      city: [
        // {
        //   pattern: /^[\\Sa-zA-Z\u4e00-\u9fa5]+$/,
        //   message: '仅支持拼音与中文'
        // },
        {
          required: true,
          message: '城市名称必填'
        },
        {
          max: 20,
          message: '最多输入20个字符'
        }
      ],
      address: [
        // {
        //   pattern: /^[\\Sa-zA-Z\u4e00-\u9fa5]+$/,
        //   message: '仅支持拼音数字与中文'
        // },
        {
          max: 20,
          message: '最多输入20个字符'
        }
      ],
      lat: [
        {
          required: true,
          message: '纬度必填'
        }
      ],
      lng: [
        {
          required: true,
          message: '经度必填'
        }
      ],
      enabled: [
        {
          required: true,
          message: '启用必填'
        }
      ],
      relation: [{
        required: true,
        message: '关系必填'
      }]
    },
    options: {
      flag: [
        {
          name: '有效',
          value: 1
        },
        {
          name: '无效',
          value: 0
        }
      ],
      domain: dataDomain
    },
    record: null,
    submit: () => {
    }
  }),
  computed: {
    relationList: function () {
      const arr = Object.getOwnPropertyNames(this.relation)
      arr.splice(arr.length - 1, 1)
      return arr
    }
  },
  methods: {
    handleChange (value) {
    },
    /**
     * 获取可以对接的系统Key
     */
    async fillRelation () {
      const { data } = await axios.post('/corp/system')
      const tree = []
      _.forOwn(data, (value, key) => {
        tree.push({
          label: key.split('_')[0],
          value: key,
          children: value.map(el => _.mapKeys(el, (_, key) => {
            if (key === 'id') {
              return 'value'
            } else {
              return 'label'
            }
          }))
        })
      })
      this.relation = tree
    },
    /**
     * 打开新增窗口
     */
    add () {
      this.submit = this.insert
      this.show('新增')
      this.formModel = {}
    },
    /**
     * 打开编辑窗口
     */
    async edit (record) {
      this.record = { ...record }
      this.submit = this.update
      this.show('编辑')
      await this.$nextTick()
      this.formModel = this.record
    },
    zipObject (value) {
      const odd = []
      const even = []
      value.map((data, index) => {
        if (index / 2 === 0) {
          odd.push(data)
        } else {
          even.push(data)
        }
      })
      return _.zipObject(odd, even)
    },
    dealRelation (value) {
      const obj = {}
      value.map(el => Object.assign(obj, this.zipObject(el.split('/'))))
      return obj
    },
    /**
     * 调取新增接口
     */
    async insert () {
      this.$refs.form.validate(async (error, value) => {
        if (!error) return
        try {
          const values = _.cloneDeep(this.formModel)
          values.relation = this.dealRelation(values.relation)
          this.confirmLoading = true
          await axios.post('/corp/add', values)
          this.$emit('addSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    /**
     * 调取编辑接口
     */
    async update () {
      this.$refs.form.validate(async (error, value) => {
        if (!error) return
        try {
          const values = _.cloneDeep(this.formModel)
          values.relation = this.dealRelation(values.relation)
          this.confirmLoading = true
          await axios.post('/corp/update', values)
          this.$emit('editSuccess')
          this.$notifyAddSuccess()
          this.cancel()
        } catch (e) {
          this.$notifyError(e)
          throw e
        } finally {
          this.confirmLoading = false
        }
      })
    },
    cancel () {
      this.visible = false
      this.formModel = {}
      this.$emit('close', _.get(this.record, 'state'))
    }
  },
  async created () {
    await this.fillRelation()
  }
}
</script>

<style scoped>

</style>
