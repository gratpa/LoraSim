<template>
  <div class="grid grid-cols-8 grid-rows-6 justify-center m-2 h-screen">
    <div class="col-start-1 col-end-9 row-start-1 row-end-4">
      <MapView />
    </div>
    <div class="col-start-1 col-end-3 row-start-4 row-end-7 overflow-y-auto h-4/5 my-2">
      <UserInterface />
    </div>

    <div
      class="col-start-3 col-end-4 row-start-4 row-end-7 border-2 border-black m-2 overflow-y-auto h-4/5"
    >
      <MessagesView />
    </div>

    <div
      class="col-start-4 col-end-5 row-start-4 row-end-7 border-2 border-black m-2 overflow-y-auto h-4/5"
    >
      <ServerView />
    </div>
    <div
      class="col-start-5 col-end-7 row-start-4 row-end-7 border-2 border-black m-2 overflow-y-auto h-4/5"
    >
      <SensorInputs />
    </div>
    <div
      class="col-start-7 col-end-9 row-start-4 row-end-7 border-2 border-black my-2 overflow-y-auto h-4/5"
    >
      <GwInputs />
    </div>
  </div>
</template>
<script setup lang="ts">
import MapView from '@/components/MapView.vue'
import SensorInputs from '@/components/SensorInputs.vue'
import GwInputs from '@/components/GwInputs.vue'
import UserInterface from '@/components/UserInterface.vue'
import MessagesView from '@/components/MessagesView.vue'
import ServerView from '@/components/ServerView.vue'
</script>
