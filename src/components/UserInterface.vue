<template>
  <div>Message:</div>
  <div>
    <textarea class="border-black border-2" :value="input"></textarea>
  </div>
  <div>
    <button @click="sendMessage()" class="border-black border-2">{{ btnName }}</button>
  </div>
  <div>Hop counter:</div>
  <div>Delivered:</div>
</template>
<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
import { ref } from 'vue'
const input = ''
const valueStore = useValueStore()
let btnName = ref('Start')
const sendMessage = () => {
  if (btnName.value === 'Start') {
    ;(valueStore.send = true), (btnName.value = 'Stop')
  } else {
    ;(valueStore.send = false), (btnName.value = 'Start')
  }
}
</script>
