<template>
  <div>Sensors:</div>
  <div class="grid grid-cols-2">
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800 text-cyan-100 border-2 border-cyan-800 m-1 '
          : 'bg-cyan-800/20 border-2 border-cyan-800 m-1'
      ]"
      v-for="sensor of valueStore.sensor.allSensors"
      :key="sensor.id"
      @click=";[(valueStore.settingNodes.edit = false), valueStore.setPoint(sensor.id)]"
    >
      <div :class="logicStore.chosenMsg?.sensorID === sensor.id ? ' font-bold mx-1 ' : ' mx-1'">
        Id {{ sensor.id }}
      </div>
      <div :class="logicStore.chosenMsg?.sensorID === sensor.id ? ' font-bold mx-1 ' : ' mx-1'">
        range: {{ Math.ceil(sensor.range) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
</script>
