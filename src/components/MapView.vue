<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    class="h-[500px] w-[875px] border-2 border-black"
  >
    <ol-view
      ref="view"
      :center="centerImg"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />

    <ol-image-layer id="xkcd">
      <ol-source-image-static
        :url="background"
        :imageSize="size"
        :imageExtent="extent"
        :projection="projection"
        :attributions="imgCopyright"
      ></ol-source-image-static>
    </ol-image-layer>

    <ol-context-menu-control :items="contextMenuItems" />

    <ol-interaction-select
      @select="valueStore.setPoint"
      :condition="selectCondition"
      :hitTolerance="10"
    >
      <ol-style>
        <ol-style-icon :src="red" :scale="0.4" :attributions="markerCopyright"></ol-style-icon>
        <ol-style-stroke color="rgb(220, 20, 60)" :width="5"></ol-style-stroke>
        <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
      </ol-style>
    </ol-interaction-select>

    <ol-overlay
      :position="valueStore.selectedCoords"
      v-if="valueStore.sensorData && valueStore.send === false"
    >
      <div class="bg-cyan-950/80 text-cyan-100">
        ID: {{ valueStore.sensorData.id }} Scope: {{ valueStore.sensorData.scope }}
      </div>
      >
    </ol-overlay>

    <ol-overlay
      :position="valueStore.selectedCoords"
      v-if="valueStore.GWData && valueStore.send === false"
    >
      <div class="bg-cyan-950/80 text-cyan-100">
        ID: {{ valueStore.GWData.id }} Scope: {{ valueStore.GWData.scope }}
      </div>
    </ol-overlay>

    <ol-vector-layer>
      <ol-source-vector ref="sensors"></ol-source-vector>
      <ol-style>
        <ol-style-icon :src="sensor" :scale="0.4" :attributions="markerCopyright"></ol-style-icon>
      </ol-style>
    </ol-vector-layer>

    <ol-vector-layer>
      <ol-source-vector ref="gateways"> </ol-source-vector>
      <ol-style>
        <ol-style-icon :src="gateway" :scale="0.5" :attributions="markerCopyright"></ol-style-icon>
      </ol-style>
    </ol-vector-layer>
    <div v-for="sensor of valueStore.allSensors" :key="sensor.id" :name="sensor.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle :center="sensor.coords" :radius="sensor.scope"></ol-geom-circle>
            <ol-style>
              <ol-style-stroke color="rgb(47,79,79)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    <div v-for="gw of valueStore.allGWs" :key="gw.id" :name="gw.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle :center="gw.coords" :radius="gw.scope"></ol-geom-circle>
            <ol-style>
              <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature ref="animationPath">
          <ol-geom-line-string :coordinates="valueStore.allCoords"></ol-geom-line-string>
          <ol-style-flowline color="rgb(0,139,139,0.8)" :width="5" :arrow="1" />
        </ol-feature>
        <ol-animation-path
          v-if="valueStore.send"
          :path="animationPath?.feature"
          :duration="4000"
          :repeat="20"
        >
          <ol-feature>
            <ol-geom-point :coordinates="valueStore.allCoords[0]"></ol-geom-point>
            <ol-style>
              <ol-style-circle :radius="4">
                <ol-style-fill color="rgb(0,139,139,0.8)"></ol-style-fill>
                <ol-style-stroke color="rgb(0,139,139)" :width="2"></ol-style-stroke>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-animation-path>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()

import { ref, reactive, inject } from 'vue'
import type AnimationPath from 'ol-ext/featureanimation/Path'
import gateway from '@/assets/gateway.png'
import sensor from '@/assets/sensor.png'
import background from '@/assets/background.jpg'
import red from '@/assets/red.png'
import Feature from 'ol/Feature.js'
import type { Icallback } from '@/interface'

const animationPath = ref<{ feature: AnimationPath } | null>(null)
const zoom = ref(2)
const rotation = ref(0)
const size = ref([7001, 4001])
const centerImg = ref([size.value[0] / 2, size.value[1] / 2])
const extent = ref([0, 0, ...size.value])
const projection = reactive({
  code: 'xkcd-image',
  units: 'pixels',
  extent: extent
})

const imgCopyright = ref(
  '<a href="https://www.freepik.com/free-photo/grunge-black-concrete-textured-background_17118014.htm#query=black&position=3&from_view=search&track=sph">Image by rawpixel.com</a> on Freepik'
)
const markerCopyright = ref(
  `<a target="_blank" href="https://icons8.com/icon/2362/sensor">Sensor</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> `
)
const contextMenuItems = ref([] as unknown)
const selectConditions = inject('ol-selectconditions')
const selectCondition = selectConditions.singleClick

const sensors = ref()
const gateways = ref()
const view = ref()

const Geom = inject('ol-geom')

contextMenuItems.value = [
  { defaultItems: false },
  {
    text: 'Add a Sensor',
    icon: sensor,
    defaultItems: false,
    callback: (val: Icallback) => {
      valueStore.coordSensors.push(val.coordinate)
      valueStore.setNewSensor(val.coordinate)
      valueStore.idSensor = 1000 + valueStore.coordSensors.length

      const feature = new Feature({
        geometry: new Geom.Point(val.coordinate)
      })
      sensors.value.source.addFeature(feature)
    }
  },
  '-',
  {
    text: 'Add a Gateway',
    icon: gateway,
    defaultItems: false,
    callback: (val: Icallback) => {
      valueStore.coordGWs.push(val.coordinate)
      valueStore.setNewGW(val.coordinate)
      valueStore.idGW = 2000 + valueStore.coordGWs.length
      console.log(val)
      const feature = new Feature({
        geometry: new Geom.Point(val.coordinate)
      })
      gateways.value.source.addFeature(feature)
    }
  },
  { defaultItems: false }
]
</script>
