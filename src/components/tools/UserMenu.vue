<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!--      <notice-icon class="action"/>-->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar"/>
          <span style="vertical-align: middle">{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!--          <a-menu-item key="0">-->
          <!--            <router-link :to="{ name: 'center' }">-->
          <!--              <a-icon type="user"/>-->
          <!--              <span>个人中心</span>-->
          <!--            </router-link>-->
          <!--          </a-menu-item>-->
          <!--          <a-menu-item key="1">-->
          <!--            <router-link :to="{ name: 'settings' }">-->
          <!--              <a-icon type="setting"/>-->
          <!--              <span>账户设置</span>-->
          <!--            </router-link>-->
          <!--          </a-menu-item>-->
          <!--          <a-menu-item key="2" disabled>-->
          <!--            <a-icon type="setting"/>-->
          <!--            <span>测试</span>-->
          <!--          </a-menu-item>-->
          <!--          <a-menu-item key="1">-->
          <!--            <a href="javascript:;" @click="handleChangePwd">-->
          <!--              <a-icon type="setting"/>-->
          <!--              <span>重置密码</span>-->
          <!--            </a>-->
          <!--          </a-menu-item>-->
          <a-menu-item key="1">
            <a href="javascript:;" @click="handleChangePwd">
              <a-icon type="setting"/>
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <passwordSchema ref="schema" @operateSuccess="Success"></passwordSchema>
    </div>
  </div>
</template>

<script>
// import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import passwordSchema from '@/views/system/userManage/components/passwordSchema'
import Vue from 'vue'
import { USER } from '@/store/mutation-types'

export default {
  name: 'UserMenu',
  components: {
    passwordSchema
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])

  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    handleChangePwd () {
      this.$refs.schema.onShow({
        id: Vue.ls.get(USER).userId,
        password: ''
      })
    },
    async Success () {
      this.$refs.schema.onCancel()
      this.$nextTick(() => {
        this.query()
      })
    }
  }
}
</script>
