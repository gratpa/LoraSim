import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ISensor } from '@/interface'
import type { IGW } from '@/interface'
import type { SelectEvent } from 'ol/interaction/Select'

export const useValueStore = defineStore('valueStore', () => {
  class Sensor implements ISensor {
    id = idSensor.value
    coords
    scope = scopeGWs.value
    constructor(coords: number[]) {
      this.coords = coords
    }
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
  const idSensor = ref<number>(1000)
  const scopeSensors = ref<number>(0)
  const coordSensors = ref<number[][]>([])
  const sensorData = ref<ISensor>()
  const allSensors = ref<ISensor[]>([])
  const idGW = ref<number>(2000)
  const scopeGWs = ref<number>(0)
  const coordGWs = ref<number[][]>([])
  const GWData = ref<IGW>()
  const allGWs = ref<IGW[]>([])

  const send = ref<boolean>(false)
  const allCoords = ref<number[][]>([])
  const selectedCoords = ref<number[]>([])
  const btnName = ref('Start')
  const canStart = ref<boolean>(false)

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords)
    allSensors.value.push(newSensor)
    allCoords.value.push(coords)
    canStart.value = true
  }
  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords)
    allGWs.value.push(newGW)
    allCoords.value.push(coords)
    canStart.value = true
  }
  const setPoint = (event: SelectEvent) => {
    //@ts-ignore
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

  const sendMessage = () => {
    if (btnName.value === 'Start') {
      ;(send.value = true), (btnName.value = 'Stop')
    } else {
      ;(send.value = false), (btnName.value = 'Start')
    }
  }
  return {
    idSensor,
    scopeSensors,
    coordSensors,
    sensorData,
    allSensors,
    idGW,
    scopeGWs,
    coordGWs,
    GWData,
    allGWs,
    send,
    allCoords,
    selectedCoords,
    btnName,
    canStart,
    setNewSensor,
    setNewGW,
    setPoint,
    sendMessage
  }
})
