import type { ISensor } from '@/interface'
import type { IGW } from '@/interface'
import type { IAllPaths } from '@/interface'

class Sensor implements ISensor {
  id
  coords
  range
  constructor(coords: number[], id: number, range: number) {
    this.coords = coords
    this.id = id
    this.range = range
  }
}
class GW implements IGW {
  id
  coords
  range
  hasCoverage
  constructor(coords: number[], id: number, range: number, hasCoverage: boolean) {
    this.coords = coords
    this.id = id
    this.range = range
    this.hasCoverage = hasCoverage
  }
}

class AllPaths implements IAllPaths {
  fc
  sc
  d
  rSensor
  constructor(fc: number[], sc: number[], d: number, rSensor: number) {
    this.fc = fc
    this.sc = sc
    this.d = d
    this.rSensor = rSensor
  }
}

export { GW, Sensor, AllPaths }
