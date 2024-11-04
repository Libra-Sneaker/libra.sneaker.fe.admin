import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/typeManagement`;

export class TypeOfShoeManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/create`,
      data: data,
    });
  };

  static getTypeOfShoe = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/get-all-type`,
    });
  };

  // Phương thức cập nhật loại giày
  static updateTypeOfShoe = (id, data) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/update`,
      data: data,
    });
  };

  // Phương thức cập nhật loại giày
  static updateStatusTypeOfShoe = (id, status) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/updateStatus`,
      params: {id,status},
    });
  };

  // Phương thức xóa loại giày
  static deleteTypeOfShoe = (id) => {
    return request({
      method: "DELETE",
      url: `${baseUrl}/delete/${id}`,
    });
  };
}
