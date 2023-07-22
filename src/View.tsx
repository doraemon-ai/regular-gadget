import { ActionInfoType, IViewElementProps } from '../Interface'
import { Button, Card, Col, Form, Input, Row, Select, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ACTION } from './Controller'

export enum ViewType {
  REGULAR_FORM = 'REGULAR_FORM', // 正则表单
  CARD_LIST = 'CARD_LIST', // 卡片列表
}

export const KEY = {
  ORIGIN_TEXT: 'originText',
  SELECTED_WORD: 'selectedWord',
}

export default ({ viewType, data, expectation, onSendAction: sendAction }: IViewElementProps) => {
  if (viewType === ViewType.CARD_LIST) {
    return <Row gutter={16}>
      {data.regularExpressionList.map((rule: string, index) => {
        return <Col key={'key_' + rule} span={12}>
          <Card title={rule} extra={
            <CopyToClipboard
              text={rule}
              onCopy={() => message.success({ content: '复制成功🎉' })}
            >
              <Button type={'link'}>复制</Button>
            </CopyToClipboard>
          }>
            {data.originText.match(new RegExp(
              rule.replace('\n','')
            ))}
          </Card>
        </Col>
      })}
    </Row>
  }

  if (viewType === ViewType.REGULAR_FORM) {
    return <Form
      validateMessages={{ required: '\'${label}\' 是必选字段' }}
      onFinish={values => {
        sendAction({
          action: ACTION.GENERATE,
          values,
          expectation,
        })
      }}
    >
      <Form.Item label={'原始文本'} name={KEY.ORIGIN_TEXT} rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label={'需要提取的文本（可多个）'} name={KEY.SELECTED_WORD} rules={[{ required: true }]}>
        <Select mode="tags" tokenSeparators={[',']} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        生成正则
      </Button>
    </Form>
  }

  return <></>
}
