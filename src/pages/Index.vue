<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn round flat style="cursor: default">
            <q-avatar>
              <img
                v-show="
                  friend.currentFriend == {}
                    ? null
                    : friend.currentFriend.avatar
                "
                :src="
                  friend.currentFriend == {}
                    ? null
                    : friend.currentFriend.avatar
                "
              />
            </q-avatar>
          </q-btn>

          <span class="q-subtitle-1 q-pl-md">
            {{
              friend.currentFriend == {} ? null : friend.currentFriend.username
            }}
          </span>

          <q-space />

          <q-btn round flat icon="search" />
          <q-btn round flat>
            <q-icon name="attachment" class="rotate-135" />
          </q-btn>
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Contact data</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Select messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Silence</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Clear messages</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Erase messages</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <span class="q-subtitle-1 q-pl-md">
            {{ userState.getUsername }}
          </span>

          <q-space />

          <q-btn
            round
            flat
            :icon="Drawer_icon"
            @click="changeDrawer"
            name="drawer_icon"
          />
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>添加朋友</q-item-section>
                </q-item>
                <q-item clickable @click="quit">
                  <q-item-section>退出登录</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>

        <q-toolbar class="bg-grey-2">
          <q-input
            rounded
            outlined
            dense
            clearable
            class="WAL__field full-width"
            bg-color="white"
            v-model="search_indrawer"
            :placeholder="Drawer_icon == 'message' ? '搜索对话' : '搜索好友'"
            @keyup.enter="search_InDrawer"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>
        <router-view name="friend" />
      </q-drawer>

      <q-page-container class="WAL__chat bg-grey-2">
        <router-view name="chat" />
      </q-page-container>

      <q-footer>
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            bg-color="white"
            v-model="message"
            placeholder="Type a message"
          />
          <q-btn round flat icon="mic" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '../store/index';
import { api_getConv } from 'src/api/conversation';
import { api_verify } from 'src/api/login';
import { LStorage } from 'src/utils/Storage';
import { AxiosResponse } from 'axios';
import { api_getFriends } from 'src/api/friend';
import { friendsStore } from 'src/store/friends';

export default {
  name: 'IMLayout',

  setup() {
    const router = useRouter();
    const userState = useMainStore();
    const $q = useQuasar();
    const search = ref('');
    const message = ref('');
    const search_indrawer = ref('');
    const Drawer_icon = ref('group');
    const friend = friendsStore();

    onMounted(async () => {
      //直接打开index页面检查localstorage中有无access_token
      //如果没有数据直接跳入login
      //有数据发送veirfy接口验证token合法性，若不合法，删除localstorage，跳至login
      if (LStorage.get('main') != null) {
        void api_verify()
          .then(async (res) => {
            if (res.status == 200) {
              userState.initUserstate(res.data);
              void api_getConv(router);
              void api_getFriends(router);
            } else {
              await router.replace('/');
            }
          })
          .catch(async function (err: AxiosResponse) {
            if (err.status != 200) {
              await quit();

              await router.replace('/');
            }
          });
      } else {
        await router.replace('/');
      }
    });

    const style = computed(() => ({
      height: String($q.screen.height) + 'px',
    }));

    function search_InDrawer() {
      if (Drawer_icon.value == 'message') {
        console.log('搜索对话:', search_indrawer.value);
        //搜索函数↓
      } else {
        console.log('搜索好友:', search_indrawer.value);
      }
    }
    async function changeDrawer() {
      if (Drawer_icon.value == 'message') {
        Drawer_icon.value = 'group';
        await api_getFriends(router);
      } else {
        Drawer_icon.value = 'message';
        await api_getConv(router);
      }
      search_indrawer.value = '';
    }

    /**
     * 退出登录
     * 1.删除localstorage
     * 2.删除pinia
     * 3.跳转至login页
     */
    async function quit() {
      LStorage.clear();
      userState.initUserstate({
        user: {
          username: '',
        },
        access_token: '',
      });
      await router.replace('/');
    }

    return {
      friend,
      userState,
      search,
      message,
      search_indrawer,
      Drawer_icon,
      style,
      search_InDrawer,
      changeDrawer,
      quit,
    };
  },
};
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px

  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    background-color: #009688
  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 950px
    border-radius: 5px
  &__field.q-field--outlined .q-field__control:before
    border: none
  .q-drawer--standard
    .WAL__drawer-close
      display: none
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
