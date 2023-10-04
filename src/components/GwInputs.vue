<template>
  <div class="text-center font-medium text-lg text-amber-500">Gateways</div>
  <div class="grid grid-cols-2">
    <div
      :class="[
        valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
          ? 'bg-amber-600 text-blue-900 rounded-lg m-1 '
          : 'bg-amber-500 text-blue-900 rounded-lg m-1 hover:bg-amber-600 '
      ]"
      class="grid grid-cols-3 grid-rows-4"
      v-for="gw of valueStore.gw.allGWs"
      :key="gw.id"
      @click=";[(valueStore.settingNodes.edit = false), valueStore.setPoint(gw.id)]"
    >
      <div class="col-start-1 col-end-1 row-start-1 row-end-1 ml-2">Id</div>
      <div class="col-start-2 col-end-2 row-start-1 row-end-1">{{ gw.id }}</div>
      <div class="col-start-1 col-end-1 row-start-2 row-end-2 ml-2">Range</div>
      <div class="col-start-2 col-end-2 row-start-2 row-end-2">
        {{ Math.ceil(gw.range) }}
      </div>
      <div class="col-start-1 col-end-3 row-start-3 row-end-3 ml-2">
        Coverage
        <input type="checkbox" id="checkbox" v-model="gw.hasCoverage" />
        <label for="checkbox"></label>
      </div>

      <input
        class="col-start-1 col-end-3 row-start-4 row-end-4"
        type="range"
        v-model.number="gw.range"
        min="0"
        max="10000"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
</script>
