import { ActionInfoType, ActionHandleResultType, SYS_ACTION_NAME, FeedbackInfoType } from '../Interface'
import { gid } from '../index'
import axios from 'axios'
import { ViewType } from './View'

class Controller {

  constructor() {
    console.log('gid', gid)
  }

  public handleFeedback(feedbackInfo: FeedbackInfoType) {}

  public async handleAction({ action, expectation, values }: ActionInfoType): Promise<ActionHandleResultType> {
    console.log('handle action:', action, expectation, values)

    if (action === SYS_ACTION_NAME.INITIALIZATION || action === 'RE_INPUT') {
      return {
        sessionUUId: 'id:' + Math.random(),
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
        .then((res: any) => {
          return {
            sessionUUId: 'id:' + Math.random(),
            viewElementInfos: [{
              viewType: ViewType.CARD_LIST,
              data: {
                origin_text: values.originText,
                agent_output: res.data.agent_output,
                agent_reasoning: res.data.agent_reasoning,
              },
            }],
            suggestActions: [{ label: '再次输入', actionInfo: { action: 'RE_INPUT' } }],
          }
        })
    }

    return { sessionUUId: '', viewElementInfos: [] } // default
  }
}

export default new Controller()
