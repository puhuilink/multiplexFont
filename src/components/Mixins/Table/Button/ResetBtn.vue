<template>
  <a-button v-on="$listeners" v-bind="{ ...$props, ...$attrs }" style="margin-left: 8px">重置</a-button>
</template>

<script>
import { Button } from 'ant-design-vue'

export default {
  name: 'ResetBtn',
  extends: Button
}
</script>
