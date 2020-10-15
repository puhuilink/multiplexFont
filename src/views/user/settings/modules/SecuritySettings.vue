<template>
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

        <template #actions v-show="item.actions">
          <a-button type="link" @click="item.actions.callback">
            {{ item.actions.title }}
          </a-button>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import { UserService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import { mapGetters } from 'vuex'
export default {
  name: 'SecuritySettings',
  data () {
    return {
      currentUserData: [
        {
          title: '账户密码',
          description: '',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$router.push('/pwd-change') }
          }
        },
        {
          title: '移动电话',
          description: '已绑定移动电话',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$message.info('功能正在开发中请等待') }
          }
        },
        {
          title: '备用邮箱',
          description: '已绑定邮箱',
          value: '',
          actions: {
            title: '修改',
            callback: () => { this.$message.info('功能正在开发中请等待') }
          }
        }
      ]
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
      return UserService.find({
        where: {
          ...generateQuery({ user_id: this.userId })
        },
        fields: ['mobile_phone', 'email'],
        alias: 'userList'
      }).then((r) => {
        const [userInfo] = r.data.userList
        this.currentUserData[1].value = userInfo.mobile_phone
        this.currentUserData[2].value = userInfo.email
      }).catch((e) => {
        this.currentUserData[1].value = ''
        this.currentUserData[2].value = ''
        this.$message.error('获取数据失败,失败信息为：' + e)
        throw e
      })
    }
  },
  created () {
    this.getCurrentUser()
  }
}
</script>
