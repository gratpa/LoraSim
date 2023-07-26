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

  edit: boolean
  start: boolean
  iconVisible: boolean
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
  IAllCoords,
  IcalculatePaths,
  IsettingNodes
}
