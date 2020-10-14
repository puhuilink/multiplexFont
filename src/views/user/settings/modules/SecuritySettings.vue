<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item
      slot="renderItem"
      slot-scope="item, index"
      :key="index"
    >
      <a-list-item-meta>
        <h3 slot="title">{{ item.title }}</h3>
        <span slot="description">
          <span>{{ item.description }}</span>
          <span v-show="item.value"> : </span>
          <span>{{ item.value }}</span>
        </span>
      </a-list-item-meta>

      <template v-show="item.actions">
        <a-button
          type="link"
          slot="actions"
          @click="item.actions.callback"
        >
          {{ item.actions.title }}
        </a-button>
      </template>
    </a-list-item>
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
      data: [
        { title: '账户密码',
          description: '',
          value: '',
          actions: { title: '修改', callback: () => { this.$router.push('/pwd-change') } }
        },
        { title: '移动电话',
          description: '已绑定移动电话',
          value: '',
          actions: { title: '修改', callback: () => { this.$message.info('功能正在开发中请等待') } }
        },
        { title: '备用邮箱',
          description: '已绑定邮箱',
          value: '',
          actions: { title: '修改', callback: () => { this.$message.info('功能正在开发中请等待') } }
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
        alias: 'data'
      }).then((r) => {
        const [data] = r.data.data
        this.data[1].value = data.mobile_phone
        this.data[2].value = data.email
      }).catch((error) => {
        this.$message.error('获取数据失败')
        this.$message.error('失败信息为：' + error)
      })
    }
  },
  created () {
    this.getCurrentUser()
  }
}
</script>
