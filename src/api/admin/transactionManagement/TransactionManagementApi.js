import { request } from "../../../util/axios/request.helper";

const baseUrl = `/admin/transactionManagement`;

export class TransactionManagementApi {

  static getTransaction = (id) => {
    return request({
      method: "GET",
      url: `${baseUrl}/transaction/${id}`,
    });
  };

};
