import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useValueStore = defineStore('valueStore', () => {
  class Sensor {
    id = idSensor.value
    coords: number[]
    scope: number
    constructor(coords: number[], scope: number) {
      ;(this.coords = coords), (this.scope = scope)
    }
  }
  const allCoord = ref([])
  const scopeSensors = ref([])
  const coordSensors = ref([]) as unknown as number[]
  const idSensor = ref(1000)
  const selectedCoords = ref()
  const allSensors = ref([])

  const setNewSensor = (coords: number[]) => {
    const newSensor = new Sensor(coords, scopeSensors.value)
    allSensors.value.push(newSensor)
    allCoord.value.push(coords)
  }

  class GW {
    id = idGW.value
    coords: number[]
    scope: number
    hasCoverage = true
    constructor(coords: number[], scope: number) {
      ;(this.coords = coords), (this.scope = scope)
    }
  }
  const scopeGWs = ref([])
  const coordGWs = ref([]) as unknown as number[]
  const idGW = ref(2000)

  const allGWs = ref([])

  const setNewGW = (coords: number[]) => {
    const newGW = new GW(coords, scopeGWs.value)
    allGWs.value.push(newGW)
    allCoord.value.push(coords)
    // console.log(allCoord.value.join(','))
  }
  // const setSensors = (crdS) => {
  //   selectedCoords.value = crdS.selected[0].values_.geometry.flatCoordinates
  // }

  return {
    scopeSensors,
    coordSensors,
    idSensor,
    allSensors,
    setNewSensor,
    scopeGWs,
    coordGWs,
    idGW,
    // setSensors,
    selectedCoords,
    allGWs,
    setNewGW,
    allCoord
  }
})
