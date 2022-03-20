/*
 * @Author: Awadabang
 * @Date: 2022-03-20 20:20:57
 * @LastEditTime: 2022-03-21 01:11:56
 * @LastEditors: Awadabang
 * @Description: Description
 * @FilePath: \Quasar-IM-frontend\src\store\friends.ts
 *
 */

import { defineStore } from 'pinia';
import { Friends } from 'src/components/models';
import { store } from 'quasar/wrappers';

export default store;

export const friendsStore = defineStore({
  id: 'friends',

  state: () => {
    return {
      friends: [] as Friends[],
      currentFriend: {} as Friends,
    };
  },

  /**
   * 类似于组件的computed用来封装计算属性，有缓存的功能
   */
  getters: {},

  /**
   * 类似于组建的methods，封装业务逻辑，修改state
   */
  actions: {
    initFriendState(friends: Friends[]) {
      this.friends = friends;
    },
  },
});
