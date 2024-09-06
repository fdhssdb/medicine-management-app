import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Card,
  Input,
  Space,
  Modal,
  Select,
  Upload,
  message,
  InputNumber,
  Image,
  Popconfirm,
} from "antd";
import type { FormProps, TableProps, InputNumberProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { GetProp, UploadProps } from "antd";
import MyEditor from "../../components/MyEditor";
import { createAPI, delAPI, getListAPI, updateAPI } from "../../service/list";
import { getOptionsAPI } from "../../service/medicine";
import { serverUrl } from "../../utils/tools";
import logoImg from "../../assets/logo.webp";

type DataType = {
  keywords?: string;
};

type ListType = {
  id: number;
  name: string;
  pic: string;
  price: number;
  inventory: number;
  desc: string;
  [ProperName: string]: any;
};

type FieldType = {
  name: string;
  pic?: string;
  desc?: string;
};

type optionType = {
  value: any;
  label: string;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function MedicineList() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState<number>();
  const [html, setHtml] = useState("");
  const [query, setQuery] = useState({ per: 10, page: 1, keywords: "" });
  const [options, setOptions] = useState<optionType[]>([]);
  const [myForm] = Form.useForm();
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
      render: (value) => (
        <Image
          src={value ? serverUrl + "/static/" + value : logoImg}
          width={100}
          style={{ maxHeight: "100" }}
          alt="图片"
        />
      ),
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
      title: "分类",
      dataIndex: "medicine",
      key: "medicine",
      render: (value) => {
        return value.name;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              const data = {
                ...record,
                medicine: record.medicine.id,
              };
              myForm.setFieldsValue(data);
              record.pic && setImageUrl(serverUrl + "/static/" + record.pic);
            }}
          />
          <Popconfirm
            title="确认删除吗？"
            onConfirm={async () => {
              console.log(typeof record.id);
              await delAPI(record.id).then((res) => console.log(res));
              refresh();
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  //刷新列表
  const refresh = () => {
    setQuery({ ...query });
  };

  //搜索框
  const search: FormProps<DataType>["onFinish"] = (values) => {
    console.log("Success:", values);
    values.keywords ? setQuery({ ...query, ...values }) : refresh();
  };

  //新增&编辑
  const edit: FormProps<ListType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const { id } = values;
    let formData = new FormData();
    Object.keys(values).forEach((item) => {
      formData.append(item, values[item]);
    });
    console.log(formData);
    if (id) {
      await updateAPI(id, formData).then((res) => refresh());
    } else {
      await createAPI(formData).then((res) => refresh());
    }
    setOpen(false);
  };

  const handleOk = () => {
    myForm.submit();
    refresh();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageUrl(reader.result as string)
      );
      reader.readAsDataURL(file);
    }
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.file;
  };

  const handleNumberChange: InputNumberProps["onChange"] = (value: any) => {
    console.log("changed", value);
  };

  const handleAmountChange: InputNumberProps["onChange"] = (value: any) => {
    console.log("changed", value);
  };

  useEffect(() => {
    getListAPI(query).then((res: any) => {
      const data = res.list.map((item: any) => ({ key: item.id, ...item }));
      setList(data);
      setTotal(res.total);
    });
  }, [query]);

  useEffect(() => {
    const result: optionType[] = [];
    getOptionsAPI().then((res: any) => {
      res.options.forEach((item: any) => {
        result.push({ value: item.id, label: item.name });
      });
      setOptions(result);
    });
  }, []);

  useEffect(() => {
    !open && setImageUrl("");
  }, [open]);

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
          form={myForm}
          preserve={false}
          onFinish={edit}
          autoComplete="off"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item hidden name="id"></Form.Item>
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: "请输入名称！" }]}
          >
            <Input placeholder="请输入名字" />
          </Form.Item>
          <Form.Item label="分类" name="medicine">
            <Select
              style={{ width: 120 }}
              options={options}
            />
          </Form.Item>
          <Form.Item label="图片" name="pic" getValueFromEvent={normFile}>
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="price" label="价格">
            <InputNumber<number>
              min={0}
              step={0.01}
              addonAfter="¥"
              onChange={handleNumberChange}
            />
          </Form.Item>
          <Form.Item name="amount" label="库存">
            <InputNumber<number>
              min={0}
              step={1}
              onChange={handleAmountChange}
            />
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
            onFinish={search}
            autoComplete="off"
          >
            <Form.Item<DataType> label="名称" name="keywords">
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
          <Table
            columns={columns}
            dataSource={list}
            pagination={{
              onChange: (page) => setQuery({ ...query, page: page }),
              hideOnSinglePage: true,
              total: total,
            }}
          />
        </Space>
      </Card>
    </>
  );
}

export default MedicineList;
