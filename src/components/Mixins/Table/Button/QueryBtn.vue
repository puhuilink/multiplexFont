<template>
  <a-button htmlType="submit" type="primary" v-on="$listeners" v-bind="$props" style="margin-left: 8px">查询</a-button>
</template>

<script>
import { Button } from 'ant-design-vue'
export default {
  name: 'QueryBtn',
  extends: Button
}
</script>
