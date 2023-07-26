<template>
  <div>Sensors:</div>
  <div v-for="sensor of valueStore.sensor.allSensors" :key="sensor.id">
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && !valueStore.send
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Id {{ sensor.id }}
    </div>
    <div
      :class="[
        valueStore.sensor.data?.id === sensor.id && !valueStore.send
          ? 'bg-cyan-800  text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      range:
      <input
        class="border-black border-2 text-black"
        v-model.number="sensor.range"
        placeholder="range"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
