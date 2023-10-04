<template>
  <div class="text-center font-medium text-lg text-amber-500">Server</div>
  <div class="grid grid-cols-1">
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
        >
          <div>Msg: {{ msg.msgID }}</div>

          <div>Sensor: {{ msg.sensorID }}</div>

          <div v-for="status of logicStore.msg.server" :key="status.msgID">
            <div v-if="status.msgID === msg.msgID">
              {{ status.msgCnt }} ✉️ Hops: {{ status.hopCnt }}

              GW: {{ status.secID }}
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
