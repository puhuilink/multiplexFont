import _ from 'lodash'
import moment from 'moment'
import replaceAll from 'string.prototype.replaceall'

export const SEND_TYPE_EMAIL = 'EMAIL'
export const SEND_TYPE_SMS = 'SMS'

export const SEND_TYPE_LIST = [
  [SEND_TYPE_EMAIL, '短信'],
  [SEND_TYPE_SMS, '邮箱']
]

export const SEND_TYPE_MAPPING = new Map(SEND_TYPE_LIST)
export const ALL_SEND_TYPE_MAPPING = new Map([
  ['', '全部分类'],
  ...SEND_TYPE_LIST
])

export const TEMP_KEYWORD_TIME = '{time}'
export const TEMP_KEYWORD_IP = '{IP}'
export const TEMP_KEYWORD_DETAIL = '{detail}'
export const TEMP_KEYWORD_ENDPOINT = '{endpoint}'
export const TEMP_KEYWORD_LEVEL = '{level}'

export const TEMP_KEYWORD_LIST = [
  [TEMP_KEYWORD_TIME, '时间'],
  [TEMP_KEYWORD_IP, 'IP'],
  [TEMP_KEYWORD_DETAIL, '详情'],
  [TEMP_KEYWORD_ENDPOINT, 'endpoint'],
  [TEMP_KEYWORD_LEVEL, '级别']
]

export const TEMP_KEYWORD_MAPPING = new Map(TEMP_KEYWORD_LIST)

export const templateMock = (template = '') => {
  let str = `${template}`
  const data = {
    [TEMP_KEYWORD_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
    [TEMP_KEYWORD_DETAIL]: 'cpu温度过高,温度79度',
    [TEMP_KEYWORD_LEVEL]: '1'
  }
  Object
    .entries(data)
    .forEach(([keyword, mockValue]) => {
      str = replaceAll(str, keyword, mockValue)
    })
  return str
}

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
      templateMock(template)
    )
  }

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
