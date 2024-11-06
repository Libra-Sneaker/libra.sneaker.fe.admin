import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/file-management`;

export class FileUploadApi {
  static uploadFileImage = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/upload`,
      data: data,
    });
  };
}
