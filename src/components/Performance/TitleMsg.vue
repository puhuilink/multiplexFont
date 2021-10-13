<template>
  <div style="font-weight: bold;font-size: 17px;margin-left: -40%;width: 100%;">
    {{ tabMsg.alias }}  {{ tabMsg.ip ? `(${tabMsg.ip})` : '' }} {{ tabMsg.location ? `数据域: ${tabMsg.location}` : '' }} {{ tabMsg.hostType ? `\/${tabMsg.hostType.host}` : '' }}
  </div>
</template>

<script>
import { CmdbService } from '@/api'
import _ from 'lodash'

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
      const { data: { source } } = await CmdbService.find({
        where: {
          id: this.id
        },
        fields: [
          'alias',
          'hostType:modelHost { host }',
          'ip',
          'location'
        ],
        alias: 'source'
      })
      this.tabMsg = _.first(source)
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style scoped>

</style>
