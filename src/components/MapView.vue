<template>
  <ol-map
    ref="map"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    class="h-full w-full border-2 border-black"
    @pointermove="valueStore.settingNodes.iconVisible = true"
  >
    <ol-view
      ref="view"
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
        :updateWhileInteracting="true"
      ></ol-source-image-static>
    </ol-image-layer>
    <ol-context-menu-control :items="contextMenuItems" :defaultItems="false" :width="150" />
    <div v-for="sensor of valueStore.sensor.allSensors" :key="sensor.id">
      <ol-overlay :position="[sensor.coords[0] - 45, sensor.coords[1] - 30]">
        <div
          :class="
            valueStore.sensor.data?.id === sensor.id && valueStore.settingNodes.edit
              ? 'bg-cyan-100 text-cyan-950 border-cyan-950 border-2'
              : 'bg-cyan-950/80 text-cyan-100'
          "
        >
          ID: {{ sensor.id }}
        </div>
      </ol-overlay>
    </div>
    <div v-for="gw of valueStore.gw.allGWs" :key="gw.id">
      <ol-overlay :position="[gw.coords[0] - 45, gw.coords[1] - 30]">
        <div
          :class="
            valueStore.gw.data?.id === gw.id && valueStore.settingNodes.edit
              ? 'bg-cyan-100 text-cyan-950 border-cyan-950 border-2'
              : 'bg-cyan-950/80 text-cyan-100'
          "
        >
          ID: {{ gw.id }}
        </div>
      </ol-overlay>
    </div>
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
    <div v-for="sensor of valueStore.sensor.allSensors" :key="sensor.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle
              :center="sensor.coords"
              :radius="sensor.range"
              :updateWhileInteracting="true"
            ></ol-geom-circle>
            <ol-style>
              <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(255,215,0,0.1)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    <div v-for="gw of valueStore.gw.allGWs" :key="gw.id">
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-circle :center="gw.coords" :radius="gw.range"></ol-geom-circle>

            <ol-style v-if="gw.hasCoverage">
              <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
              <ol-style-fill color="rgb(60, 179, 113, 0.1) "></ol-style-fill>
            </ol-style>
            <ol-style v-else-if="!gw.hasCoverage">
              <ol-style-stroke color="rgb(0,139,139)" :width="3"></ol-style-stroke>
              <ol-style-fill color=" rgb(205,92,92, 0.1)"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    <div v-for="msg of logicStore.allMsgs" :key="msg.msgID">
      <div v-if="logicStore.chosenMsg?.msgID === msg.msgID && logicStore.showPaths">
        <ol-vector-layer>
          <ol-source-vector :updateWhileInteracting="true">
            <ol-feature v-for="paths of msg.pathsMsg" :key="paths.firstID">
              <ol-geom-line-string
                :coordinates="[paths.firstCoords, paths.secCoords]"
              ></ol-geom-line-string>
              <ol-style-flowline color="rgb(100,149,237)" :width="3" :arrow="1" />
            </ol-feature>
            <!-- <ol-feature v-for="paths of msg.pathsResp" :key="paths.fc">
              <ol-geom-line-string :coordinates="[paths.fc, paths.sc]"></ol-geom-line-string>
              <ol-style-flowline
                color="rgb(0,250,154,1)"
                color2="rgb(46,139,87,1)"
                :width="2"
                :arrow="1"
              />
            </ol-feature> -->

            <ol-feature v-for="paths of msg.serverMsg" :key="paths.firstID">
              <ol-geom-line-string
                :coordinates="[paths.firstCoords, paths.secCoords]"
              ></ol-geom-line-string>
              <ol-style-flowline color="rgba(102,205,170,0.3)" :width="10" />
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </div>
    </div>
  </ol-map>
</template>

<script setup lang="ts">
import { useValueStore } from '@/stores/valueStore'
const valueStore = useValueStore()
import { useStoreLogic } from '@/logic/storeLogic'
const logicStore = useStoreLogic()
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
</script>
@/logic/storeLogic
