<template>
  <div class="DevDebug">
    <BusinessSystemTreeHealthList :content="content" />
  </div>
</template>

<script>
import BusinessSystemTreeHealthList from '~~~/BusinessSystemTreeHealthList'

export default {
  name: 'DevDebug',
  mixins: [],
  components: {
    BusinessSystemTreeHealthList
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
