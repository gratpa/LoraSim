import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Isensor } from '@/interface'
import type { Igw } from '@/interface'
import { GW } from '@/models/classes'
import { Sensor } from '@/models/classes'
import type { Ievent } from '@/interface'

export const useValueStore = defineStore('valueStore', () => {
  const sensor = ref<Isensor>({
    id: 1000,
    range: 0,
    coord: [],
    data: { id: 0, coords: [], range: 0 },
    allSensors: []
  })

  const gw = ref<Igw>({
    id: 2000,
    range: 0,
    coord: [],
    data: { id: 0, coords: [], range: 0, hasCoverage: true },
    allGWs: [],
    hasCoverage: true
  })

  const send = ref<boolean>(false)
  const selectedCoords = ref<number[]>([])
  const canStart = ref<boolean>(false)

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords, sensor.value.id, sensor.value.range)
    sensor.value.allSensors.push(newSensor)
    canStart.value = true
  }
  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords, gw.value.id, gw.value.range, gw.value.hasCoverage)
    gw.value.allGWs.push(newGW)
    canStart.value = true
  }
  const setPoint = (event: Ievent) => {
    selectedCoords.value = event.selected[0].values_.geometry.flatCoordinates
    console.log(event)
    sensor.value.data = sensor.value.allSensors.find(
      (element) =>
        element.coords[0] === selectedCoords.value[0] &&
        element.coords[1] === selectedCoords.value[1]
    )
    gw.value.data = gw.value.allGWs.find(
      (element) =>
        element.coords[0] === selectedCoords.value[0] &&
        element.coords[1] === selectedCoords.value[1]
    )
  }

  return {
    sensor,
    gw,
    send,
    selectedCoords,
    canStart,
    setNewSensor,
    setNewGW,
    setPoint
  }
})
