<template>
  <div class="text-center font-medium text-lg text-amber-500">Messages</div>
  <div class="grid grid-cols-1">
    <div v-for="msg of logicStore.msg.allMsgs" :key="msg.msgID">
      <Transition
        leave-to-class="translate-x-[150%] opacity-0"
        leave-active-class="transition duration-300"
      >
        <div
          class="m-1 rounded-lg grid grid-cols-5 grid-rows-3 h-30"
          v-if="msg.status !== 'server'"
          :class="[
            logicStore.chosenMsg?.msgID === msg.msgID && logicStore.paths.showPaths
              ? msg.status === 'delivered'
                ? ' bg-yellow-400  hover:bg-yellow-400 '
                : msg.status === 'fail'
                ? ' bg-red-400  hover:bg-red-400 '
                : msg.status === ''
                ? ' bg-stone-400    hover:bg-stone-400 '
                : ' bg-yellow-400  hover:bg-yellow-400  '
              : msg.status === 'delivered'
              ? ' bg-yellow-300  hover:bg-yellow-400 '
              : msg.status === 'fail'
              ? ' bg-red-300   hover:bg-red-400 '
              : msg.status === ''
              ? ' bg-stone-300  hover:bg-stone-400 '
              : ' bg-yellow-300   hover:bg-yellow-400 '
          ]"
          @click=";[logicStore.setPaths(msg.msgID), valueStore.setPoint(msg.sensorID)]"
        >
          <div class="col-start-1 col-end-1 row-start-1 row-end-1">Msg:</div>
          <div class="col-start-2 col-end-2 row-start-1 row-end-1">{{ msg.msgID }}</div>
          <div class="col-start-1 col-end-2 row-start-2 row-end-2">Sensor:</div>
          <div class="col-start-2 col-end-3 row-start-2 row-end-2">{{ msg.sensorID }}</div>
          <div class="col-start-1 col-end-2 row-start-3 row-end-3">Status:</div>
          <div class="col-start-2 col-end-3 row-start-3 row-end-3">{{ msg.status }}</div>

          <button
            class="col-start-5 col-end-6 row-start-3 row-end-3 ml-10 motion-safe:hover:translate-x-0.5 motion-safe:transition"
            v-if="msg.status === ''"
            @click="
              ;[
                logicStore.findFirstNode(
                  msg.sensorID,
                  msg.allSensors,
                  msg.allGWs,
                  msg.msgID,
                  msg.serverMsg,
                  msg.pathsMsg
                )
              ]
            "
          >
            <img src="/src/assets/send.png" class="h-8" />
          </button>
          <div class="col-start-3 col-end-4 row-start-1 row-end-1">Time</div>
          <input
            class="mt-1 mb-1 w-8 col-start-5 col-end-5 row-start-1 row-end-1 h-5 backdrop-contrast-125 bg-white/60 rounded-md text-center"
            v-model.number="msg.time"
          />
          <div class="col-start-3 col-end-5 row-start-2 row-end-2">Max hop counter</div>
          <input
            class="mt-1 mb-1 w-8 col-start-5 col-end-5 row-start-2 row-end-2 h-5 backdrop-contrast-125 bg-white/60 rounded-md text-center"
            v-model.number="msg.hopCntMax"
          />
          <div class="col-start-3 col-end-5 row-start-3 row-end-3">Max retry counter</div>
          <input
            class="mt-1 mb-1 w-8 col-start-5 col-end-5 row-start-3 row-end-3 h-5 backdrop-contrast-125 bg-white/60 rounded-md text-center"
            v-model.number="msg.retryCntMax"
          /></div
      ></Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
