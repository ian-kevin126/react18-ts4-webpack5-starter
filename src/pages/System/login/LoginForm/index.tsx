import { useEffect, useState } from 'react'
import { Form, Input, Button, Image } from 'antd'
import { UserOutlined, LockOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Login } from '@/types/base'
import { useGetCaptchaMutation, useLoginMutation } from '@/api/base'
import styles from './index.scss'

const LoginForm: React.FC = () => {
  const [captcha, setCaptcha] = useState<Login.Captcha>()
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const [getCaptcha, { data: _captcha }] = useGetCaptchaMutation()
  const [login] = useLoginMutation()

  const handleOnFinish = async (loginForm: Login.ReqLoginForm) => {
    try {
      setLoading(true)
      const loginParams: Login.ReqLoginForm = {
        ...loginForm,
        captchaId: captcha?.captchaId ?? ''
      }

      await login(loginParams)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (_captcha && _captcha?.data) {
      setCaptcha(_captcha.data)
    }
  }, [_captcha])

  const handleOnFinishFailed = () => {
    // TODO:
  }

  const HandleGetCaptchaCode = async () => {
    await getCaptcha(undefined)
  }

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 5 }}
      initialValues={{ remember: true }}
      size='large'
      onFinish={handleOnFinish}
      onFinishFailed={handleOnFinishFailed}
    >
      <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder='用户名: admin / ian' prefix={<UserOutlined rev={''} />} />
      </Form.Item>
      <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password
          autoComplete='new-password'
          placeholder='密码: 123456'
          prefix={<LockOutlined rev={''} />}
        />
      </Form.Item>
      <Form.Item name='captcha' rules={[{ required: true, message: '请输入验证码' }]}>
        <Input
          autoComplete='captcha'
          placeholder='请输入验证码'
          prefix={<LockOutlined rev={''} />}
          addonAfter={
            captcha?.picPath ? (
              <Image
                style={{ cursor: 'pointer' }}
                preview={false}
                onClick={HandleGetCaptchaCode}
                width={80}
                height={36}
                src={captcha?.picPath}
              />
            ) : (
              <Button type='link' size='small' onClick={HandleGetCaptchaCode}>
                获取验证码
              </Button>
            )
          }
        />
      </Form.Item>
      <Form.Item>
        <div className={styles['login-btn']}>
          <Button
            onClick={() => {
              form.resetFields()
            }}
            icon={<CloseCircleOutlined rev={''} />}
          >
            重 置
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<UserOutlined rev={''} />}
          >
            登 录
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
