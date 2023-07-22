import { ActionInfoType, ActionHandleResultType, SYS_ACTION_NAME, FeedbackInfoType } from '../Interface'
import axios from 'axios'
import { KEY, ViewType } from './View'

export enum ACTION {
  RE_INPUT = 'RE_INPUT', // 再次输入
  GENERATE = 'GENERATE' // 生成正则表达式
}

class Controller {

  public onCreate(gid: string) {
    console.log('gid', gid) // dynamic id
  }

  public onDestroy() {
  }

  public handleFeedback(feedbackInfo: FeedbackInfoType) {
  }

  public async handleAction({ action, expectation, values }: ActionInfoType): Promise<ActionHandleResultType> {
    console.log('[Gadget App] handle action:', action, expectation, values)
    if (action === SYS_ACTION_NAME.INITIALIZATION || action === ACTION.RE_INPUT) {
      return {
        sessionUUId: 'id:' + Math.random(), // 示例id，最好来自服务器生成
        viewElementInfos: [{
          viewType: ViewType.REGULAR_FORM,
          data: {},
          expectation: '输入原始文本和期望提取的信息',
        }],
      }
    }

    if (action === ACTION.GENERATE) {
      return axios({
        method: 'get',
        url: 'https://doraemon-server.vercel.app/regular',
        params: {
          user_text: values[KEY.ORIGIN_TEXT],
          user_highlight: values[KEY.SELECTED_WORD].join(','),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(({data}: any) => {
          return {
            sessionUUId: 'id:' + Math.random(),
            viewElementInfos: [{
              viewType: ViewType.CARD_LIST,
              data: {
                originText: values[KEY.ORIGIN_TEXT],
                regularExpressionList: data.agent_output,
                explain: data.agent_reasoning,
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
