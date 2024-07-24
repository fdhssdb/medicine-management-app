import React, { useState } from "react";
import { Card, Button, Form, Input, Row, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { defaultImg, setToken } from "../utils/tools";
import { loginAPI } from "../service/auth";

type FieldType = {
  username?: string;
  password?: string;
  code?: string;
  remember?: string;
};

type Login = React.FC;

function Login() {
  const [captcha, setCaptcha] = useState("/api/user/code");
  const navigate = useNavigate();

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row>
      <Col md={{ span: 8, push: 8 }} xs={{ span: 22, push: 1 }}>
        <img
          src={defaultImg}
          style={{
            display: "block",
            margin: "20px auto",
            borderRadius: "16px",
            width: "150px",
          }}
        />

        <Card title="好大夫管理系统">
          <Form
            name="basic"
            labelCol={{ md: { span: 4 } }}
            initialValues={{ remember: true }}
            onFinish={async (values: any) => {
              const res: any = await loginAPI(values);
              const { data } = res;
              console.log(res);
              setToken(data);
              navigate("/admin/dashboard");
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="用户名"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item<FieldType>
              label="密 码"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item<FieldType>
              label="验证码"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your identifying code!",
                },
              ]}
            >
              <Space align="start">
                <Input placeholder="请输入验证码" />
                <img
                  src={captcha}
                  alt="验证码"
                  style={{
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    setCaptcha("/api/user/code" + "?" + Math.random());
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
