import moment from 'moment'
import replaceAll from 'string.prototype.replaceall'
import {
  TEMP_KEYWORD_TIME,
  TEMP_KEYWORD_IP,
  TEMP_KEYWORD_DETAIL,
  TEMP_KEYWORD_ENDPOINT,
  TEMP_KEYWORD_METRIC,
  TEMP_KEYWORD_LEVEL,
  TEMP_KEYWORD_MAPPING,
  PATROL_LEVEL,
  PATROL_LEVEL_ALIAS,
  PATROL_CHECKPOINT,
  PATROL_HOST,
  PATROL_ZONE,
  PATROL_ENDPOINT,
  PATROL_METRIC,
  PATROL_ANSWER,
  PATROL_EXECUTOR,
  PATROL_TIME,
  TEMP_PATROL_MAPPING,
  UNION_KEYWORD_ID,
  UNION_KEYWORD_NAME,
  UNION_KEYWORD_CONTENT,
  UNION_KEYWORD_OBJECT,
  UNION_KEYWORD_APP_KEY,
  UNION_KEYWORD_SEND_TIME,
  UNION_KEYWORD_LAST_TIME,
  UNION_KEYWORD_LEVEL,
  UNION_KEYWORD_STATUS,
  UNION_KEYWORD_MEMBERS, UNION_KEYWORD_ACK_TIME, UNION_KEYWORD_CLOSE_TIME, UNION_KEYWORD_ACK_ID, TEMP_UNION_MAPPING
} from '@/tables/alarm_temp/types'

const TEMP_MAPPING = new Map([...TEMP_KEYWORD_MAPPING, ...TEMP_PATROL_MAPPING, ...TEMP_UNION_MAPPING])

class Tiptap {
  static createTextNode (text) {
    return { type: 'text', text }
  }

  static createMentionNode (id) {
    const label = TEMP_MAPPING.get(id)
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
      [TEMP_KEYWORD_LEVEL]: '1',
      [PATROL_LEVEL]: 'L1',
      [PATROL_LEVEL_ALIAS]: '一般告警',
      [PATROL_CHECKPOINT]: 'DM01-数据中心大门',
      [PATROL_HOST]: 'UPS输出柜',
      [PATROL_ZONE]: 'XF01',
      [PATROL_ENDPOINT]: '温度',
      [PATROL_METRIC]: '设备温湿度',
      [PATROL_ANSWER]: '23℃',
      [PATROL_EXECUTOR]: '张三',
      [PATROL_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
      [UNION_KEYWORD_ID]: '001',
      [UNION_KEYWORD_NAME]: 'CPU温度异常',
      [UNION_KEYWORD_CONTENT]: 'CPU温度超过90°持续1小时',
      [UNION_KEYWORD_OBJECT]: '10.201.1.92服务器',
      [UNION_KEYWORD_APP_KEY]: '6D8GF9G0VI0ZA8X',
      [UNION_KEYWORD_SEND_TIME]: '10次',
      [UNION_KEYWORD_LAST_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
      [UNION_KEYWORD_LEVEL]: 'P1级',
      [UNION_KEYWORD_STATUS]: '待处理',
      [UNION_KEYWORD_MEMBERS]: '张三, 李四, 王五',
      [UNION_KEYWORD_ACK_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
      [UNION_KEYWORD_CLOSE_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
      [UNION_KEYWORD_ACK_ID]: '9I90AHD91JA0'
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
    console.log(contentObj)
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
        const [keyword] = [...TEMP_MAPPING].find(([id]) => snippet.includes(id)) || []
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
    console.log('cont', rootContent)
    return { type: 'doc', content: rootContent }
  }
}
