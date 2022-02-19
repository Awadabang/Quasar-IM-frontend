import { defineStore } from 'pinia';
import { createPinia } from 'pinia';

const createStore = createPinia;
export default createStore;

export const useMainStore = defineStore('main', {
  /**
   * 类似于组件的data，用来存储全局状态的
   * 1.必须是函数：这是为了在服务端渲染的时候避免交叉请求导致的主句状态污染
   * 2.必须是箭头函数，这是为了更好的ts类型更改
   *
   */

  state: () => {
    return {
      count: 100,
      foo: 1,
    };
  },

  /**
   * 类似于组件的computed用来封装计算属性，有缓存的功能
   */
  getters: {},

  /**
   * 类似于组建的methods，封装业务逻辑，修改state
   */
  actions: {},
});
