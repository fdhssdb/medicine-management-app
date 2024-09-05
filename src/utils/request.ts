import axios, { ResponseType } from "axios";
import { message } from "antd";
//@ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "./tools";

const instance = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true, // withCredentials表示跨域请求时是否需要使用凭证
});

//发起请求之前执行
instance.interceptors.request.use(
  (config) => {
    // const token = store.getState.token;
    // token && (config.headers.Authorization = token);
    config.headers.token = getToken();
    NProgress.start();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//请求返回之后执行
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    if (
      response.headers &&
      response.headers["content-type"] === "application/octet-stream"
    ) {
      console.log("下载文件");
      return Promise.resolve(response.data);
    }
    const { data, code, msg } = response.data;
    if (code === 200) {
      message.success(msg);
      return Promise.resolve(data);
    } else {
      message.error("有错误:" + msg);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    NProgress.done();
    console.log(error.response);
    // 超出 2xx 范围的状态码都会触发该函数。
    if (error.response.status) {
      switch (error.response.status) {
        case 404:
          message.error("网络请求不存在");
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

//params给默认值
export const get = (
  url: string,
  params?: any,
  responseType: ResponseType | undefined = "json"
) => instance.get(url, { params: params, responseType: responseType });

export const post = (url: string, params: any) => instance.post(url, params);

export const put = (url: string, params: any) => instance.put(url, params);

export const patch = (url: string, id: any, params: any) =>
  instance.patch(url + "/" + id, params);

export const del = (url: string, params: any) =>
  instance.delete(url + "/" + params.id);
