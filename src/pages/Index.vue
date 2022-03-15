<template>
  <div class="WAL position-relative bg-grey-4" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn round flat style="cursor: default">
            <q-avatar>
              <img
                v-show="
                  currentConversation == undefined
                    ? null
                    : currentConversation.avatar
                "
                :src="
                  currentConversation == undefined
                    ? null
                    : currentConversation.avatar
                "
              />
            </q-avatar>
          </q-btn>

          <span class="q-subtitle-1 q-pl-md">
            {{
              currentConversation == undefined
                ? null
                : currentConversation.person
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
                <q-item clickable>
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

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(conversation, index) in conv.conversations"
              :key="conversation.id"
              clickable
              v-ripple
              @click="setCurrentConversation(index)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="conversation.avatar" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  {{ conversation.person }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <q-icon name="check" v-if="conversation.sent" />
                  <q-icon name="not_interested" v-if="conversation.deleted" />
                  {{ conversation.caption }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label caption>
                  {{ conversation.time }}
                </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="WAL__chat bg-grey-2">
        <router-view />
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
import { conversationStore } from '../store/conversations';
import { Conversations } from '../components/models';
import { api_getConv } from 'src/api/conversation';
import { api_verify } from 'src/api/login';

export default {
  name: 'IMLayout',

  setup() {
    const router = useRouter();
    const userState = useMainStore();
    const conv = conversationStore();
    const $q = useQuasar();
    const search = ref('');
    const message = ref('');
    const search_indrawer = ref('');
    const Drawer_icon = ref('message');
    const currentConversationIndex = computed(() => {
      return conv.conversations.length == 0 ? ref(-1) : ref(0);
    });
    const currentConversation = computed(() => {
      if (currentConversationIndex.value.value == -1) {
        return {} as Conversations;
      } else {
        return conv.conversations[currentConversationIndex.value.value];
      }
    });

    onMounted(() => {
      void api_verify().then(async (res) => {
        if (res) {
          void api_getConv(router);
        } else {
          await router.replace('/');
        }
      });
    });

    const style = computed(() => ({
      height: String($q.screen.height) + 'px',
    }));

    function setCurrentConversation(index: number) {
      currentConversationIndex.value.value = index;
    }
    function search_InDrawer() {
      if (Drawer_icon.value == 'message') {
        console.log('搜索对话:', search_indrawer.value);
      } else {
        console.log('搜索好友:', search_indrawer.value);
      }
    }
    async function changeDrawer() {
      if (Drawer_icon.value == 'message') {
        Drawer_icon.value = 'group';
      } else {
        Drawer_icon.value = 'message';
        await api_getConv(router).then(() => {
          //返回conversation后，将currentconversation设置为0
          setCurrentConversation(0);
        });
      }
      search_indrawer.value = '';
    }

    return {
      userState,
      search,
      message,
      search_indrawer,
      Drawer_icon,
      currentConversationIndex,
      conv,
      currentConversation,
      setCurrentConversation,
      style,
      search_InDrawer,
      changeDrawer,
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
