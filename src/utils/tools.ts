import logo from "../assets/logo.webp";

export const defaultImg = logo;

/**
 * 服务器地址
 */
export const serverUrl =
  "http://127.0.0.1:4523/m1/4036356-0-default";

/**
 *
 * @param token 设置token
 * @returns
 */
export const setToken = (token: string) =>
  sessionStorage.setItem("token", token);
/**
 *
 * @returns 取token
 */
export const getToken = () => sessionStorage.getItem("token");
