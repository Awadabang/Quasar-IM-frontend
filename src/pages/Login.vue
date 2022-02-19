<template>
  <div
    class="fullscreen bg-blue text-black text-center q-pa-md flex flex-center"
  >
    <div class="q-pa-md">
      <div class="text-h5 q-pb-md">Login</div>
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
      />
    </div>
  </div>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Login',

  setup() {
    const username = ref('');
    const password = ref('');
    function onSubmit() {
      api
        .post('/login', {
          Username: username,
          Password: password,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
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
