<template>
  <div>Message:</div>
  <div>
    <textarea class="border-black border-2" :value="input"></textarea>
  </div>
  <div>
    <button
      v-show="valueStore.canStart"
      @click="sendMessage()"
      :class="[
        valueStore.send ? 'border-black border-2 bg-red-500' : 'border-black border-2 bg-green-500'
      ]"
    >
      {{ btnName }}
    </button>
  </div>
  <div>Hop counter:</div>
  <div>Delivered:</div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const input = ''
const valueStore = useValueStore()
let btnName = 'Start'

const sendMessage = () => {
  if (btnName === 'Start') {
    valueStore.send = true
    btnName = 'Stop'
  } else {
    valueStore.send = false
    btnName = 'Start'
  }
}
</script>
