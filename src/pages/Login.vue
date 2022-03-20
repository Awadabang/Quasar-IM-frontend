<!--
 * @Author: your name
 * @Date: 2022-02-19 23:26:58
 * @LastEditTime: 2022-03-20 19:37:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Quasar-IM-frontend\src\pages\Login.vue
-->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-text class="regist q-pr-md q-pt-md" @click="gotoRegister"
            >点此注册</q-text
          >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Sign in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @keyup.enter="onSubmit">
              <q-input filled v-model="username" label="Username" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />

              <div>
                <q-btn
                  label="Login"
                  type="button"
                  color="primary"
                  @click="onSubmit"
                  :disable="!canSubmit"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { api_login } from '../api/login';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useMainStore } from '../store/index';
import { AxiosResponse } from 'axios';
import { baseURL } from 'src/boot/axios';

export default defineComponent({
  name: 'Login',

  setup() {
    const username = ref('');
    const password = ref('');

    //↓路径信息
    const router = useRouter();
    //↓Pinia信息
    const userState = useMainStore();
    //↓ws-url
    const url = `ws://${baseURL}/ws?uid=1&toUid=2`;

    async function onSubmit() {
      await api_login(username.value, password.value)
        .then(async function (res) {
          if (res.status == 200) {
            userState.initUserstate({
              access_token: res.data.access_token,
              user: {
                username: res.data.user.username,
              },
            });
            userState.storageUserinfo();
            Notify.create('登录成功！');
            // 开启Websocket
            const ws = new WebSocket(url);
            ws.onopen = function () {
              console.log('WebSocket is open now.');
            };

            await router.push({
              name: 'index',
            });
          }
        })
        .catch(function (err: AxiosResponse) {
          if (err.status == 400) {
            Notify.create('密码错误！');
          } else if (err.status == 404) {
            Notify.create('用户不存在！');
          }
        });
    }

    async function gotoRegister() {
      await router.push({
        name: 'register',
      });
    }

    const canSubmit = computed(() => {
      const name = username.value.length;
      const pass = password.value.length;
      return Boolean(name && pass);
    });

    return {
      username,
      password,
      onSubmit,
      canSubmit,
      gotoRegister,
    };
  },
});
</script>

<style lang="scss">
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
.regist {
  z-index: 100;
  position: absolute;
  right: 0;
  cursor: pointer;
}
</style>
