import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/productManagement`;

export class ProductManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/create`,
      data: data,
    });
  };
  
  static getProducts = (filter) => {
    return request({
      method: "GET",
      url: `${baseUrl}/search`,
      params: filter
    });
  };

  

}
