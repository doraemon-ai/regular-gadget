import ReactDOM from 'react-dom'
import View from './src/View'
import controller from './src/Controller'
import { InstallParams, ConversationDataType, IViewElementProps, SYS_ACTION_NAME } from './Interface'
import React from 'react'

let onReceiveHandleResult: ((data: ConversationDataType) => void) | undefined | null

export default {

  bootstrap: async (props: InstallParams) => {
    onReceiveHandleResult = props.onReceiveConversationData
    return Promise.resolve()
  },

  unmount: async (props: any) => {
    onReceiveHandleResult = undefined
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
  },

  mount: async (props: { container: any, name: string, onGlobalStateChange: (params: any) => void }) => {
    props.onGlobalStateChange((state: any, prev: any) => { // state: 变更后的状态; prev 变更前的状态
      if (state.type === 'ACTION') {
        console.log('监听event', state)

        controller.handleAction(state.params)
          .then(res => onReceiveHandleResult?.(res))
          .catch(err => {
            console.error(err)
          })
      } else if (state.type === 'FEEDBACK') {
        console.log(state.params)
      }
    })

    ReactDOM.render(<div />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))

    setTimeout(() => {
      controller.handleAction({
        action: SYS_ACTION_NAME.INITIALIZATION,
        expectation: 'init gadget: ' + props.name,
      })
        .then(res => onReceiveHandleResult?.(res))
        .catch(err => {
          console.error(err)
        })
    }, 300)
  },

  update: async (props: IViewElementProps): Promise<any> => {
    const { isReadonly, containerId, viewType, data, expectation } = props
    ReactDOM.render(
      <View
        containerId={containerId}
        isReadonly={isReadonly}
        viewType={viewType}
        data={data}
        expectation={expectation}
        onSendAction={(actionInfo) => {
          actionInfo.expectation = expectation
          controller.handleAction(actionInfo).then(res => onReceiveHandleResult?.(res))
        }}
      />
      ,
      document.getElementById(containerId),
    )

    return null
  },

}
