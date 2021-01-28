<template>
  <div class="DevDebug">
    <CascaderDictValue :content="content" />
  </div>
</template>

<script>
import CascaderDictValue from '~~~/CascaderDictValue'

export default {
  name: 'DevDebug',
  mixins: [],
  components: {
    CascaderDictValue
  },
  props: {},
  data: () => ({
    content: []
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
