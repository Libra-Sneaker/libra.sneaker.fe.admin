import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/brandManagement`;

export class BrandManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/create`,
      data: data,
    });
  };

  static getBrands = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/get-all-brand`
    });
  };

  static deleteBrands = (id) => {
    return request({
      method: "DELETE",
      url: `${baseUrl}/delete/${id}`,
    });
  };

  static updateBrands = (id, data) => {
    return request({
        method: "PUT",
        url: `${baseUrl}/update`, 
        data: data,
    });
};

}
