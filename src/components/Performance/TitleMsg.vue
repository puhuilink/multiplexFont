<template>
  <div style="font-weight: bold;font-size: 17px;margin-left: -40%;width: 100%;">
    {{ tabMsg.alias }}  {{ tabMsg.ip ? `(${tabMsg.ip})` : '' }} {{ tabMsg.location ? `数据域: ${tabMsg.location}` : '' }}
  </div>
</template>

<script>
import { CmdbService } from '@/api'
import _ from 'lodash'
import { serviceTree } from '@/utils/request'

export default {
  name: 'TitleMsg',
  props: {
    id: {
      require: true,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tabMsg: {}
    }
  },
  methods: {
    async loadData () {
      const { data } = await serviceTree.get('/hostTree/infoById', {
        params: {
          id: this.id
        }
      })
      this.tabMsg = data
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style scoped>

</style>
