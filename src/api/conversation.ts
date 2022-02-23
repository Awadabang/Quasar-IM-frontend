import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { Conversations } from 'src/components/models';
import { Router } from 'vue-router';
import { conversationStore } from 'src/store/conversations';

const convState = conversationStore();

export async function api_getConv(token: string, router: Router) {
  let conversations = [] as Conversations[];
  await api
    .get('/get_conv', {
      params: {
        page_id: 1,
        page_size: 10,
        token: token,
      },
    })
    .then(async function (res: AxiosResponse<Conversations[]>) {
      if (res.status == 200) {
        //conversation都要重新拉取，防止消息滞后,这样conversations似乎不需要存入storage
        convState.initConvState(res.data);
        conversations = res.data;
      } else if (res.status == 404 || res.status == 500) {
        await router.replace('/');
      }
    })
    .catch(function (err) {
      console.log(err);
    });

  return conversations;
}
