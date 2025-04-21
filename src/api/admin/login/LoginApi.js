import { request } from "../../../util/axios/request.helper";

const baseUrl = `/auth/login`;

export class LoginApi {
  static login = (data) => {
    return request({
      method: "POST",
      url: baseUrl,
      data: data,
    });
  };
}
