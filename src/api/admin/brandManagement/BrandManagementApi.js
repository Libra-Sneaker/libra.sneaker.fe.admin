import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/brandManagement`;

export class BrandManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}`,
      data: data,
    });
  };

  static getBrands = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/get-all-brand`
    });
  };

}
