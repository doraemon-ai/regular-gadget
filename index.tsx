import ReactDOM from 'react-dom'
import View from './src/View'
import controller from './src/Controller'
import { InstallProps, ActionHandleResultType, IViewElementProps } from './Interface'

let onReceiveActHandleRes: ((data: ActionHandleResultType) => void) | undefined | null

export let gid: string

export default {

  bootstrap: async (props: InstallProps) => {
    gid = props.gid
    onReceiveActHandleRes = props.onReceiveActionHandleResult
    return Promise.resolve()
  },

  unmount: async (props: any) => {
    onReceiveActHandleRes = undefined
    ReactDOM.unmountComponentAtNode(props.container)
  },

  mount: async (props: { container: any, onGlobalStateChange: (params: any) => void }) => {
    props.onGlobalStateChange((event: { category: string, params: any }, prevEvent: any) => { // event: 变更后的状态; prevEvent 变更前的状态
      switch (event.category) {
        case 'ACTION':
          controller.handleAction(event.params).then(res => onReceiveActHandleRes?.(res)).catch(err => console.error(err))
          break
        case 'FEEDBACK':
          controller.handleFeedback(event.params)
          break
      }
    })

    ReactDOM.render(<div />, props.container)
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
          if (!actionInfo.expectation) {
            actionInfo.expectation = expectation
          }
          controller.handleAction(actionInfo).then(res => onReceiveActHandleRes?.(res)).catch(err => console.error(err))
        }}
      />
      ,
      document.getElementById(containerId),
    )

    return Promise.resolve()
  },

}
