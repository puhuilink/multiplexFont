<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更组名称" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更组编号" prop="id">
            <a-input v-model="form.id" />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="巡更路径" prop="pathIds">
            <a-select v-model="pathIdsX" mode="multiple" placeholder="请选择巡更路径">
              <a-select-option v-for="item in pathIdsApiData" :key="item.id" :value="item.alias">
                {{ item.alias }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- <a-form-model-item label="巡更路径" prop="pathIds">
            <a-select v-model="pathIdsX" mode="default" placeholder="请选择巡更路径">
              <a-select-option v-for="item in pathIdsApiData" :key="item.id" :value="item.alias">
                <a-checkbox  :value="item.alias" slot="option">
                </a-checkbox>
                {{ item.alias }}
              </a-select-option>
            </a-select>
          </a-form-model-item> -->
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="用户" prop="userIds" >
            <a-select v-model="selectedUser" placeholder="请点击选择用户" mode="multiple">
              <a-select-option v-for="user in users" :key="user" :value="user">
                {{ user }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="有效标识" prop="isOpen">
            <!-- <a-select :isOpen="form.isOpen" />
             -->
            <a-select show-search placeholder="" @change="handleChange" key="0">
              <a-select-option value="true"> 有效 </a-select-option>
              <a-select-option value="false"> 无效</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import { UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'
import { xungeng } from '@/utils/request'
import { encrypt, decrypt } from '@/utils/aes'

export default {
  name: 'RoleSchema',
  mixins: [Schema],
  components: { AuthMenu },
  props: { selectedRowsDate: {
    type: [Object, Array, String, Number, Boolean, Function]
  } },
  data: (vm) => ({
    current: 0,
    confirmLoading: false,
    labelCol: { span: 24 },
    wrapperCol: { span: 20 },
    rules: {
      name: [{ required: true, message: '巡更组名称必填', trigger: 'blur' }],
      id: [{ required: true, message: '巡更组编号必填', trigger: 'blur' }],
      pathIds: [{ required: true, message: '巡更组路径必选', trigger: 'blur' }],
      userIds: [{ required: true, message: '巡更组用户必选', trigger: 'blur' }],
      isOpen: [{ required: true, message: '有效标识必选', trigger: 'blur' }]
    },
    form: {
      id: '',
      name: '',
      isOpen: Boolean,
      pathIds: [],
      userIds: [],
      remark: '' // 备注''
    },
    pathIdsApiData: [
      {
        id: '1', // 巡更路径ID， ID勾选作为数组给接口
        alias: '1', // 巡更路径名称， 名称展示给用户
        status: 'enabled', // 路径的状态，不需要关注
        organizeId: '1', // 路径所属组织机构，不需要关注
        creator: '徐达', // 路径创建人，不需要关注
        updateTime: '2023-07-27 01:08:21', // 路径的更新时间，不需要关注
        version: 0 // 路径的版本，不需要关注
      },
      {
        id: '1', // 巡更路径ID， ID勾选作为数组给接口
        alias: '厦门IT月巡更', // 巡更路径名称， 名称展示给用户
        status: 'enabled', // 路径的状态，不需要关注
        organizeId: '1', // 路径所属组织机构，不需要关注
        creator: '徐达', // 路径创建人，不需要关注
        updateTime: '2023-07-27 01:08:21', // 路径的更新时间，不需要关注
        version: 0 // 路径的版本，不需要关注
      }
    ],
    pathIdsX: [],
    users: '', // api获取的用户
    selectedUser: [], // 选择的用户
    remark: '',
    record: null,
    submit: () => {}
  }),
  computed: {},
  mounted () {
    this.getfindAllUser()
    this.getFindUnBindAdd()
    this.getBindPath()
    this.getBindUser()
  },
  methods: {
    handleChange (value) {
      console.log(value)
      if (value === 'true') {
        this.form.isOpen = true
      }
      if (value === 'false') {
        this.form.biaoshi = false
      }
    },
    // .新增  获取当前未绑定的路径
    async getFindUnBindAdd () {
      const data = await xungeng.get('/path/findUnBind')
      if (data.msg === '所有路线都已经被工作组使用') {
      }
      if (data.msg === 'OK') {
        this.pathIdsApiData = data.data
        console.log(data)
      }
    },
    // 2.获取当前数据权限下的所有用户
    async getfindAllUser () {
      const data = await xungeng.get('/user/findAllUser')

      console.log(data)
      this.users = (JSON.parse(decrypt(data.data))).map((user) => user.staffName)
      console.log(this.users)
    },
    // 3.新增工作组
    async getroupAdd () {
      console.log(this.form)
      const { data } = await xungeng.post('/group/add', {
        data: { ...this.form }
      })
      console.log(data)
    },
    // 5.查询工作组下面已绑定的路径（编辑使用）
    async getBindPath () {
      const id = this.form.id
      console.log('id' + id)
      const data = await xungeng.get('/group/bindPath', { params: { id: id } })
      console.log(data)
    },
    // 6.查询工作组下面已绑定的用户（编辑使用）
    async getBindUser () {
      const id = this.form.id
      const data = await xungeng.get('group/bindUser', { params: { id: id } })
      console.log(data)
    },

    reset () {
      this.$refs.ruleForm.resetFields()
    },
    // 步骤条向下逻辑
    next () {
      if (this.current === 2) {
        return
      }
      this.current++
    },
    // 步骤条向上逻辑
    prev () {
      if (this.current === 0) {
        return
      }
      this.current--
    },
    /**
     * 打开新增窗口
     */
    add () {
      this.submit = this.insert
      this.show('新增')
      this.form = {
        id: '',
        name: '',
        isOpen: Boolean,
        pathIds: [],
        userIds: [],
        remark: '' // 备注''
      }
    },
    /**
     * 打开编辑窗口
     */
    async edit (record) {
      this.record = { ...record }
      this.submit = this.update()
      this.show('编辑')
      // await this.$nextTick()
      // const keys = Object.keys(this.form.getFieldsValue())
      // this.form.setFieldsValue(_.pick(record, keys))
    },
    /**
     * 调取新增接口
     */
    async insert () {
      console.log(this.pathIdsX)
      this.form.userIds = this.selectedUser
      this.form.remark = this.remark
      this.form.pathIds = this.pathIdsX
      this.getroupAdd()
    },
    /**
     * 调取编辑接口
     */
    async update () {
      console.log('bianji')
      console.log(this.selectedRowsDate)
      this.form = { ...this.selectedRowsDate }
    }
  }
}
</script>

<style lang="less">
.steps-content {
  height: 500px;
}
</style>
