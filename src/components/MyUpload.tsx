import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";

interface MyUploadProps {
  id?: string;
  value?: any;
  onChange?: (value: string) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

const MyUpload: React.FC<MyUploadProps> = ({ value, onChange }: any) => {
  const [imageUrl, setImageUrl] = useState();

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
    reader.addEventListener("load", () => onChange(reader.result as string));
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      maxCount={1}
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      {value ? (
        <img src={ value || imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default MyUpload;
