/*
 * @Author: Awadabang
 * @Date: 2022-02-19 23:26:58
 * @LastEditTime: 2022-03-20 23:35:09
 * @LastEditors: Awadabang
 * @Description: Description
 * @FilePath: \Quasar-IM-frontend\src\components\models.ts
 *
 */
export interface User_State {
  access_token: string;
  user: {
    username: string;
  };
}

export interface Conversations {
  id: number;
  person: string;
  avatar: string;
  caption: string;
  time: string;
  sent: boolean;
}

export interface Friends {
  friend_id: number;
  username: string;
  avatar: string;
  caption: string;
  time: string;
  sent: boolean;
}
