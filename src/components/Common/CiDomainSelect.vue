/**
* CI 域选择
* Author: dong xing
* Date: 2020/4/7
* Time: 16:22
* Email: dong.xing@outlook.com
*/

<template>
  <div class="ci-domain-select">
    <a-select
      :labelInValue="labelInValue"
      showSearch
      allowClear
      style="min-width: 200px"
      v-model="form.domain"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @select="select"
    >
      <a-select-option
        v-for="domain in domainList"
        :key="domain.name_s"
      >
        {{ domain.label_s }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import queryList from '@/api/controller/AlarmqQueryList'

export default {
  name: 'CiDomainSelect',
  props: {
    form: {
      type: Object,
      default: () => ({})
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    domainList: [],
    loading: false
  }),
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.loading = true
        this.domainList = await queryList.domainList()
      } catch (e) {
        this.domainList = []
        throw e
      } finally {
        this.loading = false
      }
    },
    select () {
      this.$emit('update:domain', this.form.domain)
    }
  }
}
</script>

<style scoped>

</style>
