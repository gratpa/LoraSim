<template>
  <div class="text-center font-medium text-lg text-amber-500">Sensors</div>
  <div class="grid grid-cols-2">
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit
          ? 'bg-amber-600 text-blue-900 rounded-lg m-1 '
          : 'bg-amber-500 text-blue-900 rounded-lg m-1 hover:bg-amber-600 '
      ]"
      class="grid grid-cols-3 grid-rows-3"
      v-for="sensor of valueStore.sensor.allSensors"
      :key="sensor.id"
      @click=";[(valueStore.settingNodes.edit = false), valueStore.setPoint(sensor.id)]"
    >
      <div class="col-start-1 col-end-1 row-start-1 row-end-1 ml-2">Id</div>
      <div class="col-start-2 col-end-2 row-start-1 row-end-1">{{ sensor.id }}</div>
      <div class="col-start-1 col-end-1 row-start-2 row-end-2 ml-2">Range</div>
      <div class="col-start-2 col-end-2 row-start-2 row-end-2">
        {{ Math.ceil(sensor.range) }}
      </div>

      <input
        class="col-start-1 col-end-3 row-start-3 row-end-3"
        type="range"
        v-model.number="sensor.range"
        min="0"
        max="10000"
      />
      <button
        class="motion-safe:hover:-translate-y-0.5 motion-safe:transition col-start-3 col-end-3 row-start-3 row-end-3 ml-5"
        @click="logicStore.buildMsg(sensor.id, valueStore.sensor.allSensors, valueStore.gw.allGWs)"
      >
        <img src="/src/assets/add_message.png" class="h-8" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
import { useStoreLogic } from '@/logic/storeLogic'

const logicStore = useStoreLogic()
</script>
