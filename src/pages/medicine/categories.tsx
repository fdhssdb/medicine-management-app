import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Table,
  Input,
  Space,
  Modal,
  Popconfirm,
  Upload,
  message,
  Image,
} from "antd";
import type { TableProps, GetProp, UploadProps } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getListAPI,
  createAPI,
  updateAPI,
  delAPI,
} from "../../service/medicine";
import { serverUrl } from "../../utils/tools";
import logoImg from "../../assets/logo.webp";

interface DataType {
  key: number;
  id: number;
  name: string;
  pic: string;
  desc: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function MedicineCategories() {
  const [query, setQuery] = useState({ per: 10, page: 1, keywords: "" });
  const [medicineList, setMedicineList] = useState<DataType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>();
  const [open, setOpen] = useState(false);
  const [myForm] = Form.useForm();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "id",
      key: "id",
      dataIndex: "id",
      width: 80,
      align: "center",
    },
    {
      title: "名字",
      key: "name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "主图",
      key: "pic",
      width: 120,
      dataIndex: "pic",
      align: "center",
      render: (value) => (
        <Image
          width={100}
          style={{ maxHeight: "100" }}
          alt="图片"
          src={value ? serverUrl + "/static/" + value : logoImg}
        />
      ),
    },
    {
      title: "简介",
      key: "desc",
      dataIndex: "desc",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={async () => {
              setOpen(true);
              console.log(record);
              myForm.setFieldsValue(record);
              record.pic && setImageUrl(serverUrl + "/static/" + record.pic);
            }}
          />

          <Popconfirm
            title="确认删除吗？"
            onConfirm={async () => {
              await delAPI({ id: record.id });
              refresh();
            }}
          >
            <Button type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
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

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageUrl(reader.result as string));
    reader.readAsDataURL(file);
    return false;
  };

  //刷新列表
  const refresh = () => {
    setQuery({ ...query, keywords: "" });
  };

  useEffect(() => {
    getListAPI(query).then((res: any) => {
      const data = res.list.map((item: any) => ({ key: item.id, ...item }));
      setMedicineList(data);
      setTotal(res.total);
    });
  }, [query]);

  useEffect(() => {
    !open && setImageUrl("");
  }, [open]);

  return (
    <>
      <Modal
        title="编辑"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          myForm.submit();
        }}
        maskClosable={false}
        destroyOnClose
      >
        {/* 一次请求后台同时将多张图片和表单提交到后台。主要策略就是 ： 1.
        图片组件上传不提交 2 。使用FormData来将 图片和表单提交到后台。 */}
        <Form
          form={myForm}
          name="medicineForm"
          labelCol={{ span: 3 }}
          onFinish={async (value: any) => {
            console.log(value);
            let formData = new FormData();
            let { name, pic, desc = "" } = value;
            formData.append("name", name);
            formData.append("pic", pic);
            formData.append("desc", desc);
            if (value.id) {
              await updateAPI(value.id, formData);
            } else {
              await createAPI(formData).then((res) => console.log(res));
            }
            setOpen(false);
            refresh();
          }}
          preserve={false}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: "请输入药品名字" }]}
          >
            <Input placeholder="请输入药品名称" />
          </Form.Item>
          <Form.Item
            label="主图"
            name="pic"
            valuePropName="file"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              maxCount={1}
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
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
              value.keywords ? setQuery({ ...query, ...value }) : refresh();
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
            columns={columns}
            dataSource={medicineList}
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

export default MedicineCategories;
