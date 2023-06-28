import ReactDOM, { Container } from 'react-dom'
import View from './src/View'
import controller from './src/Controller'
import { InstallProps, ActionHandleResultType, IViewElementProps } from './Interface'

let onReceiveActHandleRes: ((data: ActionHandleResultType) => void) | null

export let gid: string

export default {

  bootstrap: async (props: InstallProps) => {
    gid = props.gid
    onReceiveActHandleRes = props.onReceiveActionHandleResult
    return Promise.resolve()
  },

  unmount: async (props: { container: Element | DocumentFragment }) => {
    onReceiveActHandleRes = null
    ReactDOM.unmountComponentAtNode(props.container)
  },

  mount: async (props: { container: Container, onGlobalStateChange: (params: any) => void }) => {
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
    const { isReadonly, containerId, viewType, data, expectation, onSendAction } = props
    ReactDOM.render(
      <View
        isReadonly={isReadonly} containerId={containerId} viewType={viewType}
        expectation={expectation} data={data} onSendAction={onSendAction}
      />
      , document.getElementById(containerId),
    )

    return Promise.resolve()
  },

}
