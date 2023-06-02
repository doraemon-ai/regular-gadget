import { ActionInfoType, ConversationDataType, SYS_ACTION_NAME } from '../Interface'
import axios from 'axios'

class Controller {

  public async handleAction({ action, expectation, values }: ActionInfoType): Promise<ConversationDataType> {
    console.log('handle action:', action, expectation, values)

    if (action === SYS_ACTION_NAME.INITIALIZATION || action === 'RE_INPUT') {
      return {
        conversationId: 'id:' + Math.random(),
        viewElementInfos: [{
          viewType: 'REGULAR_FORM',
          data: {},
          expectation: '输入原始文本和期望提取的信息',
        }],
      }
    }

    if (action === 'GENERATE_REGULARITY') {
      return axios({
        method: 'get',
        url: 'https://kale.zeabur.app/regular',
        params: {
          user_text: values.originText,
          user_highlight: values.selectText.join(','),
        },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          return {
            conversationId: 'id:' + Math.random(),
            viewElementInfos: [{
              viewType: 'CARD_LIST', data: {
                origin_text: values.originText,
                agent_output: res.data.agent_output,
                agent_reasoning: res.data.agent_reasoning,
              },
            }],
            suggestActions: [{ label: '再次输入', actionInfo: { action: 'RE_INPUT' } }],
          }
        })
    }

    return { conversationId: '', viewElementInfos: [] } // default
  }
}

export default new Controller()
