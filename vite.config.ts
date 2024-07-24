import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 本地运行配置，及反向代理配置
  server: {
    port: 8888, //前端服务启动的端口号
    host: "localhost", //前端服务启动后的访问ip，默认为localhost, host和port组成了前端服务启动后的访问入口。
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      "/api": {
        //代理标识，一般是每个接口前相同的部分
        target: "http://localhost:3000", // 通过代理接口实际访问的地址。  
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 将api替换为空
      },
    },
  },
});
