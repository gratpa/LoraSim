import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Isensor } from '@/interface'
import type { Igw } from '@/interface'
import { GW } from '@/models/classes'
import { Sensor } from '@/models/classes'
import { AllPaths } from '@/models/classes'

import type { IsettingNodes } from '@/interface'
import type { IcalculatePaths } from '@/interface'
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
    selectedCoords: [],
    edit: false,
    start: false,
    iconVisible: false
  })

  const calculatePaths = ref<IcalculatePaths>({
    paths: [],
    allPaths: []
  })

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords, sensor.value.id, sensor.value.range)
    sensor.value.allSensors.push(newSensor)
    settingNodes.value.start = true
  }
  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords, gw.value.id, gw.value.range, gw.value.hasCoverage)
    gw.value.allGWs.push(newGW)
    settingNodes.value.start = true
  }

  const setPoint = () => {
    sensor.value.data = sensor.value.allSensors.find(
      (element) =>
        element.coords[0] === settingNodes.value.selectedCoords[0] &&
        element.coords[1] === settingNodes.value.selectedCoords[1]
    )
    gw.value.data = gw.value.allGWs.find(
      (element) =>
        element.coords[0] === settingNodes.value.selectedCoords[0] &&
        element.coords[1] === settingNodes.value.selectedCoords[1]
    )
    settingNodes.value.edit = true
  }

  const findPath = () => {
    calculatePaths.value.allPaths = []
    calculatePaths.value.paths = []
    sensor.value.allSensors.forEach((sensor) =>
      gw.value.allGWs.forEach((gw) =>
        calculatePaths.value.allPaths.push(
          new AllPaths(
            [sensor.coords[0], sensor.coords[1]],
            [gw.coords[0], gw.coords[1]],
            Math.hypot(gw.coords[0] - sensor.coords[0], gw.coords[1] - sensor.coords[1]),
            sensor.range
          )
        )
      )
    )
    gw.value.allGWs.forEach((gwFc) =>
      gw.value.allGWs.forEach((gwSc) =>
        calculatePaths.value.allPaths.push(
          new AllPaths(
            [gwFc.coords[0], gwFc.coords[1]],
            [gwSc.coords[0], gwSc.coords[1]],
            Math.hypot(gwSc.coords[0] - gwFc.coords[0], gwSc.coords[1] - gwFc.coords[1]),
            gwFc.range
          ),
          new AllPaths(
            [gwFc.coords[0], gwFc.coords[1]],
            [gwSc.coords[0], gwSc.coords[1]],
            Math.hypot(gwFc.coords[0] - gwSc.coords[0], gwFc.coords[1] - gwSc.coords[1]),
            gwFc.range
          )
        )
      )
    )

    calculatePaths.value.paths = calculatePaths.value.allPaths.filter((path) => path.d < path.r)
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

    settingNodes.value.selectedCoords = []
    settingNodes.value.start = false
    calculatePaths.value.allPaths = []
    calculatePaths.value.paths = []
    settingNodes.value.iconVisible = false
  }

  return {
    sensor,
    gw,
    settingNodes,
    calculatePaths,
    setNewSensor,
    setNewGW,
    setPoint,
    findPath,
    reset
  }
})
