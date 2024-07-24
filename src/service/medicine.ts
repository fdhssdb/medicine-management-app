import { get, post, patch, del } from "../utils/request";

/**
 * 查询药品
 * @param params
 * @returns
 */
export const getListAPI = (params: any) => get("/medicine", params);

/**
 *
 * @param params 新增药品
 * @returns
 */
export const createAPI = (params: any) => post("/medicine", params);

/**
 * 修改药品信息
 * @param params 
 * @returns 
 */
export const updateAPI = (id: any,params: any) => patch("/medicine",id, params);

/**
 * 删除药品
 * @param params 
 * @returns 
 */
export const delAPI = (params: any) => del("/medicine", params);
