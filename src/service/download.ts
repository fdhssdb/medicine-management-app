import { get } from "../utils/request";

/**
 * 下载文件
 * @returns
 * download直接下载/upload/export
 * 文件流方式下载/upload/stream
 */
export const downloadAPI = () => get("/upload/stream", null, "blob");
