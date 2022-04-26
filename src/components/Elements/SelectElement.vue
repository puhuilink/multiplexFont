<template>
  <a-cascader
    :options="options"
    :display-render="displayRender"
    expand-trigger="hover"
    placeholder="选择地区"
    :defaultValue="['11.10北京设计分公司','5f34d35396b1f125918db25e']"
    :size="size"
    @change="onChange"
    :allowClear="false"
    :showSearch="true"
  />
</template>

<script>
import Vue from 'vue'
import { DEFAILT_SELECT_VALUE_LABEL, DEFAILT_SELECT_VALUE_ID } from '@/store/mutation-types'
import { SdwanSiteService } from '@/api'
import _ from 'lodash'
import store from '@/store/'
import { CacheMutationTypes } from '@/store/modules/cache'
import { defaultSelectProprietaryConfig } from '@/model/config/proprietaryConfigs/SelectProprietaryConfig'
import { MVSiteService } from '@/api/service/SdwanSiteService'
export default {
  name: 'SelectElement',
  data () {
    return {
      selectValue: '',
      elementProps: _.cloneDeep(defaultSelectProprietaryConfig),
      options: []
    }
  },
  methods: {
    displayRender ({ labels }) {
      return labels[labels.length - 1]
    },
    onChange (value, option) {
      const real = this.type === 'sdwan' ? _.get(option, '[1]', {}) : _.get(option, '[0]', {})
      // this.selectValue = value
      this.$emit('selectChange', real)
      store.commit(CacheMutationTypes.setORM, value)
    },
    async fetch () {
      this.options = []
      const { data: { data } } = await SdwanSiteService.find({
        distinct: 'name',
        fields: ['city', 'name', 'id'],
        alias: 'data'
      })
      const arr = []
      const key = new Set()
      const names = new Set()
      let index = 0
      for (let i = 0; i < data.length; i++) {
        const old = data[i]
        if (!key.has(old.city)) {
          index = arr.push({
            value: old.name,
            label: old.city,
            children: [{
              value: old.id,
              label: old.name
            }]
          }) - 1
        }
        for (let j = i; j < data.length; j++) {
          const compare = data[j]
          key.add(old.city)
          names.add(old.name)
          if (key.has(old.city) && compare.city === old.city && !names.has(compare.name)) {
            arr[index].children.push({
              value: compare.id,
              label: compare.name
            })
            names.add(compare.name)
          }
        }
      }
      this.options = arr
    },
    async fetchMv () {
      this.options = []
      const { data: { data } } = await MVSiteService.find({
        distinct: 'name',
        fields: ['name', 'id'],
        alias: 'data'
      })
      const arr = []
      const ids = new Set()
      for (let i = 0; i < data.length; i++) {
        const old = data[i]
        if (!ids.has(old.id)) {
          arr.push({
            value: old.id,
            label: old.name
          })
          ids.add(old.id)
        }
      }
      this.options = arr
    },
    requestData () {
      switch (this.type) {
        case 'sdwan':
          this.fetch()
          break
        case 'mv':
          this.fetchMv()
          break
      }
    }
  },
  computed: {
    size () {
      return this.elementProps.styleConfig.size
    },
    type () {
      return this.elementProps.styleConfig.type
    }
  },
  watch: {
    'elementProps.styleConfig': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.requestData()
        }
      }
    }
  },
  destroyed () {
    Vue.ls.remove(DEFAILT_SELECT_VALUE_LABEL)
    Vue.ls.remove(DEFAILT_SELECT_VALUE_ID)
  },
  created () {
    this.requestData()
    store.commit(CacheMutationTypes.setORM, ['', ''])
  }
}
</script>

<style scoped>

</style>
