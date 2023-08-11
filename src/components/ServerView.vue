<template>
  <div>Server:</div>
  <div class="grid grid-cols-2">
    <div v-for="msg of logicStore.allMsgs" :key="msg.msgID">
      <div
        v-if="msg.status === 'server'"
        class="bg-green-300 m-1"
        @click=";[logicStore.setPaths(msg.msgID), valueStore.setPoint(msg.sensorID)]"
      >
        <div>Msg: {{ msg.msgID }}</div>
        <div>Sensor: {{ msg.sensorID }}</div>
        <div>Status: {{ msg.status }}</div>
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
