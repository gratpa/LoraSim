export interface ISensor {
  id: number
  coords: number[]
  range: number
}

export interface IGW {
  id: number
  coords: number[]
  range: number
  hasCoverage: boolean
}

export interface Icallback {
  data: null
  coordinate: number[]
}

export interface Isensor {
  id: number
  range: number
  coord: number[][]
  data?: ISensor
  allSensors: ISensor[]
}
export interface Igw {
  id: number
  range: number
  coord: number[][]
  data?: IGW
  allGWs: IGW[]
  hasCoverage: boolean
}

export interface ImapSetting {
  zoom: number
  rotation: number
  size: number[]
  centerImg: number[]
  extent: number[]
}

export interface Iprojection {
  code: string
  units: string
  extent: number[]
}

export interface Ievent {
  selected: {
    0: {
      values_: {
        geometry: {
          flatCoordinates: number[]
        }
      }
    }
  }
}
