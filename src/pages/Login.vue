<template>
  <div
    class="fullscreen bg-blue text-black text-center q-pa-md flex flex-center"
  >
    <div class="q-pa-md">
      <div class="text-h3 q-pb-xl">Quasar IM</div>
      <q-input filled v-model="username" placeholder="用户名" :dense="dense" />
      <q-input filled v-model="password" placeholder="密码" :dense="dense" />

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="登录"
        @click="onSubmit"
        no-caps
      >
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { useMainStore } from '../store/index';
import { User_State } from 'src/components/models';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../boot/axios';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'Login',
  setup() {
    const userState = useMainStore();
    const username = ref('');
    const password = ref('');
    //↓路径跳转
    const router = useRouter();
    async function onSubmit() {
      //验证username与password，若满足则执行下面代码，跳转至/index，携带参数：username,token
      await api
        .post('/login', {
          username: username.value,
          password: password.value,
        })
        .then(async function (res: AxiosResponse<User_State>) {
          if (res.status == 200) {
            userState.initUsername({
              username: res.data.username,
              token: res.data.token,
            });
            userState.storageUserinfo();
            Notify.create('登录成功！');
            await router.push({
              name: 'index',
            });
          } else if (res.status == 400) {
            Notify.create('密码错误！');
          } else if (res.status == 404) {
            Notify.create('用户不存在！');
          }
        });
      // await router.push({
      //   name: 'index',
      //   params: {
      //     username: username.value,
      //     token: '',
      //   },
      // });
    }

    return {
      username,
      password,
      onSubmit,
    };
  },
});
</script>
