import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/materialManagement`;

export class MaterialManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}`,
      data: data,
    });
  };

  static getMaterial = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/get-all-materials`
    });
  };

}
