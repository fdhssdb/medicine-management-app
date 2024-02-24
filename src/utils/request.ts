import axios from "axios";
import { message } from "antd";
//@ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, serverUrl } from "./tools";

const instance = axios.create({
  baseURL: serverUrl, //请求的基础地址
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
    console.log(response.data);
    const { code, msg } = response.data;
    if (code === 200) {
      return Promise.resolve(response.data);
    } else {
      message.error(msg);
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

export const get = (url: string, params: any = {}) =>
  instance.get(url, { params: params });

export const post = (url: string, params: any = {}) =>
  instance.post(url, params);

export const put = (url: string, params: any = {}) => instance.put(url, params);

export const patch = (url: string, params: any = {}) =>
  instance.patch(url, params);

export const del = (url: string) => instance.delete(url);
