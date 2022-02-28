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
export default {
  name: 'SelectElement',
  data () {
    return {
      selectValue: '',
      elementProp: _.clone(defaultSelectProprietaryConfig),
      options: []
    }
  },
  methods: {
    displayRender ({ labels }) {
      return labels[labels.length - 1]
    },
    onChange (value, option) {
      const real = _.get(option, '[1]', {})
      this.selectValue = value
      this.$emit('selectChange', real)
      store.commit(CacheMutationTypes.setORM, value)
    },
    async fetch () {
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
      return data
    }
  },
  computed: {
    size () {
      return this.elementProp.styleConfig.size
    }
  },
  watch: {
    selectValue: {
      immediate: true,
      handler (value) {
      }
    }
  },
  destroyed () {
    Vue.ls.remove(DEFAILT_SELECT_VALUE_LABEL)
    Vue.ls.remove(DEFAILT_SELECT_VALUE_ID)
  },
  created () {
    this.fetch()
    store.commit(CacheMutationTypes.setORM, ['', ''])
  }
}
</script>

<style scoped>

</style>
