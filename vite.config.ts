import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件 server:开发环境 build:生产环境
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。loadEnv(mode, process.cwd(),'')
  //loadEnv方法接收三个参数 mode：模式,envDir：环境变量配置文件所在目录,prefix：环境变量前缀
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
    // 本地运行配置，及反向代理配置
    server: {
      port: 8888, //前端服务启动的端口号
      host: "localhost", //前端服务启动后的访问ip，默认为localhost, host和port组成了前端服务启动后的访问入口。
      cors: true, // 默认启用并允许任何源
      open: true, // 在服务器启动时自动在浏览器中打开应用程序
      //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        [env.VITE_BASE_URL]: {
          //代理标识，一般是每个接口前相同的部分
          target: env.VITE_HTTP, // 通过代理接口实际访问的地址。
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""), // 将api替换为空
        },
      },
    },
  };
});
