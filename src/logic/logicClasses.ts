import type { IGW, ISensor } from '@/interface'
import type {
  IMsgBuilder,
  IAllPaths,
  IMsgStatus,
  IMsgRetry,
  IHopCnt,
  IServer
} from './logicInterfaces'

class Server implements IServer {
  firstID: number
  secID: number
  msgID: number
  hopCnt: number
  msgCnt: number
  constructor(msgID: number, hopCnt: number, msgCnt: number, firstID: number, secID: number) {
    this.msgID = msgID
    this.hopCnt = hopCnt
    this.msgCnt = msgCnt
    this.firstID = firstID
    this.secID = secID
  }
}

class HopCnt implements IHopCnt {
  firstID: number
  secID: number
  hopCnt: number
  msgID: number
  constructor(firstID: number, secID: number, hopCnt: number, msgID: number) {
    this.firstID = firstID
    this.secID = secID
    this.hopCnt = hopCnt
    this.msgID = msgID
  }
}

class MsgRetry implements IMsgRetry {
  msgID: number
  firstID: number
  secID: number
  retry: number

  constructor(msgID: number, firstID: number, secID: number, retry: number) {
    this.msgID = msgID
    this.firstID = firstID
    this.secID = secID
    this.retry = retry
  }
}

class MsgStatus implements IMsgStatus {
  nodeID: number
  msgID: number
  msgStatus: string
  msgCnt: number

  constructor(nodeID: number, msgID: number, msgStatus: string, msgCnt: number) {
    this.nodeID = nodeID
    this.msgID = msgID
    this.msgStatus = msgStatus
    this.msgCnt = msgCnt
  }
}
class AllPaths implements IAllPaths {
  msgID
  firstID
  firstCoords
  firstR
  secID
  secCoords
  secR
  dist
  secCov
  hopCnt: number
  secStatus: string
  retryCnt: number
  firstCov: boolean

  constructor(
    msgID: number,
    firstID: number,
    firstCoords: number[],
    firstR: number,
    secID: number,
    secCoords: number[],
    secR: number,
    dist: number,
    secCov: boolean,
    firstCov: boolean
  ) {
    this.msgID = msgID
    this.firstID = firstID
    this.firstCoords = firstCoords
    this.firstR = firstR
    this.secID = secID
    this.secCoords = secCoords
    this.secR = secR
    this.dist = dist
    this.secCov = secCov
    this.hopCnt = 0
    this.secStatus = 'sending'
    this.retryCnt = 0
    this.firstCov = firstCov
  }
}

class MsgBuilder implements IMsgBuilder {
  sensorID
  msgID
  time
  allSensors
  allGWs
  pathsMsg: IAllPaths[]
  pathsResp: IAllPaths[]
  status
  retryCntMax
  hopCntMax
  duplicateMsg: IAllPaths[]
  serverMsg: IAllPaths[]
  constructor(sensorID: number, msgID: number, allSensors: ISensor[], allGWs: IGW[]) {
    this.sensorID = sensorID
    this.msgID = msgID
    this.time = 3
    this.allSensors = allSensors
    this.allGWs = allGWs
    this.pathsMsg = []
    this.pathsResp = []
    this.status = ''
    this.retryCntMax = 3
    this.hopCntMax = 3
    this.duplicateMsg = []
    this.serverMsg = []
  }
}

export { MsgBuilder, AllPaths, MsgStatus, MsgRetry, HopCnt, Server }
