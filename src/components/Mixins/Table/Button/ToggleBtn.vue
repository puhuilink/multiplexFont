<template>
  <a v-on="$listeners" style="margin-left: 8px">
    {{ advanced ? '收起' : '展开' }}
    <a-icon :type="advanced ? 'up' : 'down'"/>
  </a>
</template>

<script>
export default {
  name: 'QueryBtn',
  props: {
    advanced: {
      type: Boolean,
      default: false
    }
  }
}
</script>
