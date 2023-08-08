<template>
  <div>Messages:</div>
  <div class="grid grid-cols-2">
    <div v-for="msg of logicStore.allMsgs" :key="msg.msgID">
      <div
        v-if="msg.status !== 'server'"
        :class="[
          logicStore.chosenMsg?.msgID === msg.msgID && logicStore.showPaths
            ? msg.status === 'delivered'
              ? ' bg-emerald-300 m-1 font-bold'
              : 'bg-yellow-300 m-1 font-bold'
            : msg.status === 'delivered'
            ? ' bg-emerald-300 m-1 '
            : 'bg-yellow-300 m-1'
        ]"
        @click=";[logicStore.setPaths(msg.msgID), valueStore.setPoint(msg.sensorID)]"
      >
        <div>Msg: {{ msg.msgID }}</div>
        <div>Sensor: {{ msg.sensorID }}</div>
        <div>Status: {{ msg.status }}</div>
        <div v-for="paths of msg.pathsMsg" :key="paths.dist">hop cnt: {{ paths.hopCnt }}</div>

        <button
          @click="
            ;[
              logicStore.findFirstNode(
                msg.sensorID,
                msg.allSensors,
                msg.allGWs,
                msg.msgID,
                msg.pathsMsg,
                msg.serverMsg
              )
            ]
          "
          class="bg-stone-300 border-2 border-stone-300 m-1 text-black"
        >
          SEND
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
