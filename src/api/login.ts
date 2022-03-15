import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { User_State } from 'src/components/models';
import { useMainStore } from '../store/index';
import { Router } from 'vue-router';

const userState = useMainStore();

export async function api_login(
  username: string,
  password: string,
  router: Router
) {
  await api
    .post('/login', {
      username: username,
      password: password,
    })
    .then(async function (res: AxiosResponse<User_State>) {
      console.log(res);

      if (res.status == 200) {
        userState.initUserstate({
          username: res.data.username,
          token: res.data.token,
        });
        userState.storageUserinfo();
        Notify.create('登录成功！');
        await router.push({
          name: 'index',
        });
      } else if (res.status == 400) {
        Notify.create('密码错误！');
      } else if (res.status == 404) {
        Notify.create('用户不存在！');
      }
    });
}

/**
 * 验证token合法
 * @res Boolean 合法=1 不合法=0
 * @returns Boolean 合法=1 不合法=0
 */
export async function api_verify() {
  let flag = false;
  await api.post('/verify').then(function (res: AxiosResponse<User_State>) {
    if (res.status == 200) {
      flag = true;
    }
  });
  return flag;
}
