<template>
  <a-form-model class="ormDataSource" v-bind="formItemLayout">
    <PreviewButton :preview="preview" />
    <a-form-model-item label="区域名称" require>
      <a-input
        v-model="ormConfig.name"
      ></a-input>
    </a-form-model-item>
    <RefreshTime @change="change()" />
    <a-form-model-item label="使用缓存">
      <a-switch
        checkedChildren="显示"
        unCheckedChildren="不显示"
        @change="cache" />
    </a-form-model-item>
    <a-form-model-item label="缓存数据名称" >
      <a-input
        v-model="ormConfig.cache"
      ></a-input>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import DataSourceMixins from '@/views/design/modules/config/dataSourceMixins'
import { OriginSelect } from '~~~/Alarm'
import store from '@/store'

export default {
  name: 'OrmDataSource',
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
      this.ormConfig.cache = id
      this.$emit('change')
    }
  }
}
</script>

<style scoped>

</style>
