import { downloadAPI } from "../service/download";
import { Button } from "antd";

function DashBoard() {
  //Axios responseType需要返回arrayBuffer/Blob
  const downloadFile = async () => {
    //Blob对象通常是由一个或多个ArrayBuffer对象组成的数组，每个ArrayBuffer对象都包含文件数据的一部分。
    await downloadAPI().then((res: any) => {
      const blob = new Blob([res]);
      //将Blob、File等二进制文件转换为浏览器可以直接显示的URL地址，从而方便进行展示、下载等操作
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "xiaoman.zip";
      a.click();
    });
  };

  return (
    <div>
      <Button onClick={downloadFile}>下载</Button>
    </div>
  );
}

export default DashBoard;
