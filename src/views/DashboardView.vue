<template>
  <div class="grid grid-cols-6 justify-center m-8">
    <div class="col-span-3">
      <MapView />
    </div>
    <div><UserInterface /></div>
    <div>
      <SensorInputs />
    </div>
    <div><GwInputs /></div>
  </div>
</template>
<script setup lang="ts">
import MapView from '@/components/MapView.vue'
import SensorInputs from '@/components/SensorInputs.vue'
import GwInputs from '@/components/GwInputs.vue'
import UserInterface from '@/components/UserInterface.vue'
</script>
