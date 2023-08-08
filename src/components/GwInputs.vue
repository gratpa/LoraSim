<template>
  <div>Gateways:</div>
  <div class="grid grid-cols-2">
    <div
      :class="[
        valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800 text-cyan-100 border-2 border-cyan-800 m-1'
          : 'bg-cyan-800/20 border-2 border-cyan-800 m-1'
      ]"
      v-for="gw of valueStore.gw.allGWs"
      :key="gw.id"
      @click=";[(valueStore.settingNodes.edit = false), valueStore.setPoint(gw.id)]"
    >
      <div class="mx-1">Id {{ gw.id }}</div>
      <div class="mx-1">
        Coverage
        <input type="checkbox" id="checkbox" v-model="gw.hasCoverage" />
        <label for="checkbox"></label>
      </div>
      <div class="mx-1">range: {{ Math.ceil(gw.range) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
