<template>
  <div class="text-center font-medium text-lg text-amber-500">Server</div>
  <div class="grid grid-cols-2">
    <div v-for="msg of logicStore.msg.allMsgs" :key="msg.msgID">
      <Transition
        enter-from-class="-translate-x-[150%] opacity-0"
        enter-active-class="transition duration-300"
      >
        <div
          v-if="msg.status === 'server'"
          :class="
            logicStore.chosenMsg?.msgID === msg.msgID
              ? 'bg-green-500 m-1  rounded-lg'
              : 'bg-green-300 m-1  rounded-lg'
          "
          @click=";[logicStore.setPaths(msg.msgID), valueStore.setPoint(msg.sensorID)]"
          class="grid grid-rows-4 h-24"
        >
          <div class="row-start-1 row-end-1 ml-2">Msg:</div>
          <div class="row-start-1 row-end-1 mr-10">{{ msg.msgID }}</div>
          <div class="row-start-2 row-end-2 ml-2">Sensor:</div>
          <div class="row-start-2 row-end-2 mr-10">{{ msg.sensorID }}</div>

          <div
            v-for="status of logicStore.msg.server"
            :key="status.msgID"
            class="col-start-1 col-end-2 row-start-3 row-end-3 ml-2"
          >
            <div v-if="status.msgID === msg.msgID">
              {{ status.msgCnt }} ✉️ Hops: {{ status.hopCnt }} GW: {{ status.secID }}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
import { useValueStore } from '@/stores/valueStore'

const valueStore = useValueStore()
</script>
