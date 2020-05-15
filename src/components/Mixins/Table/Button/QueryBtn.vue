<template>
  <a-button type="primary" v-on="$listeners" v-bind="{ ...$props, ...$attrs }" style="margin-left: 8px">查询</a-button>
</template>

<script>
export default {
  name: 'QueryBtn'
}
</script>
