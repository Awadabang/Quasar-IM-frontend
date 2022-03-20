/*
 * @Author: your name
 * @Date: 2022-02-23 16:33:12
 * @LastEditTime: 2022-03-20 18:49:21
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Quasar-IM-frontend\src\api\login.ts
 */
import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { User_State } from 'src/components/models';

/**
 * 登录
 * @param username
 * @param password
 */
export async function api_login(
  username: string,
  password: string
): Promise<AxiosResponse<User_State>> {
  return await api.post('/login', {
    username: username,
    password: password,
  });
}

/**
 * 注册
 * @param username
 * @param password
 */
export async function api_register(
  username: string,
  password: string
): Promise<AxiosResponse<User_State>> {
  return await api.post('/register', {
    username: username,
    password: password,
  });
}

/**
 * 验证token合法
 */
export async function api_verify(): Promise<AxiosResponse<User_State>> {
  return await api.post('api/v1/verify');
}
