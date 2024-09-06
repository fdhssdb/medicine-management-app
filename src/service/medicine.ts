import { get, post, patch, del } from "../utils/request";

const url = "/medicine";
/**
 * 查询药品
 * @param params
 * @returns
 */
export const getListAPI = (params: any) => get(url, params);


export const getOptionsAPI = () => get(`${url}/getOptions`);
/**
 *
 * @param params 新增药品
 * @returns
 */
export const createAPI = (params: any) => post(url, params);

/**
 * 修改药品信息
 * @param params
 * @returns
 */
export const updateAPI = (id: any, params: any) => patch(url, id, params);

/**
 * 删除药品
 * @param params
 * @returns
 */
export const delAPI = (id: any) => del(url, id);
