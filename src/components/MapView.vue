<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    class="h-[500px] w-[875px] border-2 border-black"
  >
    <ol-view
      ref="view"
      :center="mapSetting.centerImg"
      :rotation="mapSetting.rotation"
      :zoom="mapSetting.zoom"
      :projection="projection"
    />

    <ol-image-layer id="xkcd">
      <ol-source-image-static
        :url="background"
        :imageSize="mapSetting.size"
        :imageExtent="mapSetting.extent"
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

    <ol-overlay :position="valueStore.selectedCoords">
      <div
        v-if="valueStore.sensor.data?.id && valueStore.send === false && valueStore.selectedCoords"
        class="bg-cyan-950/80 text-cyan-100"
      >
        ID: {{ valueStore.sensor.data.id }} range: {{ valueStore.sensor.data.range }}
      </div>
      <div
        v-else-if="valueStore.gw.data?.id && valueStore.send === false && valueStore.selectedCoords"
        class="bg-cyan-950/80 text-cyan-100"
      >
        ID: {{ valueStore.gw.data.id }} range: {{ valueStore.gw.data.range }}
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
    <div v-for="sensor of valueStore.sensor.allSensors" :key="sensor.id" :name="sensor.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle :center="sensor.coords" :radius="sensor.range"></ol-geom-circle>
            <ol-style>
              <ol-style-stroke color="rgb(47,79,79)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    <div v-for="gw of valueStore.gw.allGWs" :key="gw.id" :name="gw.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle :center="gw.coords" :radius="gw.range"></ol-geom-circle>
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
          <ol-geom-line-string :coordinates="[0, 0, 0]"></ol-geom-line-string>
          <ol-style-flowline color="rgb(0,139,139,0.8)" :width="5" :arrow="1" />
        </ol-feature>
        <ol-animation-path
          v-if="valueStore.send"
          :path="animationPath?.feature"
          :duration="4000"
          :repeat="20"
        >
          <ol-feature>
            <ol-geom-point :coordinates="[0, 0, 0]"></ol-geom-point>
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

import { ref, inject } from 'vue'
import type AnimationPath from 'ol-ext/featureanimation/Path'
import gateway from '@/assets/gateway.png'
import sensor from '@/assets/sensor.png'
import background from '@/assets/background.jpg'
import red from '@/assets/red.png'
import Feature from 'ol/Feature.js'
import { mapSetting } from '@/constValues'
import { projection } from '@/constValues'
import type { Icallback } from '@/interface'

const animationPath = ref<{ feature: AnimationPath } | null>(null)

const imgCopyright =
  '<a href="https://www.freepik.com/free-photo/grunge-black-concrete-textured-background_17118014.htm#query=black&position=3&from_view=search&track=sph">Image by rawpixel.com</a> on Freepik'

const markerCopyright = `<a target="_blank" href="https://icons8.com/icon/2362/sensor">Sensor</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> `

const selectConditions = inject('ol-selectconditions')
const selectCondition = selectConditions.singleClick

const sensors = ref()
const gateways = ref()
const view = ref()

const Geom = inject('ol-geom')

const contextMenuItems = ref<unknown[]>([
  { defaultItems: false },
  {
    text: 'Add a Sensor',
    icon: sensor,
    defaultItems: false,
    callback: (val: Icallback) => {
      valueStore.sensor.coord.push(val.coordinate)
      valueStore.setNewSensor(val.coordinate)
      valueStore.sensor.id = 1000 + valueStore.sensor.coord.length

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
      valueStore.gw.coord.push(val.coordinate)
      valueStore.setNewGW(val.coordinate)
      valueStore.gw.id = 2000 + valueStore.gw.coord.length

      const feature = new Feature({
        geometry: new Geom.Point(val.coordinate)
      })
      gateways.value.source.addFeature(feature)
    }
  },
  { defaultItems: false }
])
</script>
