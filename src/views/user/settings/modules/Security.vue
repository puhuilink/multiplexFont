<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
import { UserService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
export default {
  data () {
    return {
      where: {},
      data: [
        { title: '账户密码', description: '', value: '', actions: { title: '修改', callback: () => { this.$router.push('/pwd-change') } } },
        { title: '移动电话', description: '已绑定移动电话', value: '', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
        { title: '备用邮箱', description: '已绑定邮箱', value: '', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning') } } }
      ]
    }
  },

  methods: {
    getUser (parameter) {
      return UserService.find({
        where: {
          ...generateQuery(parameter)
        },
        fields: ['mobile_phone', 'email'],
        alias: 'data'
      }).then((r) => r.data.data)
    }
  },
  async created () {
    try {
      this.where = {
        user_id: this.$store.getters.roles.userId
      }
      const [data] = await this.getUser(this.where)
      this.data[1].value = data.mobile_phone
      this.data[2].value = data.email
    } catch (error) {
      this.$message.error('获取数据失败')
    }
  }
}
</script>

<style scoped>

</style>
