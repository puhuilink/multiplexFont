<template>
  <div class="DevBug">
    <DrillPreview />
  </div>
</template>

<script>
import DrillPreview from '~~~/DrillPreview'
import { sql } from '@/utils/request'
import { encrypt } from '@/utils/aes'

export default {
  name: 'DevBug',
  mixins: [],
  components: {
    DrillPreview
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {
    async network () {
      const payload = {
        type: 'bulk',
        args: [
          {
            type: 'run_sql',
            args: {
              read_only: false,
              cascade: false,
              sql: `
        select * from t_patrol_sender;
      `
            }
          }
        ]
      }
      const formData = new FormData()
      formData.append('body', encrypt(JSON.stringify(payload)))
      await sql('select * from t_patrol_sender')
    }
  },
  mounted () {
    this.network()
  }
}
</script>

<style lang="less">

</style>
