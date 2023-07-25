<template>
  <div>Message:</div>
  <div>
    <textarea class="border-black border-2" :value="input"></textarea>
  </div>
  <div>
    <button
      :disabled="valueStore.settingNodes.edit"
      v-show="valueStore.settingNodes.start"
      @click="startClick()"
      :class="
        !valueStore.settingNodes.edit
          ? 'border-black border-2 bg-green-300'
          : 'border-black border-2 bg-stone-300'
      "
    >
      START
    </button>
    <button
      v-show="valueStore.settingNodes.start"
      @click="resetClick()"
      class="'border-black border-2 bg-red-300"
    >
      RESET
    </button>
  </div>
  <div>Hop counter:</div>
  <div>Delivered:</div>
  <div v-show="valueStore.settingNodes.setRangeVisible && valueStore.settingNodes.edit">
    Set new range:
    <input
      class="border-black border-2 text-black"
      v-model.number="valueStore.settingNodes.rangeInput"
      placeholder="range"
      @keyup.enter="
        ;[
          valueStore.selectTable(valueStore.settingNodes.setRange),
          (valueStore.settingNodes.start = true),
          (valueStore.settingNodes.rangeInput = 100)
        ]
      "
    />
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
