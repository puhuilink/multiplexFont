import { tempKeywordMapping, modeTypeMapping } from '../../../config/typing'
import _ from 'lodash'

export {
  tempKeywordMapping,
  modeTypeMapping
}

class Tiptap {
  static createTextNode (text) {
    return { type: 'text', text }
  }

  static createMentionNode (id) {
    const label = tempKeywordMapping.get(id)
    return { type: 'mention', attrs: { id, label } }
  }

  static createParagraphNode (content) {
    return { type: 'paragraph', content }
  }
}

export class MessageModel {
  /**
   * tiptap content object => string
   */
  static serialize (contentObj = {}) {
    const rootContent = []
    // 根节点按行遍历
    for (const { content = [] } of contentObj.content) {
      // 行内按字符遍历
      rootContent.push(
        content.map(({ type, text, attrs }) => type === 'text' ? text : attrs.id).join('')
      )
    }
    return rootContent.join('\r\n')
  }

  /**
   * string => tiptap content object
   */
  static deSerialize (contentStr = '') {
    const { createMentionNode, createTextNode, createParagraphNode } = Tiptap
    const rootContent = []

    // 根节点按行遍历
    contentStr.split(/\r\n/g).forEach(str => {
      const content = []
      let snippet = ''
      // 行内按字符遍历
      for (let i = 0; i < str.length; i++) {
        // 逐字匹配直至匹配成功或遍历结束
        snippet += str[i]
        const [keyword] = [...tempKeywordMapping].find(([id]) => snippet.includes(id)) || []
        // 匹配成功，记录匹配结果并开始新匹配
        if (snippet.includes(keyword)) {
          const text = snippet.replace(keyword, '')
          text && content.push(createTextNode(text))
          content.push(createMentionNode(keyword))
          snippet = ''
        }

        // 遍历结束
        i === str.length - 1 && snippet && content.push(createTextNode(snippet))
      }

      // 允许空行
      rootContent.push(createParagraphNode(content))
    })

    return { type: 'doc', content: rootContent }
  }
}

export class AlarmTempModel {
  static fields = ['id', 'mode', 'message', 'enabled', 'title']

  static serialize ({ enabled, ...alarmTemp }) {
    return _.pick({
      enabled: !!enabled,
      ...alarmTemp
    }, this.fields)
  }

  static deSerialize ({ enabled, ...alarmTemp }) {
    return _.pick({
      enabled: ~~enabled,
      ...alarmTemp
    }, this.fields)
  }
}
