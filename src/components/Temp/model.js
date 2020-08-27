import moment from 'moment'
import replaceAll from 'string.prototype.replaceall'
import {
  TEMP_KEYWORD_TIME,
  TEMP_KEYWORD_IP,
  TEMP_KEYWORD_DETAIL,
  TEMP_KEYWORD_ENDPOINT,
  TEMP_KEYWORD_METRIC,
  TEMP_KEYWORD_LEVEL,
  TEMP_KEYWORD_MAPPING
} from './types'

class Tiptap {
  static createTextNode (text) {
    return { type: 'text', text }
  }

  static createMentionNode (id) {
    const label = TEMP_KEYWORD_MAPPING.get(id)
    return { type: 'mention', attrs: { id, label } }
  }

  static createParagraphNode (content) {
    return { type: 'paragraph', content }
  }
}

export class MessageModel {
  static mockContent (template) {
    return this.deSerialize(
      this.templateMock(template)
    )
  }

  static templateMock (template = '') {
    let str = `${template}`
    const data = {
      [TEMP_KEYWORD_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
      [TEMP_KEYWORD_IP]: '127.0.0.1',
      [TEMP_KEYWORD_DETAIL]: 'cpu温度过高,温度79度',
      [TEMP_KEYWORD_ENDPOINT]: '串口管理器',
      [TEMP_KEYWORD_METRIC]: '面板告警状态',
      [TEMP_KEYWORD_LEVEL]: '1'
    }
    Object
      .entries(data)
      .forEach(([keyword, mockValue]) => {
        str = replaceAll(str, keyword, mockValue)
      })
    return str
  }

  /**
   * tiptap content object => string
   */
  static serialize (contentObj = {}, singleLine = false) {
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
  static deSerialize (contentStr = '', singleLine = false) {
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
        const [keyword] = [...TEMP_KEYWORD_MAPPING].find(([id]) => snippet.includes(id)) || []
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
