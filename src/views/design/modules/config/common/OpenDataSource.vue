<template>
  <a-form-model v-bind="formItemLayout">
    <PreviewButton :preview="preview" />
    <a-form-model-item label="接口地址" require>
      <a-input
        v-model="openConfig.address"
      >
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="接口参数" require>
      <a-textarea
        v-model="openConfig.args"
      ></a-textarea>
    </a-form-model-item>
    <RefreshTime @change="change()" />
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import { OriginSelect } from '~~~/Alarm'
import store from '@/store'

export default {
  name: 'OpenDataSource',
  mixins: [DataSourceMixins],
  components: {
    OriginSelect
  },
  data () {
    return {
      cacheStatus: false
    }
  },
  methods: {
    cache (checked) {
      this.cacheStatus = checked
    }
  },
  computed: {
    isFollowed () {
      return store.getters.orm
    }
  },
  watch: {
    async isFollowed ([label, id]) {
      this.openConfig.cache = id
      await this.change(true)
    }
  }
}
</script>

<style scoped>

</style>
