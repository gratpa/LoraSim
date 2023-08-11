<template>
  <div
    v-for="gw of valueStore.gw.allGWs"
    :key="gw.id"
    v-show="valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit"
    class="bg-cyan-800 text-cyan-100 border-4 border-cyan-800 m-1 col-start-1 col-end-1"
  >
    Set new range:
    <input
      class="border-black border-2 text-black m-1 col-start-1 col-end-1"
      v-model.number="gw.range"
    />
    <input
      class="m-1 col-start-1 col-end-1"
      type="range"
      v-model.number="gw.range"
      min="0"
      max="10000"
    />
  </div>

  <div
    v-for="sensor of valueStore.sensor.allSensors"
    :key="sensor.id"
    v-show="valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit"
    class="bg-cyan-800 text-cyan-100 border-4 border-cyan-800 m-1"
  >
    Set new range:
    <input class="border-black border-2 text-black m-1" v-model.number="sensor.range" />
    <input class="m-1" type="range" v-model.number="sensor.range" min="0" max="20000" />

    <div>
      <textarea class="border-black border-2" :value="input"></textarea>
    </div>

    <button
      @click="logicStore.buildMsg(sensor.id, valueStore.sensor.allSensors, valueStore.gw.allGWs)"
      class="bg-green-300 border-2 border-green-300 m-1 text-black"
    >
      ADD MESSAGE
    </button>
  </div>

  <div>
    <button
      @click=";[valueStore.reset(), logicStore.resetSystem()]"
      class="bg-red-300 border-2 border-red-300 m-1"
    >
      RESET
    </button>
    <div>Set time:</div>
    <input class="border-black border-2 text-black m-1 w-10" v-model.number="logicStore.timeSet" />

    <div>Set max retry counter:</div>
    <input
      class="border-black border-2 text-black m-1 w-10"
      v-model.number="logicStore.retryCntMax"
    />
  </div>
  <div>{{ logicStore.msgStatus }}</div>
  <div v-for="retryMsg of logicStore.retryMsg" :key="retryMsg.retry">
    From:{{ retryMsg.firstID }} To: {{ retryMsg.secID }} Retry: {{ retryMsg.retry }}
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
import { useStoreLogic } from '@/logic/storeLogic'

const logicStore = useStoreLogic()
const input = ''
</script>
