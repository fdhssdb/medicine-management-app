import { get, post, patch, del } from "../utils/request";

const url = "/list";

export const getListAPI = (params: any) => get(url, params);

export const createAPI = (params: any) => post(url, params);

export const updateAPI = (id: number, params: any) => patch(url, id, params);

export const delAPI = (id: number) => del(url, id);
