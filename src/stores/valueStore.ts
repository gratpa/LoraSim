import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ISensor } from '@/interface'
import type { IGW } from '@/interface'

export const useValueStore = defineStore('valueStore', () => {
  class Sensor implements ISensor {
    id = idSensor.value
    coords
    scope = scopeGWs.value
    constructor(coords: number[]) {
      this.coords = coords
    }
  }
  const allCoord = ref<number[][]>([])
  const scopeSensors = ref<number>(0)
  const coordSensors = ref<number[]>([])
  const idSensor = ref<number>(1000)
  const selectedCoords = ref<number[]>([])
  const allSensors = ref<ISensor[]>([])

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords)
    allSensors.value.push(newSensor)
    allCoord.value.push(coords)
    console.log(coordSensors)
  }

  class GW implements IGW {
    id = idGW.value
    coords
    scope = scopeGWs.value
    hasCoverage = true
    constructor(coords: number[]) {
      this.coords = coords
    }
  }
  const scopeGWs = ref<number>(0)
  const coordGWs = ref<number[]>([])
  const idGW = ref<number>(2000)
  const allGWs = ref<IGW[]>([])
  const send = ref<boolean>(false)
  const sensorData = ref<ISensor>()
  const GWData = ref<IGW>()

  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords)
    allGWs.value.push(newGW)
    allCoord.value.push(coords)
  }
  const setSensors = (event) => {
    selectedCoords.value = event.selected[0].values_.geometry.flatCoordinates
    console.log(event)
    allSensors.value.find((element) => element.coords === selectedCoords.value)
    sensorData.value = allSensors.value.find(
      (element) =>
        element.coords[0] === selectedCoords.value[0] &&
        element.coords[1] === selectedCoords.value[1]
    )
    allGWs.value.find((element) => element.coords === selectedCoords.value)
    GWData.value = allGWs.value.find(
      (element) =>
        element.coords[0] === selectedCoords.value[0] &&
        element.coords[1] === selectedCoords.value[1]
    )
  }

  return {
    scopeSensors,
    coordSensors,
    idSensor,
    allSensors,
    setNewSensor,
    scopeGWs,
    coordGWs,
    idGW,
    setSensors,
    selectedCoords,
    allGWs,
    setNewGW,
    allCoord,
    send,
    sensorData,
    GWData
  }
})
