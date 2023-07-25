interface ISensor {
  id: number
  coords: number[]
  range: number
}

interface IGW {
  id: number
  coords: number[]
  range: number
  hasCoverage: boolean
}
interface Icallback {
  data: null
  coordinate: number[]
}

interface Isensor {
  id: number
  range: number
  coord: number[][]
  data?: ISensor
  allSensors: ISensor[]
}
interface Igw {
  id: number
  range: number
  coord: number[][]
  data?: IGW
  allGWs: IGW[]
  hasCoverage: boolean
}
interface ImapSetting {
  zoom: number
  rotation: number
  size: number[]
  centerImg: number[]
  extent: number[]
}

interface Iprojection {
  code: string
  units: string
  extent: number[]
}

interface Ievent {
  selected: {
    0: {
      values_: {
        geometry: {
          flatCoordinates: number[]
        }
      }
    }
  }
  target: { getFeatures(): number[] }
}

interface IAllPaths {
  fc: number[]
  sc: number[]
  d: number
  r: number
}

interface IAllCoords {
  sensor: number[][]
  gw: number[][]
  sensorRange: number
}
interface IsettingNodes {
  selectedCoords: number[]
  selectedTable: number[]
  selectedFeatures: unknown
  changedCoords: number[]
  changedRange: number
  rangeInput: number
  edit: boolean
  start: boolean
  iconVisible: boolean
  setRange: number
  setRangeVisible: boolean
}

interface IcalculatePaths {
  paths: IAllPaths[]
  allPaths: IAllPaths[]
}

export type {
  ISensor,
  IGW,
  Icallback,
  Isensor,
  Igw,
  ImapSetting,
  Iprojection,
  IAllPaths,
  Ievent,
  IAllCoords,
  IcalculatePaths,
  IsettingNodes
}
