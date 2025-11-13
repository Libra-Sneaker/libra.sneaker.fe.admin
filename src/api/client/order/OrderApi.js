import { request } from "../../../util/axios/request.helper";

const baseUrl = `/client/orders`;

export class OrderApi {
  // Lấy danh sách đơn hàng của khách hàng hiện tại
  static getMyOrders = () => {
    return request({
      method: "GET",
      url: `${baseUrl}`,
    });
  };

  // Lấy chi tiết đơn hàng theo ID
  static getOrderDetail = (billId) => {
    return request({
      method: "GET",
      url: `${baseUrl}/${billId}`,
    });
  };

  static cancelOrder = (billId, data) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/${billId}/cancel`,
      data,
    });
  };
}

