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
  return await api.post('/verify');
}
