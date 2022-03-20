/*
 * @Author: Awadabang
 * @Date: 2022-02-19 23:26:58
 * @LastEditTime: 2022-03-20 23:28:14
 * @LastEditors: Awadabang
 * @Description: Description
 * @FilePath: \Quasar-IM-frontend\src\router\routes.ts
 *
 */
import { RouteRecordRaw } from 'vue-router';
import FriendLayout from 'layouts/FriendLayout.vue';
import ChatLayout from 'pages/Chat.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('pages/Login.vue'),
        children: [],
      },
      {
        name: 'register',
        path: 'register',
        component: () => import('pages/Register.vue'),
        children: [],
      },
      {
        path: 'index',
        meta: { requiresAuth: true },
        component: () => import('pages/Index.vue'),
        children: [
          {
            path: '',
            name: 'index',
            components: {
              friend: FriendLayout,
              chat: ChatLayout,
            },
            children: [],
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
