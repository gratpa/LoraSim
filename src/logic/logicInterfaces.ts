import type { IGW, ISensor } from '@/interface'

interface Ipaths {
  showPaths: boolean
  filterPathsMsg: IAllPaths[]
  allPathsMsg: IAllPaths[]
}

interface Imsg {
  ID: number
  allMsgs: IMsgBuilder[]
  retryMsg: IMsgRetry[]
  msgStatus: IMsgStatus[]
  servNodeStatus: IMsgStatus[]
  server: IServer[]
}

interface IhopCnt {
  allHopCnt: IHopCnt[]
  servHopCnt: IHopCnt[]
  currentHop: number
}

interface IServer {
  firstID: number
  secID: number
  msgID: number
  hopCnt: number
  msgCnt: number
}

interface IHopCnt {
  firstID: number
  secID: number
  hopCnt: number
  msgID: number
}

interface IMsgRetry {
  msgID: number
  firstID: number
  secID: number
  retry: number
}

interface IMsgStatus {
  nodeID: number
  msgID: number
  msgStatus: string
  msgCnt: number
}

interface IAllPaths {
  msgID: number
  firstID: number
  firstCoords: number[]
  firstR: number
  secID: number
  secCoords: number[]
  secR: number
  dist: number
  secCov: boolean
  hopCnt: number
  secStatus: string
  retryCnt: number
  firstCov: boolean
}

interface IcalculatePaths {
  paths: IAllPaths[]
  allPaths: IAllPaths[]
}

interface IMsgBuilder {
  sensorID: number
  msgID: number
  time: number
  allSensors: ISensor[]
  allGWs: IGW[]
  pathsMsg: IAllPaths[]
  pathsResp: IAllPaths[]
  status: string
  retryCntMax: number
  duplicateMsg: IAllPaths[]
  serverMsg: IAllPaths[]
  hopCntMax: number
}

export type {
  IMsgBuilder,
  IAllPaths,
  IcalculatePaths,
  IMsgStatus,
  IMsgRetry,
  IHopCnt,
  IServer,
  IhopCnt,
  Imsg,
  Ipaths
}
