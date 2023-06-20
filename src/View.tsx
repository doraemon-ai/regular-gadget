import { ActionInfoType, IViewElementProps } from '../Interface'
import { Button, Card, Col, Form, Input, Row, Select, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export enum ViewType {
  CARD_LIST = 'CARD_LIST'
}

export default (
  {
    viewType, data, expectation, onSendAction: sendAction,
  }: IViewElementProps & { onSendAction: (actionInfo: ActionInfoType) => void },
) => {

  if (viewType === ViewType.CARD_LIST) {
    return <Row gutter={16}>
      {data.agent_output.map((item: string) => {
        return <Col key={'key_' + item} span={12}>
          <Card title={item} extra={
            <CopyToClipboard
              text={item}
              onCopy={() => message.success({ content: 'copy success~'})}
            >
              <Button type={'link'}>Copy</Button>
            </CopyToClipboard>
          }>
            {data.origin_text}
          </Card>
        </Col>
      })}
    </Row>
  }

  if (viewType === 'REGULAR_FORM') {
    return <Form onFinish={values => {
      console.log('values', values)
      sendAction({
        action: 'GENERATE_REGULARITY',
        values,
        expectation,
      })
    }}
    >
      <Form.Item label={'原始文本'} name={'originText'}>
        <Input />
      </Form.Item>

      <Form.Item label={'需要提取的文本（可多个）'} name={'selectText'}>
        <Select mode="tags" tokenSeparators={[',']} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        生成正则
      </Button>
    </Form>
  }

  return <></>
}
