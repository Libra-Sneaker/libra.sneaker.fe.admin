import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/typeManagement`;

export class TypeOfShoeManagementApi {
  static create = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}`,
      data: data,
    });
  };

  static getTypeOfShoe = () => {
    return request({
      method: "GET",
      url: `${baseUrl}/get-all-type`,
    });
  };
}
