import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/billManagement`;

export class BillManagementApi {
  static create = () => {
    return request({
      method: "POST",
      url: `${baseUrl}/create`,
    });
  };

  static search = (filter) => {
    return request({
      method: "GET",
      url: `${baseUrl}/search`,
      params: filter,
    });
  };

  static getBillWithStatus = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/getBillWithStatus`,
    });
  };

  static getBillAvailable = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/getBillAvailable`,
    });
  };

  static infoBill = (id) => {
    return request({
      method: "GET",
      url: `${baseUrl}/infoBill/${id}`,
    });
  };

  static updateDeleteFlag = (id) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/updateDeleteFlag/${id}`,
    });
  };

  // Phương thức update mới để gửi toàn bộ thông tin hóa đơn
  static update = (billData) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/update`,
      data: billData, // Gửi toàn bộ dữ liệu trong body
    });
  };
}
