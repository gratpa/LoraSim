import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Isensor } from '@/interface'
import type { Igw } from '@/interface'
import { GW } from '@/models/classes'
import { Sensor } from '@/models/classes'

import type { IsettingNodes } from '@/interface'

export const useValueStore = defineStore('valueStore', () => {
  const sensor = ref<Isensor>({
    id: 1000,
    range: 100,
    coord: [],
    data: { id: 0, coords: [], range: 0 },
    allSensors: []
  })

  const gw = ref<Igw>({
    id: 2000,
    range: 100,
    coord: [],
    data: { id: 0, coords: [], range: 0, hasCoverage: true },
    allGWs: [],
    hasCoverage: true
  })

  const settingNodes = ref<IsettingNodes>({
    edit: false,
    start: false,
    iconVisible: false
  })

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords, sensor.value.id, sensor.value.range)
    sensor.value.allSensors.push(newSensor)
    settingNodes.value.start = true
    console.log(sensor.value.allSensors)
  }
  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords, gw.value.id, gw.value.range, gw.value.hasCoverage)
    gw.value.allGWs.push(newGW)
    settingNodes.value.start = true
  }

  const setPoint = (ID: number) => {
    sensor.value.data = sensor.value.allSensors.find((element) => element.id === ID)
    gw.value.data = gw.value.allGWs.find((element) => element.id === ID)
    settingNodes.value.edit = true
  }

  const reset = () => {
    ;(sensor.value.id = 1000),
      (sensor.value.range = 100),
      (sensor.value.coord = []),
      (sensor.value.data = { id: 0, coords: [], range: 0 }),
      (sensor.value.allSensors = [])
    ;(gw.value.id = 2000),
      (gw.value.range = 100),
      (gw.value.coord = []),
      (gw.value.data = { id: 0, coords: [], range: 0, hasCoverage: true }),
      (gw.value.allGWs = []),
      (gw.value.hasCoverage = true)

    settingNodes.value.start = false

    settingNodes.value.iconVisible = false
  }

  return {
    sensor,
    gw,
    settingNodes,

    setNewSensor,
    setNewGW,
    setPoint,
    reset
  }
})
