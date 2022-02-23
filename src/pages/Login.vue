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
import { defineComponent, ref } from 'vue';
import { api_login } from '../api/login';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    //↓路径信息
    const router = useRouter();
    function onSubmit() {
      //验证username与password，若满足则执行下面代码，跳转至/index，携带参数：username,token
      api_login(username.value, password.value, router).catch((res) => {
        console.log(res);
      });
    }

    return {
      username,
      password,
      onSubmit,
    };
  },
});
</script>
