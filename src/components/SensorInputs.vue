<template>
  <div>Sensors:</div>
  <div v-for="sensor of valueStore.allSensors" :key="sensor.id">
    <div
      :class="[
        valueStore.sensorData?.id === sensor.id ? 'bg-cyan-800 text-cyan-100' : 'bg-cyan-800/20'
      ]"
    >
      Id {{ sensor.id }}
    </div>
    <div
      :class="[
        valueStore.sensorData?.id === sensor.id ? 'bg-cyan-800  text-cyan-100' : 'bg-cyan-800/20'
      ]"
    >
      Scope:
      <input
        class="border-black border-2 text-black"
        v-model.number="sensor.scope"
        placeholder="Scope"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'

const valueStore = useValueStore()
</script>
