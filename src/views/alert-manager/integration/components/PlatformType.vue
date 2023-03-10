<template>
  <div style="margin-top: 20px;width: inherit">
    <div style="width: 500px">
      <span style="width: 10px;margin-left: 20px">
        <div style="background-color: #5b8ff9; width: 5px; height: 16px;display: inline-block;margin-bottom: -3px"></div>
      </span>
      <span :style="{width:title.length * 15 + 16 + 'px'}"><div style="display: inline-block;margin-left: 10px">{{ titleMap[title] }}</div></span>
      <span style=""><a-icon type="plus-square" style="font-size: 18px;margin-top: 15px;margin-left: 15px" @click="openModal()"/></span>
      <a-modal
        title="新建接入平台"
        :visible="visible"
        :confirm-loading="confirmLoading"
        width="1000px"
        @ok="handleOk"
        @cancel="closeModal"
      >
        <a-form-model ref="ruleForm" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item
            label="接入平台标识"
            :rules="[{ required: true, message: '请上传图片！', trigger: 'change' }]"
            prop="file">
            <a-input style="width: 80%" v-model="formState.file" disabled/>
            <a-upload :file-list="fileList" @change="handleUploadChange" :before-upload="()=>false" :remove="handleRemove" ><a-button style="margin-left:5px "> <a-icon type="upload"/>上传</a-button></a-upload>
          </a-form-model-item>
          <a-form-model-item
            label="接入平台名称"
            :rules="[{ required: true, message: '请输入接入平台名称！', trigger: 'change' }]"
            prop="name">
            <a-input v-model="formState.name" />
          </a-form-model-item>
          <a-form-model-item label="接入平台描述">
            <a-textarea v-model="formState.remark" />
          </a-form-model-item>
          <a-form-model-item
            label="监控级别对应关系"
            :rules="[{ required: true, validator: relationPass, trigger: 'change' }]"
            prop="levelRelation">
            <a-table
              :columns="mappingColumns"
              :data-source="formState.levelRelation"
              :pagination="false"
              bordered
              :row-key="(record)=>record.key">
              <template
                v-for="col in ['P1', 'P2']"
                :slot="col"
                slot-scope="text,record"
              >
                <div :key="col">
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => handleChange(e.target.value, record.key, col)"
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record,index">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="save(record.key)">保存</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定取消吗?" @confirm="() => cancel(record.key)">
                      <a>取消</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="() => edit(record.key)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="() => removeOne(index)">删除</a>
                  </span>
                </div>
              </template>
            </a-table>
            <center><a-button @click="()=>addRecord()"><a-icon type="plus"/></a-button></center>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <div
      :style="{
        width: title.length * 15 + 50 + 'px',
        marginLeft: '20px'
      }"
    >
      <a-divider />
    </div>
    <div>
      <div
        style="display: inline-block"
        v-for="child in children"
        :key="child"
      >
        <div style="margin: 20px"><PlatformImg :svg-name="child.name" :id="child.id" :img="child.url" :alert-source-count="0" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import PlatformImg from './PlatformImg.vue'
import _ from 'lodash'
import { alarm } from '@/utils/request'

const original = {
  file: '',
  name: '',
  remark: '',
  levelRelation: []
}
export default {
  name: 'PlatformType',
  components: { PlatformImg },
  props: {
    title: {
      type: String,
      default: 'this is a title'
    },
    children: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      formState: _.cloneDeep(original),
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      fileList: [],
      titleMap: {
        '1': '基础资源监控',
        '2': '应用性能监控',
        '3': '机房监控',
        '4': '网络性能监控'
      }
    }
  },
  methods: {
    relationPass (rule, value, callback) {
      let flag = value.length < 1
      value.forEach(va => {
        if (flag) {
          return false
        }
        flag = va.P1 === '' || va.P2 === ''
      })
      if (flag) {
        callback(new Error('请检查您填写的监控级别对应关系！'))
      } else {
        callback()
      }
    },
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    handleUploadChange (file) {
      this.formState.file = file.file.name
      this.fileList[0] = file.file
    },
    openModal () {
      this.visible = true
    },
    closeModal () {
      this.visible = false
      this.fileList = []
      this.formState = _.cloneDeep(original)
      this.$router.push('platform')
    },
    addRecord () {
      this.formState.levelRelation.push(
        {
          P1: '等级',
          P2: '值',
          key: (Math.random() * this.formState.levelRelation.length + 1).toString()
        }
      )
      this.$forceUpdate()
    },
    removeOne (index) {
      // console.log(this.editingKey)
      if (this.editingKey !== '' && this.editingKey) {
        return
      }
      // console.log('prv', this.formState.levelRelation)
      this.formState.levelRelation.splice(index, 1)
      // console.log('suf', this.formState.levelRelation)
      this.$forceUpdate()
    },
    async handleOk () {
      let flag = false
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.error('请检查您的表单项是否都填写完毕！')
          flag = true
        }
      })
      if (flag) {
        return
      }
      this.confirmLoading = true
      const formData = new FormData()
      const relation = {}
      this.formState.levelRelation.forEach(level => {
        relation[level.P1] = level.P2
        delete level.key
      })
      formData.append('name', this.formState.name)
      formData.append('remark', this.formState.remark)
      formData.append('levelRelation', JSON.stringify(relation))
      formData.append('platType', this.title)
      formData.append('file', this.fileList[0])

      let res
      try {
        res = await alarm.post('/api/integration/platform/add', formData)
      } catch (e) {
        res = e.response.data
      } finally {
        this.confirmLoading = false
      }
      if (res.code === 200) {
        this.$message.success('新建成功！')
      } else {
        this.$message.error(res.data)
      }
      this.closeModal()
    },
    handleChange (value, key, column) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.formState.levelRelation = newData
      }
    },
    edit (key) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.formState.levelRelation = newData
      }
      this.$forceUpdate()
    },
    save (key) {
      console.log(key)
      const newData = [...this.formState.levelRelation]
      const newCacheData = [...this.cacheData]
      const target = newData.find(item => key === item.key)
      console.log('target', target)
      const targetCache = newCacheData.find(item => key === item.key)
      console.log('cache', targetCache)
      if (target && targetCache) {
        delete target.editable
        this.formState.levelRelation = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel (key) {
      const newData = [...this.formState.levelRelation]
      const target = newData.find(item => key === item.key)
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.key))
        delete target.editable
        this.formState.levelRelation = newData
      }
    }
  },
  computed: {
    cacheData () {
      return this.formState.levelRelation.map(item => ({ ...item }))
    },
    mappingColumns () {
      return [
        {
          title: this.formState.name,
          dataIndex: 'P2',
          width: '30%',
          scopedSlots: { customRender: 'P2' }
        },
        {
          title: '统一监控平台',
          dataIndex: 'P1',
          width: '30%',
          scopedSlots: { customRender: 'P1' }
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  }
}
</script>

<style scoped></style>
