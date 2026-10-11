import request from "@/utils/request";
import type { loginDataType, registerDataType, registerResponsetDataType, userInfoDataType } from './type'

// 使用对象字面量替代枚举
export const API = {
    LOGIN_URL: 'user/login',
    REGISTER_URL: 'user/register',
    REGISTER_GETCODE_URL: 'user/getCode',
    FORGET_PASSWORD_URL: '/forgetPassword',
    FORGET_PASSWORD_GETCODE_URL: '/forgetPassword/getCode',
    USERINFO_URL: 'user/userInfo',
};

// 登录接口方法
export const reqLogin = (data: loginDataType) => request.post<any, registerResponsetDataType>(API.LOGIN_URL, data)

// 注册接口方法
export const reqRegister = (data: registerDataType) => request.post<any, registerResponsetDataType>(API.REGISTER_URL, data)

// 获取验证码接口方法
export const reqRegister_code = (data: registerDataType) => request.post<any, any>(API.REGISTER_GETCODE_URL, data)

// 忘记密码接口方法
export const reqForgetPassword = (data: registerDataType) => request.post<any, registerResponsetDataType>(API.FORGET_PASSWORD_URL, data)

// 获取忘记密码验证码接口方法
export const reqForgetPassword_code = (data: registerDataType) => request.post<any, any>(API.FORGET_PASSWORD_GETCODE_URL, data)

// 获取用户信息接口方法
export const reqUserInfo = (data: string) => request.get<any, userInfoDataType>(API.USERINFO_URL, { params: { youxiang: data } })
