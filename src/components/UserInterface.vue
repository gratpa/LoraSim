<template>
  <div>Message:</div>
  <div>
    <textarea class="border-black border-2" :value="input"></textarea>
  </div>
  <div>
    <button
      :disabled="!valueStore.settingNodes.start"
      @click="startClick()"
      :class="
        valueStore.settingNodes.start
          ? 'bg-green-300 border-2 border-green-300 m-1'
          : ' bg-stone-300 border-2 border-stone-300 m-1'
      "
    >
      START
    </button>
    <button @click="resetClick()" class="bg-red-300 border-2 border-red-300 m-1">RESET</button>
  </div>
  <div>Hop counter:</div>
  <div>Delivered:</div>

  <div
    v-for="gw of valueStore.gw.allGWs"
    :key="gw.id"
    v-show="valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit"
    class="bg-cyan-800 text-cyan-100 border-4 border-cyan-800 m-1"
  >
    Set new range:
    <input class="border-black border-2 text-black m-1" v-model.number="gw.range" />
    <input class="m-1" type="range" v-model.number="gw.range" min="0" max="20000" />
  </div>
  <div
    v-for="sensor of valueStore.sensor.allSensors"
    :key="sensor.id"
    v-show="valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit"
    class="bg-cyan-800 text-cyan-100 border-4 border-cyan-800 m-1"
  >
    Set new range:
    <input class="border-black border-2 text-black m-1" v-model.number="sensor.range" />
    <input class="m-1" type="range" v-model.number="sensor.range" min="0" max="20000" />
  </div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'

const input = ''
const valueStore = useValueStore()

const startClick = () => {
  valueStore.findPath()
}

const resetClick = () => {
  valueStore.reset()
}
</script>
