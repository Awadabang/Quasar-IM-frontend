/*
 * @Author: your name
 * @Date: 2022-02-19 23:26:58
 * @LastEditTime: 2022-03-20 14:01:44
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Quasar-IM-frontend\src\store\index.ts
 */
import { defineStore } from 'pinia';
import { User_State } from 'src/components/models';
import { store } from 'quasar/wrappers';
import { LStorage } from 'src/utils/Storage';
export default store;

export const useMainStore = defineStore({
  id: 'main',

  /**
   * 类似于组件的data，用来存储全局状态的
   * 1.必须是函数：这是为了在服务端渲染的时候避免交叉请求导致的主句状态污染
   * 2.必须是箭头函数，这是为了更好的ts类型更改
   *
   */

  state: (): User_State => {
    return {
      user: {
        username: '',
      },
      access_token: '',
    };
  },

  /**
   * 类似于组件的computed用来封装计算属性，有缓存的功能
   */
  getters: {
    getUsername(): string {
      return this.user.username;
    },
    getToken(): string {
      return this.access_token;
    },
  },

  /**
   * 类似于组建的methods，封装业务逻辑，修改state
   */
  actions: {
    initUserstate(userState: User_State) {
      this.user.username = userState.user.username;
      this.access_token = userState.access_token;
    },
    storageUserinfo() {
      LStorage.set('main', {
        access_token: this.access_token,
        user: {
          username: this.user.username,
        },
      } as User_State);
    },
  },
});
