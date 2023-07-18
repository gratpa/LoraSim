<template>
  <div>Gateways:</div>
  <div v-for="gw of valueStore.allGWs" :key="gw.id">
    <div
      :class="[
        valueStore.GWData?.id === gw.id && valueStore.send === false
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Id {{ gw.id }}
    </div>
    <div
      :class="[
        valueStore.GWData?.id === gw.id && valueStore.send === false
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Coverage
      <input type="checkbox" id="checkbox" v-model="gw.hasCoverage" />
      <label for="checkbox"></label>
    </div>
    <div
      :class="[
        valueStore.GWData?.id === gw.id && valueStore.send === false
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Scope:
      <input
        class="border-black border-2 text-black"
        v-model.number="gw.scope"
        placeholder="Scope"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
