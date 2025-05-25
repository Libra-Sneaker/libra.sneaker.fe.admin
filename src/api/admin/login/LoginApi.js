import { request } from "../../../util/axios/request.helper";

const baseUrl = `/auth`;

export class LoginApi {
  static login = (data) => {
    return request({
      method: "POST",
      url: `${baseUrl}/login`,
      data: data,
    });
  };

  static changePassword = (data) => {
    return request({
      method: "PUT",
      url: `${baseUrl}/change-password`,
      data: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  };
}
