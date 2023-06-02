import { ActionInfoType, IViewElementProps } from '../Interface'
import { Button, Card, Col, Form, Input, Row, Select } from 'antd'

export default (
  {
    viewType, data, expectation, onSendAction: sendAction,
  }: IViewElementProps & { onSendAction: (actionInfo: ActionInfoType) => void },
) => {

  if (viewType === 'CARD_LIST') {
    return <Row gutter={16}>
      {data.agent_output.map(item => {
        return <Col span={12}>
          <Card title={item} extra={<a href="#">Copy</a>}>
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
        expectation
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
