<template>
  <div class="DevDebug">
    <BrandListSelect />
    <HostListSelect />
  </div>
</template>

<script>
import BrandListSelect from './modules/BrandListSelect'
import HostListSelect from './modules/HostListSelect'

export default {
  name: 'DevDebug',
  mixins: [],
  components: {
    BrandListSelect,
    HostListSelect
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
