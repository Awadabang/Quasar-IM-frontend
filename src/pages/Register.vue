<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Register</div>
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
                  label="Register"
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
import { api_register } from '../api/login';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { AxiosResponse } from 'axios';

export default defineComponent({
  name: 'Login',

  setup() {
    const username = ref('');
    const password = ref('');

    //↓路径信息
    const router = useRouter();

    async function onSubmit() {
      await api_register(username.value, password.value)
        .then(async function (res) {
          if (res.status == 200) {
            Notify.create('注册成功！');
            await router.replace('/');
          }
        })
        .catch(function (err: AxiosResponse) {
          //TODO: 捕获错误
          console.log(err);
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
}
</style>
