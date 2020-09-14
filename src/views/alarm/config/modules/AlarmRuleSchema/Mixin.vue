<script>
import { parserInt } from '@/utils/util'

export const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17, offset: 1 }
}

export default {
  name: 'Mixin',
  mixins: [],
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    formItemLayout
  }),
  computed: {
    _formModel: {
      get () {
        return this.formModel
      },
      set (v) {
        this.$emit('update:formModel', v)
      }
    }
  },
  methods: {
    parserInt
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  font-size: 1.5rem;
}
</style>
