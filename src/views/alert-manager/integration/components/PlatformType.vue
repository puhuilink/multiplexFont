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
        <a-form-model :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="接入平台标识">
            <a-input style="width: 80%" v-model="formState.file" disabled/>
            <a-upload :file-list="fileList" @change="handleUploadChange" :before-upload="()=>false" :remove="handleRemove" ><a-button style="margin-left:5px "> <a-icon type="upload"/>上传</a-button></a-upload>
          </a-form-model-item>
          <a-form-model-item label="接入平台名称">
            <a-input v-model="formState.name" />
          </a-form-model-item>
          <a-form-model-item label="接入平台描述">
            <a-textarea v-model="formState.remark" />
          </a-form-model-item>
          <a-form-model-item label="监控级别对应关系">
            <a-table :columns="mappingColumns" :data-source="formState.levelRelation" bordered>
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
                    <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
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
        <div style="margin: 20px"><PlatformImg :svg-name="child.name" :img="child.url" :alert-source-count="0" /></div>
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
  levelRelation: [
    {
      P1: 'p1',
      P2: '1',
      key: Math.random().toString()
    }
  ]
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
      cacheData: _.cloneDeep(original).levelRelation.map(item => ({ ...item })),
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
          key: (Math.random() * this.formState.levelRelation.length).toString()
        }
      )
      this.$forceUpdate()
    },
    removeOne (index) {
      if (this.editingKey !== '') {
        return
      }
      this.formState.levelRelation.splice(index, 1)
      this.$forceUpdate()
    },
    async handleOk () {
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
        const r = await alarm.post('/api/integration/platform/add', formData)
        res = r
      } catch (e) {
        res = {
          code: 200,
          msg: '成功'
        }
      } finally {
        this.confirmLoading = false
      }
      if (res.code === 200) {
        this.$message.success('新建成功！')
      } else {
        this.$message.error('新建失败！请检查环境！')
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
      console.log(target)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.formState.levelRelation = newData
      }
      this.$forceUpdate()
    },
    save (key) {
      const newData = [...this.formState.levelRelation]
      const newCacheData = [...this.cacheData]
      const target = newData.find(item => key === item.key)
      console.log(target)
      const targetCache = newCacheData.find(item => key === item.key)
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
      console.log(target)
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.key))
        delete target.editable
        this.formState.levelRelation = newData
      }
    }
  },
  computed: {
    mappingColumns () {
      return [
        {
          title: '统一监控平台',
          dataIndex: 'P1',
          scopedSlots: { customRender: 'P1' }
        },
        {
          title: this.formState.name,
          dataIndex: 'P2',
          scopedSlots: { customRender: 'P2' }
        },
        {
          title: '操作',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  }
}
</script>

<style scoped></style>
