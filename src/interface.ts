export interface ISensor {
  id: number
  coords: number[]
  scope: number
}

export interface IGW {
  id: number
  coords: number[]
  scope: number
  hasCoverage: boolean
}

export interface Icallback {
  data: null
  coordinate: number[]
}
