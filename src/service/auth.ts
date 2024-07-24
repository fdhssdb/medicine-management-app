import { get,post } from "../utils/request";

type LoginData = {
  userName: string;
  passsword: string;
};
/**
 * 管理后台登录接口
 * @param data
 * @returns
 */
export const loginAPI = (data: LoginData) => post("/user/login", data);