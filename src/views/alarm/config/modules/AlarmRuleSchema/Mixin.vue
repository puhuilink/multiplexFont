<script>
import { CONTENT_TYPE_TIME } from './model'
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
  provide () {
    const { editAbleProps } = this
    return { editAbleProps }
  },
  computed: {
    useTime () {
      return this.formModel.content.type === CONTENT_TYPE_TIME
    },
    _formModel: {
      get () {
        return this.formModel
      },
      set (v) {
        this.$emit('update:formModel', v)
      }
    },
    editAbleProps () {
      return this.isEdit ? { disabled: true } : {}
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
