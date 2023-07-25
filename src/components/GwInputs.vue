<template>
  <div>Gateways:</div>
  <div
    v-for="gw of valueStore.gw.allGWs"
    :key="gw.id"
    @click="
      ;[
        valueStore.selectTable(gw.id),
        (valueStore.settingNodes.edit = false),
        (valueStore.settingNodes.selectedCoords = gw.coords),
        valueStore.setPoint(),
        (valueStore.settingNodes.setRangeVisible = true)
      ]
    "
  >
    <div
      :class="[
        valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      Id {{ gw.id }}
    </div>
    <div
      :class="[
        valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
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
        valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
          ? 'bg-cyan-800 text-cyan-100'
          : 'bg-cyan-800/20'
      ]"
    >
      range: {{ Math.ceil(gw.range) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
