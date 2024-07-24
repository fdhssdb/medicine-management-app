import logo from "../assets/logo.webp";

export const defaultImg = logo;

/**
 * 服务器地址
 */
export const serverUrl = "http://localhost:3000";

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
