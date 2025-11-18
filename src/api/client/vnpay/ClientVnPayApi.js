import { request } from "../../../util/axios/request.helper";

const baseUrl = "/client/payment/vnpay";

export class ClientVnPayApi {
  static createPayment = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/create`,
      data,
    });
  };
}
