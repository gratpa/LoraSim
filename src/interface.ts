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

interface IAllCoords {
  sensor: number[][]
  gw: number[][]
  sensorRange: number
}
interface IsettingNodes {
  edit: boolean
  start: boolean
  iconVisible: boolean
}

export type {
  ISensor,
  IGW,
  Icallback,
  Isensor,
  Igw,
  ImapSetting,
  Iprojection,
  IAllCoords,
  IsettingNodes
}
