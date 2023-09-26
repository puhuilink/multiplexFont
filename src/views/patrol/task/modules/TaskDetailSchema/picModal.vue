<template>
  <a-modal
    centered
    title="图片"
    :width="720"
    :footer="null"
    :visible="visible"
    @cancel="cancel"
  >
    <img
      :src="img"
      class="imgBig"
    >
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
export default {
  name: 'PicModal',
  mixins: [Schema],
  props: {
    img: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
 .imgBig {
   width: 100%;
   height: 100%;
 }
</style>
