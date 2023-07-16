<template>
  <div>Sensors:</div>
  <div v-for="sensor of valueStore.allSensors" :key="sensor.id">
    <div>Id {{ sensor.id }}</div>

    <div>
      Scope:
      <input
        @keyup.enter="setInputScope"
        class="border-black border-2"
        v-model.number="sensor.scopeSensors"
        placeholder="Scope"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
import { ref } from 'vue'
const valueStore = useValueStore()

const setInputScope = () => {
  console.log(valueStore.allSensors)
}
</script>
