/*
 * @Author: Awadabang
 * @Date: 2022-02-24 00:40:35
 * @LastEditTime: 2022-03-21 01:12:15
 * @LastEditors: Awadabang
 * @Description: Description
 * @FilePath: \Quasar-IM-frontend\src\api\friend.ts
 *
 */
import { api } from '../boot/axios';
import { AxiosResponse } from 'axios';
import { Friends } from 'src/components/models';
import { Router } from 'vue-router';
import { friendsStore } from 'src/store/friends';

const friendsState = friendsStore();

/**
 * 请求好友列表
 * @param router
 * @returns conversations[]
 */
export async function api_getFriends(router: Router) {
  await api
    .get('api/v1/get_friends', {
      params: {
        page_id: 1,
        page_size: 10,
      },
    })
    .then(async function (res: AxiosResponse<Friends[]>) {
      if (res.status == 200) {
        friendsState.initFriendState(res.data);
      } else if (res.status == 404 || res.status == 500) {
        await router.replace('/');
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
