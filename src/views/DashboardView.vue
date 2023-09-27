<template>
  <div class="grid grid-cols-8 grid-rows-6 justify-center m-2 h-screen font-Lato">
    <div class="col-start-1 col-end-9 row-start-1 row-end-4">
      <MapView />
    </div>

    <div
      class="col-start-1 col-end-3 row-start-4 row-end-7 border-2 border-blue-200 m-2 overflow-y-auto h-4/5 rounded-lg bg-blue-200/50"
    >
      <MessagesView />
    </div>

    <div
      class="col-start-3 col-end-5 row-start-4 row-end-7 border-2 border-blue-200 m-2 overflow-y-auto h-4/5 rounded-lg bg-blue-200/50"
    >
      <ServerView />
    </div>
    <div
      class="col-start-5 col-end-7 row-start-4 row-end-7 border-2 border-blue-200 m-2 overflow-y-auto h-4/5 rounded-lg bg-blue-200/50"
    >
      <SensorInputs />
    </div>
    <div
      class="col-start-7 col-end-9 row-start-4 row-end-7 border-2 border-blue-200 my-2 overflow-y-auto h-4/5 rounded-lg bg-blue-200/50"
    >
      <GwInputs />
    </div>
    <div class="col-start-1 col-end-1 row-start-4 row-end-4 mt-3 ml-5">
      <button @click=";[valueStore.reset(), logicStore.resetSystem()]">
        <img :src="reset" class="h-6 hover:h-8" />
      </button>
    </div>

    <a target="_blank" href="https://icons8.com"> icons by Icons8</a>
  </div>
</template>
<script setup lang="ts">
import MapView from '@/components/MapView.vue'
import SensorInputs from '@/components/SensorInputs.vue'
import GwInputs from '@/components/GwInputs.vue'
import MessagesView from '@/components/MessagesView.vue'
import ServerView from '@/components/ServerView.vue'
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
import reset from '@/assets/reset.png'
</script>
