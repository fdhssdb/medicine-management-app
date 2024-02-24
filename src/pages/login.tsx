import React from "react";
import { Card, Button, Form, Input, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { defaultImg, setToken } from "../utils/tools";
import { loginAPI } from "../service/auth";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

type Login = React.FC;

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

function Login() {
  const navigate = useNavigate();

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
              const { msg, data } = res;
              console.log(res);
              message.success(msg);
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
