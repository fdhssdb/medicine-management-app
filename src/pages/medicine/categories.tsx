import React, { useState } from "react";
import { Card, Button, Form, Table, Input, Space, Modal, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import MyUpload from "../../components/MyUpload";
function MedicineCategories() {
  const [open, setOpen] = useState(false);
  const [myForm] = Form.useForm();

  return (
    <>
      <Modal
        title="编辑"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          myForm.submit();
        }}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={myForm}
          name="medicineForm"
          labelCol={{ span: 3 }}
          onFinish={(value: any) => {
            message.success("保存成功");
            console.log(value);
          }}
          preserve={false}
        >
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: "请输入名字" }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
          <Form.Item label="主图" name="image">
            <MyUpload />
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea placeholder="请输入药品简介" />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title="药品分类"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          />
        }
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form
            name="searchForm"
            layout="inline"
            onFinish={(value) => {
              console.log(value);
              message.success("查询成功");
            }}
          >
            <Form.Item label="名字" name="keywords">
              <Input placeholder="请输入关键词" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              />
            </Form.Item>
          </Form>

          <Table
            columns={[
              {
                title: "序号",
                width: 80,
                align: "center",
              },
              {
                title: "名字",
              },
              {
                title: "主图",
                width: 120,
              },
              {
                title: "简介",
              },
              {
                title: "操作",
              },
            ]}
          />
        </Space>
      </Card>
    </>
  );
}

export default MedicineCategories;
