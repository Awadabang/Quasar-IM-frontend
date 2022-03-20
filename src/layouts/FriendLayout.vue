<!--
 * @Author: Awadabang
 * @Date: 2022-03-20 20:54:55
 * @LastEditTime: 2022-03-21 01:16:12
 * @LastEditors: Awadabang
 * @Description: Description
 * @FilePath: \Quasar-IM-frontend\src\layouts\FriendLayout.vue
 * 
-->
<template>
  <q-scroll-area style="height: calc(100% - 100px)">
    <q-list>
      <q-item
        v-for="(item, index) in friend.friends"
        :key="item.friend_id"
        clickable
        v-ripple
        @click="setCurrentFriend(index)"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="item.avatar" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">
            {{ item.username }}
          </q-item-label>
          <q-item-label class="conversation__summary" caption>
            <q-icon name="check" v-if="item.sent" />
            <q-icon name="not_interested" v-if="item.deleted" />
            {{ item.caption }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>
            {{ item.time }}
          </q-item-label>
          <q-icon name="keyboard_arrow_down" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts">
import { friendsStore } from '../store/friends';
import { Friends } from '../components/models';
import { ref, computed } from 'vue';

export default {
  name: 'ConvLayout',
  setup() {
    const friend = friendsStore();
    const currentFriendsIndex = computed(() => {
      return friend.friends.length == 0 ? ref(-1) : ref(0);
    });

    friend.currentFriend = computed(() => {
      if (currentFriendsIndex.value.value == -1) {
        return {} as Friends;
      } else {
        return friend.friends[currentFriendsIndex.value.value];
      }
    }).value;

    function setCurrentFriend(index: number) {
      currentFriendsIndex.value.value = index;
      friend.currentFriend = friend.friends[index];
    }

    return {
      friend,
      setCurrentFriend,
    };
  },
};
</script>
