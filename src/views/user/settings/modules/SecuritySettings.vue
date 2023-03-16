<template>
  <a-spin :spinning="loading">
    <a-list itemLayout="horizontal" :dataSource="currentUserData">
      <template #renderItem="item, index">
        <a-list-item :key="index">
          <a-list-item-meta>
            <template #title>
              <h3>{{ item.title }}</h3>
            </template>

            <template #description>
              <span>
                <span>{{ item.description }}</span>
                <span v-show="item.value"> : </span>
                <span>{{ item.value }}</span>
              </span>
            </template>
          </a-list-item-meta>

          <template #actions>
            <a-button type="link" @click="item.actions.callback">
              {{ item.actions.title }}
            </a-button>
          </template>
        </a-list-item>
      </template>
      <schema ref="schema"></schema>
    </a-list>

  </a-spin>
</template>

<script>
import { UserService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import { mapGetters } from 'vuex'
import { List } from '@/components/Mixins'
import schema from './Schema'
export default {
  name: 'SecuritySettings',
  mixins: [List],
  components: {
    schema
  },
  data () {
    return {
      currentUserData: [
        {
          title: '账户密码',
          description: '',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$router.push({ name: 'PwdChange' }) }
          }
        },
        {
          title: '移动电话',
          description: '已绑定移动电话',
          value: '',
          actions: {
            title: '修改',
            callback: () => {
              this.$message.info('功能正在开发中请等待...')
              // this.reviseTele()
            }
          }
        },
        {
          title: '备用邮箱',
          description: '已绑定邮箱',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$message.info('功能正在开发中请等待...') }
          }
        },
        {
          title: '交建通',
          description: '已绑定交建通',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$message.info('功能正在开发中请等待...') }
          }
        }
      ],
      loading: false,
      rule: [{ required: true, message: '排班条件必填' }],
      field: 'mobile_phone'
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    /**
     * 获取当前用户信息
     * @event
     */
    getCurrentUser () {
      this.loading = true
      return UserService.find({
        where: {
          ...generateQuery({ user_id: this.userId })
        },
        fields: ['mobile_phone', 'email', 'jjt'],
        alias: 'userList'
      }).then((r) => {
        const [userInfo] = r.data.userList
        this.currentUserData[1].value = userInfo.mobile_phone
        this.currentUserData[2].value = userInfo.email
        this.currentUserData[3].value = userInfo.jjt
      }).catch((e) => {
        this.currentUserData[1].value = ''
        this.currentUserData[2].value = ''
        this.currentUserData[3].value = ''
        this.$notifyError(e)
        throw e
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 修改电话
     */
    reviseTele () {
      this.rule = [{ required: true, message: '排班条件必填', trigger: 'blur' }]
      this.field = 'mobile_phone'
      this.$refs.schema.onTele()
    }
  },
  created () {
    this.getCurrentUser()
  }
}
</script>
