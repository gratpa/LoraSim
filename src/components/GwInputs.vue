<template>
  <div>Gateways:</div>
  <div v-for="gw of valueStore.allGWs" :key="gw.id">
    <div>Id {{ gw.id }}</div>
    <div>Has coverage? {{ gw.hasCoverage }}</div>
    <div>
      Scope:
      <input
        @keyup.enter="setInputScope"
        class="border-black border-2"
        v-model.number="gw.scopeGWs"
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
  console.log(valueStore.allGWs)
}
</script>
