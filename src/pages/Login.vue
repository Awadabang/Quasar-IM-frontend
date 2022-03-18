<template>
  <div
    class="fullscreen bg-blue text-black text-center q-pa-md flex flex-center"
  >
    <div class="q-pa-md" @keyup.enter="onSubmit">
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
        :disable="!canSubmit"
      >
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { api_login } from '../api/login';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useMainStore } from '../store/index';

export default defineComponent({
  name: 'Login',

  setup() {
    const username = ref('');
    const password = ref('');

    //↓路径信息
    const router = useRouter();
    //↓Pinia信息
    const userState = useMainStore();

    async function onSubmit() {
      await api_login(username.value, password.value).then(async function (
        res
      ) {
        if (res.status == 200) {
          userState.initUserstate({
            access_token: res.data.access_token,
            user: {
              username: res.data.user.username,
            },
          });
          userState.storageUserinfo();
          Notify.create('登录成功！');
          await router.replace({
            name: 'index',
          });
        } else if (res.status == 400) {
          Notify.create('密码错误！');
        } else if (res.status == 404) {
          Notify.create('用户不存在！');
        }
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
    };
  },
});
</script>

<style lang="scss"></style>
