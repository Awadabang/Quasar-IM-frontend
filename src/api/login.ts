import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { Conversations, User_State } from 'src/components/models';
import { useMainStore } from '../store/index';
import { conversationStore } from '../store/conversations';
import { Router } from 'vue-router';

const userState = useMainStore();
const convState = conversationStore();

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

export async function api_verify(userinfo: User_State, router: Router) {
  let conversations = [] as Conversations[];
  await api
    .post('/verify', {
      token: userinfo.token,
    })
    .then(async function (res: AxiosResponse<User_State>) {
      if (res.status == 200) {
        /**
         * 登陆成功情况：
         * 1.登录页用户名密码验证成功->登录成功
         * 2.从index页读取storage，token验证成功->登录成功
         */
        //将localstorage中userinfo存入state中
        userState.initUserstate(userinfo);

        //conversation都要重新拉取，防止消息滞后,这样conversations似乎不需要存入storage
        await api
          .get('/get_conv', {
            params: {
              page_id: 1,
              page_size: 10,
              token: userinfo.token,
            },
          })
          .then(function (res: AxiosResponse<Conversations[]>) {
            convState.initConvState(res.data);
            conversations = res.data;
          });
      } else if (res.status == 404 || res.status == 500) {
        await router.replace('/');
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  return conversations;
}
