/*
 * @Author: your name
 * @Date: 2022-02-24 00:08:29
 * @LastEditTime: 2022-03-20 18:50:39
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Quasar-IM-frontend\src\api\conversation.ts
 */
import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { Conversations } from 'src/components/models';
import { Router } from 'vue-router';
import { conversationStore } from 'src/store/conversations';

const convState = conversationStore();

/**
 * 请求对话列表
 * @param router
 * @returns conversations[]
 */
export async function api_getConv(router: Router) {
  let conversations = [] as Conversations[];
  await api
    .get('api/v1/get_conv', {
      params: {
        page_id: 1,
        page_size: 10,
      },
    })
    .then(async function (res: AxiosResponse<Conversations[]>) {
      if (res.status == 200) {
        //检查返回的data是否为空
        if (res.data == null) {
          return conversations;
        }
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
