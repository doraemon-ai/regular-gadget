/**
 * @link https://github.com/kaleai/doraemon
 * @description This file is generated by doraemon-gadget-template.
 *
 * The MIT License
 * Copyright © 2023 kale
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import ReactDOM, { Container } from 'react-dom'
import View from './src/View'
import controller from './src/Controller'
import { InstallProps, IViewElementProps } from './Interface'

export default {

  bootstrap: async (props: InstallProps) => {
    props.getView((props: IViewElementProps, id: string) => {
      ReactDOM.render(<View {...props} />, document.getElementById(id))
    })
    props.sendEvent((category: string, params: any) => {
      console.log('[Gadget App] handle event', category, params)

      switch (category) {
        case 'ACTION':
          return controller.handleAction(params)
        case 'FEEDBACK':
          return controller.handleFeedback(params)
      }
    })
    controller.onCreate(props.gid)
  },
  mount: async (props: { container: Container }) => {
    ReactDOM.render(<div />, props.container)
  },
  unmount: async (props: { container: Element }) => {
    controller.onDestroy()
    ReactDOM.unmountComponentAtNode(props.container)
  },
}
