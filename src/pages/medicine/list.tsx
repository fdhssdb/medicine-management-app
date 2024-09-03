import { useState, useEffect } from "react";
import { Form, Button, Table, Card, Input, Space, Modal, Select } from "antd";
import type { FormProps, TableProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MyEditor from "../../components/MyEditor";
import MyUpload from "../../components/MyUpload";

type DataType = {
  name?: string;
};

interface ListType {
  id: number;
  name: string;
  pic: string;
  price: number;
  inventory: number;
  desc: string;
}

type FieldType = {
  name: string;
  pic?: string;
  desc?: string;
};

function MedicineList() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [list, setList] = useState([]);
  const [html, setHtml] = useState("");

  const columns: TableProps<ListType>["columns"] = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "名字",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "主图",
      dataIndex: "pic",
      key: "pic",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "库存",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "简介",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} />
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const onFinish: FormProps<DataType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  useEffect(() => {}, [open]);

  return (
    <>
      <Modal
        title="药品信息"
        destroyOnClose
        style={{ minWidth: "850px" }}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="medicineInfo"
          preserve={false}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: "请输入名称！" }]}
          >
            <Input placeholder="请输入名字" />
          </Form.Item>
          <Form.Item label="分类" name="kind">
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
                { value: "disabled", label: "Disabled", disabled: true },
              ]}
            />
          </Form.Item>
          <Form.Item label="图片" name="pic">
            <MyUpload value={imageUrl} onChange={setImageUrl} />
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea placeholder="请输入简介" />
          </Form.Item>
          <Form.Item label="详情" name="detail">
            <MyEditor value={html} onChange={setHtml} />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title="药品信息"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          />
        }
      >
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Form
            name="searchForm"
            {...formLayout}
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<DataType> label="名称" name="name">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              />
            </Form.Item>
          </Form>
          <Table columns={columns} dataSource={list} />
        </Space>
      </Card>
    </>
  );
}

export default MedicineList;
