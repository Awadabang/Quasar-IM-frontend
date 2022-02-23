import { defineStore } from 'pinia';
import { Conversations } from 'src/components/models';
import { store } from 'quasar/wrappers';
import { LStorage } from '../utils/Storage';
//import { LStorage } from '../utils/Storage';
export default store;

export const conversationStore = defineStore({
  id: 'conv',

  state: () => {
    return {
      conversations: [] as Conversations[],
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
    initConvState(conv: Conversations[]) {
      this.conversations = conv;
    },
    storageConvState() {
      LStorage.set('conv', {
        conversations: this.conversations,
      });
    },
  },
});
