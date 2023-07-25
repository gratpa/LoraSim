<template>
  <div>Sensors:</div>
  <div
    v-for="sensor of valueStore.sensor.allSensors"
    :key="sensor.id"
    @click="
      ;[
        valueStore.selectTable(sensor.id),
        (valueStore.settingNodes.edit = false),
        (valueStore.settingNodes.selectedCoords = sensor.coords),
        valueStore.setPoint(),
        (valueStore.settingNodes.setRangeVisible = true)
      ]
    "
  >
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Id {{ sensor.id }}
    </div>
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800  text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      range: {{ Math.ceil(sensor.range) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
