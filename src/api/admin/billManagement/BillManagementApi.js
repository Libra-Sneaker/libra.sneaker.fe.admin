import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/billManagement`;

export class BillManagementApi {

  static search = (filter) => {
    return request({
      method: "GET",
      url: `${baseUrl}/search`,
      params: filter
    });
  };

};
