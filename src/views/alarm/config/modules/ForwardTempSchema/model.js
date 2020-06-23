import { tempKeywordMapping } from '../../../config/typing'
import { first } from 'lodash'

export class Message {
  static serialize (contentObj = {}) {
    const { content } = first(contentObj.content)
    return content
      .map(({ type, text, attrs }) => type === 'text' ? text : attrs.id)
      .join('')
  }

  static deSerialize (contentStr = '') {
    const { makeMention, makeText } = this
    let snippet = ''
    const content = []
    const { length } = contentStr
    for (let i = 0; i < length; i++) {
      snippet += contentStr[i]
      const [keyword] = [...tempKeywordMapping].find(([id]) => snippet.includes(id)) || []
      const index = snippet.indexOf(keyword)
      if (index !== -1) {
        const text = snippet.replace('{time}', '')
        text && content.push(makeText(text))
        content.push(makeMention('{time}'))
        snippet = ''
      }
      if (i === length - 1) {
        snippet && content.push(makeText(snippet))
      }
    }

    return {
      type: 'doc',
      content: [
        { type: 'paragraph', content: content.filter(Boolean) }
      ]
    }
  }

  static makeText (text) {
    return { type: 'text', text }
  }

  static makeMention (id) {
    return { type: 'mention', attrs: { id, label: tempKeywordMapping.get(id) } }
  }
}
