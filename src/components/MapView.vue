<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    class="h-[900px] w-[700px] border-2 border-black"
    @pointermove=";[(valueStore.settingNodes.iconVisible = true)]"
    @click="valueStore.setNewRange()"
  >
    <ol-view
      ref="view"
      :center="mapSetting.centerImg"
      :rotation="mapSetting.rotation"
      :maxZoom="mapSetting.zoom + 2"
      :minZoom="mapSetting.zoom"
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
        :updateWhileInteracting="true"
      ></ol-source-image-static>
    </ol-image-layer>

    <ol-context-menu-control :items="contextMenuItems" :defaultItems="false" :width="150" />
    <ol-interaction-select @select="valueStore.select" :condition="selectCondition"
      ><ol-style>
        <ol-style-stroke color="rgb(220, 20, 60)" :width="5"></ol-style-stroke>
        <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
      </ol-style>
    </ol-interaction-select>
    <div v-if="!valueStore.settingNodes.edit">
      <ol-interaction-select
        @select="valueStore.checkExistedCoords"
        :condition="selectExistedCoords"
        ><ol-style>
          <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
          <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
        </ol-style>
      </ol-interaction-select>
    </div>
    <ol-overlay :position="valueStore.settingNodes.selectedCoords">
      <div
        v-if="
          valueStore.sensor.data?.id &&
          valueStore.settingNodes.edit &&
          valueStore.settingNodes.selectedCoords
        "
        class="bg-cyan-950/80 text-cyan-100"
      >
        ID: {{ valueStore.sensor.data.id }} range: {{ Math.ceil(valueStore.sensor.data.range) }}
      </div>
      <div
        v-else-if="
          valueStore.gw.data?.id &&
          valueStore.settingNodes.edit &&
          valueStore.settingNodes.selectedCoords
        "
        class="bg-cyan-950/80 text-cyan-100"
      >
        ID: {{ valueStore.gw.data.id }} range: {{ Math.ceil(valueStore.gw.data.range) }}
      </div>
    </ol-overlay>
    <div v-if="valueStore.settingNodes.iconVisible">
      <ol-vector-layer>
        <ol-source-vector ref="sensors" :updateWhileInteracting="true"> </ol-source-vector>
        <ol-style>
          <ol-style-icon :src="sensor" :scale="0.4" :attributions="markerCopyright"></ol-style-icon>
        </ol-style>
      </ol-vector-layer>

      <ol-vector-layer>
        <ol-source-vector ref="gateways" :updateWhileInteracting="true"> </ol-source-vector>

        <ol-style>
          <ol-style-icon
            :src="gateway"
            :scale="0.5"
            :attributions="markerCopyright"
          ></ol-style-icon>
        </ol-style>
      </ol-vector-layer>
    </div>
    <div v-for="sensor of valueStore.sensor.allSensors" :key="sensor.id" :name="sensor.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-interaction-modify
            v-if="valueStore.settingNodes.edit"
            :features="valueStore.settingNodes.selectedFeatures"
          >
          </ol-interaction-modify>

          <ol-feature>
            <ol-geom-circle
              :center="sensor.coords"
              :radius="sensor.range"
              :updateWhileInteracting="true"
            ></ol-geom-circle>
            <ol-style>
              <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(255,215,0,0.2)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    <div v-for="gw of valueStore.gw.allGWs" :key="gw.id" :name="gw.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-interaction-modify
            v-if="valueStore.settingNodes.edit"
            :features="valueStore.settingNodes.selectedFeatures"
          >
          </ol-interaction-modify>

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
        <ol-feature v-for="path of valueStore.calculatePaths.paths" :key="path.d">
          <ol-geom-line-string :coordinates="[path.fc, path.sc]"></ol-geom-line-string>
          <ol-style-flowline color="rgb(0,139,139,0.8)" :width="5" :arrow="1" />
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()

import { ref, inject } from 'vue'

import gateway from '@/assets/gateway.png'
import sensor from '@/assets/sensor.png'
import background from '@/assets/background.jpg'

import Feature from 'ol/Feature.js'
import { mapSetting } from '@/constValues'
import { projection } from '@/constValues'
import type { Icallback } from '@/interface'

const markerCopyright = `<a target="_blank" href="https://icons8.com/icon/2362/sensor">Sensor</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> `
const imgCopyright =
  '<a href="https://www.freepik.com/free-photo/grunge-black-concrete-textured-background_17118014.htm#query=black&position=3&from_view=search&track=sph">Image by rawpixel.com</a> on Freepik'
const sensors = ref()
const gateways = ref()
const view = ref()
const Geom = inject('ol-geom')

const contextMenuItems = ref<unknown[]>([
  {
    text: 'Add a Sensor',
    icon: sensor,

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

    callback: (val: Icallback) => {
      valueStore.gw.coord.push(val.coordinate)
      valueStore.setNewGW(val.coordinate)
      valueStore.gw.id = 2000 + valueStore.gw.coord.length

      const feature = new Feature({
        geometry: new Geom.Point(val.coordinate)
      })
      gateways.value.source.addFeature(feature)
    }
  }
])

const selectConditions = inject('ol-selectconditions')
const selectCondition = selectConditions.singleClick
const selectExistedCoords = selectConditions.always
</script>
