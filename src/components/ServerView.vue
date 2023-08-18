<template>
  <div>Server:</div>
  <div class="grid grid-cols-1">
    <div v-for="msg of logicStore.msg.allMsgs" :key="msg.msgID">
      <div
        v-if="msg.status === 'server'"
        :class="logicStore.chosenMsg?.msgID === msg.msgID ? 'bg-green-500 m-1' : 'bg-green-300 m-1'"
        @click=";[logicStore.setPaths(msg.msgID), valueStore.setPoint(msg.sensorID)]"
      >
        <div>Msg: {{ msg.msgID }}</div>
        <div>Sensor: {{ msg.sensorID }}</div>
        <div>Status: {{ msg.status }}</div>
        <div v-for="status of logicStore.msg.server" :key="status.msgID">
          <div v-if="status.msgID === msg.msgID">
            {{ status.msgCnt }} ✉️ Hops: {{ status.hopCnt }} GW: {{ status.secID }}
          </div>
        </div>
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
