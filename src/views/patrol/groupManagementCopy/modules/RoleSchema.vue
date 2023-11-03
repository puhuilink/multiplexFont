<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="787"
    wrapClassName="QuotaSchema__modal"
    :afterClose="reset"
    :key="modalKey"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="巡更组名称" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="巡更组编号" prop="id" :disabled="isDisabled">
            <a-input v-model="form.id" :disabled="isDisabled" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="巡更路径" prop="pathIds">
            <a-select mode="multiple" placeholder="请选择巡更路径" v-model="form.pathIds" @change="handlePathIdsChange">
              <!-- <a-select-option v-for="item in pathIdsApiData" :key="item.id" :value="JSON.stringify(item)" :label="item.alias"> -->
              <a-select-option v-for="item in pathIdsApiData" :key="item.id.toString()" :value="item.id.toString()">
                {{ item.alias }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="用户" prop="userIds">
            <a-select placeholder="请点击选择用户" mode="multiple" v-model="form.userIds" @change="handlePathIdsChange2">
              <!-- <a-select-option v-for="user in users" :key="user.userId" :value="JSON.stringify(user)"> -->
              <a-select-option v-for="user in users" :key="user.userId.toString()" :value="user.userId">
                {{ user.staffName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="有效标识" prop="isOpen">
            <!-- <a-select :isOpen="form.isOpen" />
             -->
            <a-select show-search placeholder="" v-model="form.isOpen" @change="handleChange">
              <a-select-option :value="1" key="1"> 有效</a-select-option>
              <a-select-option :value="0" key="2"> 无效</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item label="备注">
            <a-input v-model="form.remark" type="textarea" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <template slot="footer">
      <div class="modal-button-container">
        <a-button @click="onSubmit" type="primary" :loading="submitLoading">提交</a-button>
        <a-button @click="onCancel">取消</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { UserService } from '@/api'
import Schema from '@/components/Mixins/Modal/Schema'
import _ from 'lodash'
import AuthMenu from '~~~/Auth/AuthMenu.vue'
import { xungeng } from '@/utils/request'
import { encrypt, decrypt } from '@/utils/aes'
import { notification } from 'ant-design-vue'
import JSONBig from 'json-bigint'

export default {
  name: 'RoleSchema',
  mixins: [Schema],
  components: { AuthMenu },
  // props: { selectedRowsDate: {
  //   type: [Object, Array, String, Number, Boolean, Function]
  // } },
  data () {
    return {
      isDisabled: true, // 设置为true表示禁用
      submitLoading: false,
      modalKey: 0, // 弹窗key值
      current: 0,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      rules: {
        name: [{ required: true, message: '巡更组名称必填', trigger: 'blur' }, {
          max: 50,
          message: '最大字数限制50',
          trigger: 'blur'
        }],
        id: [{ required: true, message: '巡更组编号必填', trigger: 'blur' }, {
          message: '输入字段应为1-50位的数字和英文字母大小写',
          trigger: 'blur',
          pattern: /^[A-Za-z0-9]{1,50}$/
        }],
        pathIds: [{ required: true, message: '巡更组路径必选', trigger: 'blur' }],
        userIds: [{ required: true, message: '巡更组用户必选', trigger: 'blur' }],
        isOpen: [{ required: true, message: '有效标识必选', trigger: 'blur' }]
      },
      form: {
        id: null,
        name: null,
        isOpen: null,
        pathIds: [],
        userIds: [],
        remark: '' // 备注''
      },
      pathIdsApiData: [
        {
          id: '1', // 巡更路径ID， ID勾选作为数组给接口
          alias: '所有路线都已经被工作组使用', // 巡更路径名称， 名称展示给用户
          status: 'enabled', // 路径的状态，不需要关注
          organizeId: '1', // 路径所属组织机构，不需要关注
          creator: '徐达', // 路径创建人，不需要关注
          updateTime: '2023-07-27 01:08:21', // 路径的更新时间，不需要关注
          version: 0 // 路径的版本，不需要关注
        }
      ],
      pathIdsApiDataAll: [],
      // pathIdsX: [],
      users: Object, // api获取新增的用户信息
      usersAll: [],
      // selectedUser: [], // 选择的用户
      // remark: '',
      record: null,
      onSubmit: () => {
      },
      staffName: [], // 回显数据用户id-用户名
      alias: []// 回显数据路径id-路径名
    }
  },
  mounted () {
  },
  methods: {
    onCancel () {
      // 重置下拉选项的选择
      this.form = {
        id: '',
        name: '',
        // isOpen: null,
        pathIds: [],
        userIds: [],
        remark: '' // 备注''
      }
      this.visible = false
    },
    handleChange (value) {
      if (value === '1') {
        this.form.isOpen = 1
      }
      if (value === '0') {
        this.form.isOpen = 0
      }
    },
    // 1.新增  获取当前未绑定的路径
    async getFindUnBindAdd () {
      const data = await xungeng.get('/path/findUnBind')
      if (data.msg === '所有路线都已经被工作组使用') {
        this.pathIdsApiData = []
      }
      if (data.msg === 'OK') {
        this.pathIdsApiData = data.data
      }
    },
    // 2..新增 获取当前数据权限下的所有用户
    async getfindAllUser () {
      const data = await xungeng.get('/user/findAllUser')

      this.users = JSONBig.parse(decrypt(data.data))
    },
    // 3.新增工作组
    getroupAdd () {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        try {
          this.submitLoading = true

          const emptyFields = Object.entries(this.form).every(([key, value]) => {
            // 检查属性值是否为空字符串、null 或空数组
            return value === '' || value === null || (Array.isArray(value) && value.length === 0)
          })

          if (emptyFields) {
            this.$notification.error({
              message: '警告',
              description: '文本待修改'
            })
          }
          const data = await xungeng.post('/group/add',
            { ...this.form }
          )

          if (data.msg === 'OK') {
            this.visible = false
            this.$emit('get_list')
            this.$notification.success({
              message: '提示',
              description: '新增成功'
            })
          }
        } catch (error) {
          if (this.form.isOpen === true) {
            this.form.isOpen = 1
          }
          if (this.form.isOpen === false) {
            this.form.isOpen = 0
          }
        } finally {
          this.submitLoading = false
        }
      })
    },
    // 5.查询工作组下面已绑定的路径（编辑使用）
    async getBindPath (id) {
      this.getFindUnBindAdd()

      const data = await xungeng.get('/group/bindPath', { params: { id: id } })

      this.form.pathIds = data.data ? data.data.map(item => item.id) : []

      this.pathIdsApiData = [...this.pathIdsApiData, ...data.data]
    },
    // 6.查询工作组下面已绑定的用户（编辑使用）
    async getBindUser (id) {
      // await this.getfindAllUser()
      const allUser = await xungeng.get('/user/findAllUser')
      // this.users = JSON.parse(decrypt(data.data))
      console.log(JSONBig.parse(decrypt(allUser.data)))
      const pickUser = JSONBig.parse(decrypt(allUser.data)) ? JSONBig.parse(decrypt(allUser.data)).map(el => {
        el.userId = el.userId.toString()
        return _.pick(el, ['staffName', 'userId'])
      }) : []
      const data = await xungeng.get('group/bindUser', { params: { id: id } })

      const dataUsers = data.data ? JSONBig.parse(decrypt(data.data)).map(el => {
        el.userId = el.userId.toString()
        return _.pick(el, ['staffName', 'userId'])
      }) : []
      console.log(dataUsers)
      if (!data.data) {
        this.$notification.warning({
          message: '提示',
          description: `${data.msg}`
        })
      }
      this.form.userIds = data.data ? dataUsers.map(item => item.userId.toString()) : []

      const dataArray = pickUser
      const uniqueUserIds = new Set()
      const deduplicatedArray = []

      for (const obj of dataArray) {
        if (!uniqueUserIds.has(obj.userId)) {
          uniqueUserIds.add(obj.userId)
          deduplicatedArray.push(obj)
        }
      }

      this.users = deduplicatedArray
    },
    // 7.修改
    async groupEdit () {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          throw new Error('参数不正确')
        }
        const formNumBer = this.form
        formNumBer.pathIds.map(Number)
        // formNumBer
        try {
          const data = await xungeng.post('/group/edit',
            this.form
          )
          if (data.msg === 'OK') {
            this.visible = false
            this.$emit('editSuccess')
            this.$notification.success({
              message: '提示',
              description: '编辑成功'
            })
          }
        } catch (error) {
          // 编辑失败数据在转换回来
          this.$emit('get_list')
          if (this.form.isOpen === true) {
            this.form.isOpen = 1
          }
          if (this.form.isOpen === false) {
            this.form.isOpen = 0
          }
        } finally {
          this.submitLoading = false
        }
      })
    },

    // 存数据
    handlePathIdsChange (value) {
      this.form.pathIds = value
    },
    handlePathIdsChange2 (value) {
      this.form.userIds = value
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
      this.isDisabled = false
      this.form = {
        id: '',
        name: '',
        isOpen: null,
        pathIds: [],
        userIds: [],
        remark: '' // 备注''
      }
      this.onSubmit = this.insert
      this.modalKey++
      this.show('新增巡更组')
      this.getfindAllUser()// 用户
      this.getFindUnBindAdd()// 路径
    },
    /**
     * 打开编辑窗口
     */
    async edit (record) {
      this.isDisabled = true

      this.onSubmit = this.update
      this.show('编辑巡更组')
      this.modalKey++
      this.form = {
        id: record[0].id,
        name: record[0].name,
        isOpen: !!(record[0].isOpen),
        remark: record[0].remark,
        pathIds: [],
        userIds: []
      }
      // 调取编辑时表单可选数据
      this.getBindPath(record[0].id)
      this.getBindUser(record[0].id)

      if (this.form.isOpen === true) {
        this.form.isOpen = 1
      }
      if (this.form.isOpen === false) {
        this.form.isOpen = 0
      }
    },
    /**
     * 调取新增接口
     */
    async insert () {
      if (this.form.isOpen === 1) {
        this.form.isOpen = true
      }
      if (this.form.isOpen === 0) {
        this.form.isOpen = false
      }
      this.getroupAdd()
    },
    /**
     * 调取编辑接口
     */
    async update () {
      if (this.form.isOpen === 1) {
        this.form.isOpen = true
      }
      if (this.form.isOpen === 0) {
        this.form.isOpen = false
      }

      this.groupEdit()
    }
  }
}
</script>

<style lang="less">
.steps-content {
  height: 500px;
}
.modal-button-container {
  display: flex;
  justify-content: center;
}
</style>
