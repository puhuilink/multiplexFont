<template>
  <div class="editor">
    <a-input :value="value" class="input" ref="input" />
    <editor-menu-bar :editor="editor" v-slot="{ commands }">
      <div class="menubar">
        <a-button class="menubar__btn" v-for="(label, id) in tempKeywordList" :key="id" @click="commands.mention({ id, label })">{{ label }}</a-button>
      </div>
    </editor-menu-bar>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Mention } from 'tiptap-extensions'
import { tempKeywordMapping } from '../../../config/typing'
import { Message } from './model'

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
          items: () => [...tempKeywordMapping].map(([id, name]) => ({ id, name }))
        })
      ],
      content: '',
      onUpdate: ({ getJSON }) => {
        vm.$emit('input', Message.serialize(getJSON()))
      }
    }),
    insertMention: () => {},
    tempKeywordList: Object.freeze(
      Object.fromEntries(tempKeywordMapping)
    )
  }),
  watch: {
    value (value) {
      this.setContent(
        Message.deSerialize(value)
      )
    }
  },
  methods: {
    resetContent () {
      this.setContent('')
    },
    async setContent (content = '') {
      await this.$nextTick()
      this.editor.setContent(content)
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
