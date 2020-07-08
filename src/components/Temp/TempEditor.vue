<template>
  <div class="editor">
    <a-input :value="value" class="input" ref="input" />
    <editor-menu-bar :editor="editor" v-slot="{ commands }">
      <div class="menubar">
        <a-button class="menubar__btn" @click="togglePreview" type="primary">{{ preview ? '取消预览' : '预览' }}</a-button>
        <a-button
          class="menubar__btn"
          :disabled="preview"
          v-for="(label, id) in tempKeywordList"
          :key="id"
          @click="commands.mention({ id, label })"
        >{{ label }}</a-button>
      </div>
    </editor-menu-bar>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Mention } from 'tiptap-extensions'
import { MessageModel, TEMP_KEYWORD_MAPPING } from './model'

// if error when enter: Looks like multiple versions of prosemirror-model were loaded
// https://github.com/scrumpy/tiptap/issues/577
export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: (vm) => ({
    editor: new Editor({
      extensions: [
        new Mention({
          // TODO: label @ 符号
          items: () => [...TEMP_KEYWORD_MAPPING].map(([id, name]) => ({ id, name }))
        })
      ],
      content: '',
      onUpdate: ({ getJSON }) => {
        vm.$emit('input', MessageModel.serialize(getJSON()))
        // TODO: trigger input event and validator
      }
    }),
    insertMention: () => {},
    preview: false,
    tempKeywordList: Object.freeze(
      Object.fromEntries(TEMP_KEYWORD_MAPPING)
    )
  }),
  watch: {
    preview (preview) {
      if (preview) {
        this.editor.setOptions({ editable: false })
        this.setContent(
          MessageModel.mockContent(this.value)
        )
      } else {
        this.editor.setOptions({ editable: true })
        this.setContent(
          MessageModel.deSerialize(this.value)
        )
      }
    },
    value (value) {
      this.setContent(
        MessageModel.deSerialize(value)
      )
    }
  },
  methods: {
    resetContent () {
      this.setContent('')
    },
    setContent (content = '') {
      this.editor.setContent(content)
    },
    togglePreview () {
      this.preview = !this.preview
    }
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="less">
@colorBlack: #000000;

.editor {
  p {
    margin: 0;
  }

  .input {
    display: none;
  }

  .ProseMirror {
    padding: 4px 11px;
    width: 100%;
    height: 200px;
    overflow: auto;
    border: 1px solid #d9d9d9;
    border-radius: 4px;

    &-focused {
      outline: none;
    }
  }

  .mention {
    background: rgba(@colorBlack, 0.1);
    color: rgba(@colorBlack, 0.6);
    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 5px;
    padding: 0.2rem 0.5rem;
    white-space: nowrap;
  }

  .menubar {
    &__btn {
      margin-right: 8px;
    }
  }
}

</style>
