import type { IGW, ISensor } from '@/interface'
import { MsgBuilder, AllPaths, MsgStatus, MsgRetry, HopCnt, Server } from './logicClasses'
import {
  type IAllPaths,
  type IMsgBuilder,
  type IhopCnt,
  type Imsg,
  type Ipaths
} from './logicInterfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreLogic = defineStore('storeLogic', () => {
  const hopCnt = ref<IhopCnt>({
    allHopCnt: [],
    servHopCnt: [],
    currentHop: 0
  })
  const msg = ref<Imsg>({
    ID: -1,
    allMsgs: [],
    retryMsg: [],
    msgStatus: [],
    servNodeStatus: [],
    server: []
  })
  const paths = ref<Ipaths>({
    showPaths: false,
    filterPathsMsg: [],
    allPathsMsg: []
  })

  const buildMsg = (sensorID: number, allSensors: ISensor[], allGWs: IGW[]) => {
    msg.value.ID++
    msg.value.allMsgs.push(new MsgBuilder(sensorID, msg.value.ID, allSensors, allGWs))
  }
  const findPath = (sensorID: number, allSensors: ISensor[], allGWs: IGW[], msgID: number) => {
    paths.value.allPathsMsg = []
    const sensor: ISensor = allSensors.find((element) => element.id === sensorID)!
    allGWs.forEach((gw) =>
      paths.value.allPathsMsg.push(
        new AllPaths(
          msgID,
          sensor.id,
          [sensor.coords[0], sensor.coords[1]],
          sensor.range,
          gw.id,
          [gw.coords[0], gw.coords[1]],
          gw.range,
          Math.hypot(gw.coords[0] - sensor.coords[0], gw.coords[1] - sensor.coords[1]),
          gw.hasCoverage,
          false
        )
      )
    )
    allGWs.forEach((gwFc) =>
      allGWs.forEach((gwSc) =>
        paths.value.allPathsMsg.push(
          new AllPaths(
            msgID,
            gwFc.id,
            [gwFc.coords[0], gwFc.coords[1]],
            gwFc.range,
            gwSc.id,
            [gwSc.coords[0], gwSc.coords[1]],
            gwSc.range,
            Math.hypot(gwSc.coords[0] - gwFc.coords[0], gwSc.coords[1] - gwFc.coords[1]),
            gwSc.hasCoverage,
            gwFc.hasCoverage
          )
        )
      )
    )
    paths.value.filterPathsMsg = paths.value.allPathsMsg.filter(
      (path) => path.dist !== 0 && !path.firstCov
    )
    return paths.value.filterPathsMsg
  }

  const findFirstNode = (
    sensorID: number,
    allSensors: ISensor[],
    allGWs: IGW[],
    msgID: number,
    serverMsg: IAllPaths[],
    pathsMsg: IAllPaths[]
  ) => {
    hopCnt.value.allHopCnt.forEach((allhops) => {
      if (allhops.firstID === sensorID && allhops.msgID === msgID) {
        hopCnt.value.currentHop = allhops.hopCnt
      } else hopCnt.value.currentHop = 0
    })

    findPath(sensorID, allSensors, allGWs, msgID)
    msg.value.allMsgs
    const sensor: ISensor = allSensors.find((element) => element.id === sensorID)!
    const firstPath = paths.value.filterPathsMsg.filter((msg) => msg.firstID === sensor.id)
    firstPath.forEach((element) => {
      hopCnt.value.currentHop ? hopCnt.value.currentHop : (hopCnt.value.currentHop = 0)
      const thisMsg = msg.value.allMsgs.find(
        (msg) => msg.msgID === msgID && msg.sensorID === sensorID
      )

      if (hopCnt.value.currentHop > thisMsg!.hopCntMax) {
        const firstStatusNode = msg.value.msgStatus.find(
          (msg) => msg.nodeID === element.firstID && msg.msgID === msgID
        )
        if (firstStatusNode?.msgStatus !== 'msgOut') {
          changeStatus('msgDead', element.firstID, msgID)
        }
        const msgIn = msg.value.msgStatus.find(
          (msg) => msg.msgStatus === 'msgIn' && msg.msgID === msgID
        )
        if (msgIn) {
          changeStatus('msgDead', msgIn.nodeID, msgID)
        }
      } else if (hopCnt.value.currentHop < thisMsg!.hopCntMax) {
        if (element.dist <= element.firstR && element.dist <= element.secR) {
          setHopCnt(element, msgID)
          changeStatus('msgOut', element.firstID, msgID)
          changeStatus('msgIn', element.secID, msgID)
          setStatus(sensorID, msgID)
          const firstTry = pathsMsg.filter(
            (msg) => msg.firstID === element.firstID && msg.secID === msg.secID
          )
          firstTry.length === 0
            ? addPath(element, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
            : retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
        }

        if (element.dist <= element.firstR && element.dist > element.secR) {
          const firstStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === element.firstID)
          const secStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === element.secID)

          if (secStatusNode?.msgStatus !== 'msgIn' && firstStatusNode?.msgStatus !== 'msgOut') {
            setHopCnt(element, msgID)
            changeStatus('msgIn', element.firstID, msgID)
            changeStatus('msgIn', element.secID, msgID)
            setStatus(sensorID, msgID)

            const firstTry = pathsMsg.filter(
              (msg) => msg.firstID === element.firstID && msg.secID === msg.secID
            )
            firstTry.length === 0
              ? addPath(element, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
              : retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
          }
        }

        if (element.dist > element.firstR && element.dist > element.secR) {
          const firstStatusNode = msg.value.msgStatus.find(
            (msg) => msg.nodeID === element.firstID && msg.msgID === msgID
          )

          if (firstStatusNode?.msgStatus !== 'msgOut') {
            changeStatus('msgIn', element.firstID, msgID)
          }
          retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
        }
      }
    })
  }
  const findNextNode = (
    path: IAllPaths,
    msgID: number,
    sensorID: number,
    allSensors: ISensor[],
    allGWs: IGW[],
    serverMsg: IAllPaths[],
    pathsMsg: IAllPaths[]
  ) => {
    const nextNode = paths.value.filterPathsMsg.filter(
      (element) =>
        element.firstCoords[0] === path.secCoords[0] &&
        element.firstCoords[1] === path.secCoords[1] &&
        element.firstCoords[0] !== path.firstCoords[0] &&
        element.secCoords[1] !== path.secCoords[1]
    )

    nextNode.forEach((element) => {
      const nextNodeStatus = msg.value.msgStatus.find(
        (el) => element.secID === el.nodeID && el.msgID === element.msgID
      )

      if (nextNodeStatus?.msgStatus === 'msgIn') {
        changeStatus('msgIn', element.firstID, msgID)
        retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
      } else {
        hopCnt.value.allHopCnt.forEach((allhops) => {
          if (
            allhops.firstID === element.firstID &&
            allhops.secID === element.secID &&
            allhops.msgID === msgID
          ) {
            hopCnt.value.currentHop = allhops.hopCnt
          }
        })
        hopCnt.value.currentHop ? hopCnt.value.currentHop : (hopCnt.value.currentHop = 0)
        const thisMsg = msg.value.allMsgs.find(
          (msg) => msg.msgID === msgID && msg.sensorID === sensorID
        )
        if (hopCnt.value.currentHop > thisMsg!.hopCntMax) {
          const firstStatusNode = msg.value.msgStatus.find(
            (msg) => msg.nodeID === element.firstID && msg.msgID === msgID
          )

          if (firstStatusNode?.msgStatus !== 'msgOut') {
            changeStatus('msgDead', element.firstID, msgID)
          }
        } else if (hopCnt.value.currentHop <= thisMsg!.hopCntMax) {
          if (element.dist <= element.firstR && element.dist <= element.secR) {
            setHopCnt(element, msgID)
            changeStatus('msgOut', element.firstID, msgID)
            changeStatus('msgIn', element.secID, msgID)
            setStatus(sensorID, msgID)

            const firstTry = pathsMsg.filter(
              (msg) => msg.firstID === element.firstID && msg.secID === msg.secID
            )

            firstTry.length === 0
              ? addPath(element, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
              : retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
          }

          if (element.dist <= element.firstR && element.dist > element.secR) {
            setHopCnt(element, msgID)
            const firstStatusNode = msg.value.msgStatus.find(
              (msg) => msg.nodeID === element.firstID
            )
            const secStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === element.secID)

            if (firstStatusNode?.msgStatus !== 'msgOut' && secStatusNode?.msgStatus !== 'msgIn') {
              changeStatus('msgIn', element.firstID, msgID)
              changeStatus('msgIn', element.secID, msgID)
              setStatus(sensorID, msgID)

              const firstTry = pathsMsg.filter(
                (msg) => msg.firstID === element.firstID && msg.secID === msg.secID
              )

              firstTry.length === 0
                ? addPath(element, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
                : retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
            } else if (!secStatusNode?.msgStatus) {
              changeStatus('msgIn', element.firstID, msgID)
              changeStatus('msgIn', element.secID, msgID)
              setStatus(sensorID, msgID)

              const firstTry = pathsMsg.filter(
                (msg) => msg.firstID === element.firstID && msg.secID === msg.secID
              )
              firstTry.length === 0
                ? addPath(element, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
                : retry(element, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
            }
          }

          if (element.dist > element.firstR && element.dist > element.secR) {
            const firstStatusNode = msg.value.msgStatus.find(
              (msg) => msg.nodeID === element.firstID && msg.msgID === msgID
            )

            if (firstStatusNode?.msgStatus !== 'msgOut') {
              changeStatus('msgIn', element.firstID, msgID)
              setStatus(sensorID, msgID)
            }
          }
        }
      }
    })
  }

  const findNodeAgain = (
    path: IAllPaths,
    msgID: number,
    sensorID: number,
    allSensors: ISensor[],
    allGWs: IGW[],
    serverMsg: IAllPaths[],
    pathsMsg: IAllPaths[]
  ) => {
    const nextNodeStatus = msg.value.msgStatus.find(
      (el) => path.secID === el.nodeID && el.msgID === path.msgID
    )

    if (nextNodeStatus?.msgStatus === 'msgIn') {
      changeStatus('msgIn', path.firstID, msgID)
      retry(path, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
    } else {
      hopCnt.value.allHopCnt.forEach((allhops) => {
        if (
          allhops.firstID === path.firstID &&
          allhops.secID === path.secID &&
          allhops.msgID === msgID
        ) {
          hopCnt.value.currentHop = allhops.hopCnt
        }
      })
      hopCnt.value.currentHop ? hopCnt.value.currentHop : (hopCnt.value.currentHop = 0)
      const thisMsg = msg.value.allMsgs.find(
        (msg) => msg.msgID === msgID && msg.sensorID === sensorID
      )
      if (hopCnt.value.currentHop > thisMsg!.hopCntMax) {
        const firstStatusNode = msg.value.msgStatus.find(
          (msg) => msg.nodeID === path.firstID && msg.msgID === msgID
        )

        if (firstStatusNode?.msgStatus !== 'msgOut') {
          changeStatus('msgDead', path.firstID, msgID)
        }
      } else if (hopCnt.value.currentHop <= thisMsg!.hopCntMax) {
        if (path.dist <= path.firstR && path.dist <= path.secR) {
          setHopCnt(path, msgID)
          changeStatus('msgOut', path.firstID, msgID)
          changeStatus('msgIn', path.secID, msgID)
          setStatus(sensorID, msgID)

          const firstTry = pathsMsg.filter(
            (msg) => msg.firstID === path.firstID && msg.secID === msg.secID
          )

          firstTry.length === 0
            ? addPath(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
            : retry(path, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
        }

        if (path.dist <= path.firstR && path.dist > path.secR) {
          setHopCnt(path, msgID)

          const secStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === path.secID)

          if (secStatusNode?.msgStatus !== 'msgIn') {
            changeStatus('msgIn', path.firstID, msgID)
            changeStatus('msgIn', path.secID, msgID)
            setStatus(sensorID, msgID)

            const firstTry = pathsMsg.filter(
              (msg) => msg.firstID === path.firstID && msg.secID === msg.secID
            )

            firstTry.length === 0
              ? addPath(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
              : retry(path, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
          } else if (!secStatusNode?.msgStatus) {
            changeStatus('msgIn', path.firstID, msgID)
            changeStatus('msgIn', path.secID, msgID)
            setStatus(sensorID, msgID)

            const firstTry = pathsMsg.filter(
              (msg) => msg.firstID === path.firstID && msg.secID === msg.secID
            )
            firstTry.length === 0
              ? addPath(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
              : retry(path, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
          }
        }

        if (path.dist > path.firstR && path.dist > path.secR) {
          const firstStatusNode = msg.value.msgStatus.find(
            (msg) => msg.nodeID === path.firstID && msg.msgID === msgID
          )

          if (firstStatusNode?.msgStatus !== 'msgOut') {
            changeStatus('msgIn', path.firstID, msgID)
            setStatus(sensorID, msgID)
          }
        }
      }
    }
  }

  const addPath = (
    path: IAllPaths,
    msgID: number,
    sensorID: number,
    allSensors: ISensor[],
    allGWs: IGW[],
    serverMsg: IAllPaths[],
    pathsMsg: IAllPaths[]
  ) => {
    hopCnt.value.allHopCnt.forEach((allhops) => {
      if (
        allhops.firstID === path.firstID &&
        allhops.secID === path.secID &&
        allhops.msgID === msgID
      ) {
        hopCnt.value.currentHop = allhops.hopCnt
      }
    })

    hopCnt.value.currentHop ? hopCnt.value.currentHop : (hopCnt.value.currentHop = 0)
    const thisMsg = msg.value.allMsgs.find(
      (msg) => msg.msgID === msgID && msg.sensorID === sensorID
    )
    if (hopCnt.value.currentHop <= thisMsg!.hopCntMax) {
      setTimeout(() => {
        if (path.secCov) {
          pathsMsg.push(path)
          changeStatus('msgServer', path.secID, msgID)
          setStatus(sensorID, msgID)
          const index = msg.value.msgStatus.findIndex(
            (msg) => msg.nodeID === path.secID && msg.msgID === path.msgID
          )
          if (index >= 0) {
            msg.value.msgStatus[index].msgCnt++
          }

          serverMsg.push(path)
          findServerPath(path, pathsMsg, serverMsg)
          findNextNode(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
        } else if (!path.secCov) {
          findNextNode(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
          pathsMsg.push(path)
        }

        setServerStatus(msgID, path)
        const firstStatusNode = msg.value.msgStatus.find(
          (msg) => msg.nodeID === path.firstID && msg.msgID === msgID
        )
        if (firstStatusNode?.msgStatus === 'msgIn') {
          retry(path, sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
        }
      }, 1000)
    }
  }
  const findServerPath = (element: IAllPaths, pathsMsg: IAllPaths[], serverMsg: IAllPaths[]) => {
    pathsMsg.forEach((pmsg) => {
      if (pmsg.secID === element.firstID) {
        serverMsg.push(pmsg)
      }
    })
    pathsMsg.forEach((pmsg) => {
      serverMsg.forEach((smsg) => {
        const status = msg.value.msgStatus.find((stat) => {
          stat.nodeID === pmsg.secID
        })
        if (smsg.firstID === pmsg.secID && status?.msgStatus !== 'msgIn') {
          serverMsg.push(pmsg)
        }
      })
    })
  }

  const retry = (
    path: IAllPaths,
    sensorID: number,
    allSensors: ISensor[],
    allGWs: IGW[],
    msgID: number,
    serverMsg: IAllPaths[],
    pathsMsg: IAllPaths[]
  ) => {
    hopCnt.value.allHopCnt.forEach((allhops) => {
      if (
        allhops.firstID === path.firstID &&
        allhops.secID === path.secID &&
        allhops.msgID === msgID
      ) {
        hopCnt.value.currentHop = allhops.hopCnt
      }
    })

    hopCnt.value.currentHop ? hopCnt.value.currentHop : (hopCnt.value.currentHop = 0)
    const thisMsg = msg.value.allMsgs.find(
      (msg) => msg.msgID === msgID && msg.sensorID === sensorID
    )
    if (hopCnt.value.currentHop <= thisMsg!.hopCntMax) {
      const firstStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === path.firstID)

      if (firstStatusNode?.msgStatus === 'msgOut') {
        return null
      } else if (!firstStatusNode) {
        return null
      } else if (firstStatusNode?.msgStatus !== 'msgOut') {
        const index_msg = paths.value.filterPathsMsg.findIndex(
          (el) => el.firstID === path.firstID && el.secID === path.secID
        )

        msg.value.retryMsg.some(
          (el) => el.firstID === path.firstID && el.secID === path.secID && el.msgID === msgID
        )
          ? null
          : msg.value.retryMsg.push(
              new MsgRetry(
                msgID,
                paths.value.filterPathsMsg[index_msg].firstID,
                paths.value.filterPathsMsg[index_msg].secID,
                1
              )
            )
        const index_retry = msg.value.retryMsg.findIndex(
          (el) => el.firstID === path.firstID && el.secID === path.secID && el.msgID === msgID
        )

        setTimeout(() => {
          if (msg.value.retryMsg[index_retry].retry < thisMsg!.retryCntMax) {
            msg.value.retryMsg[index_retry].retry++
            findNodeAgain(path, msgID, sensorID, allSensors, allGWs, serverMsg, pathsMsg)
            findFirstNode(sensorID, allSensors, allGWs, msgID, serverMsg, pathsMsg)
            const firstStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === path.firstID)
            const secStatusNode = msg.value.msgStatus.find((msg) => msg.nodeID === path.secID)
            if (path.secCov) {
              const index = msg.value.msgStatus.findIndex(
                (msg) => msg.nodeID === path.secID && msg.msgID === path.msgID
              )
              if (
                index >= 0 &&
                pathsMsg.some((msg) => msg.firstID === path.firstID && msg.secID === path.secID)
              ) {
                msg.value.msgStatus[index].msgCnt++
              }
            } else if (
              firstStatusNode?.msgStatus === 'msgIn' &&
              secStatusNode?.msgStatus === 'msgIn'
            ) {
              changeStatus('msgDead', path.firstID, msgID)
              changeStatus('msgDead', path.secID, msgID)
            }
          } else {
            changeStatus('msgDead', path.firstID, msgID)
          }
          setServerStatus(msgID, path)
          setStatus(sensorID, msgID)
        }, thisMsg!.time * 1000)
      }
    } else {
      changeStatus('msgDead', path.firstID, msgID)
    }
  }

  const changeStatus = (status: string, nodeID: number, msgID: number) => {
    const index = ref<number>()
    if (msg.value.msgStatus !== undefined) {
      index.value = msg.value.msgStatus.findIndex(
        (node) => node.nodeID === nodeID && node.msgID === msgID
      )

      index.value >= 0
        ? msg.value.msgStatus[index.value].msgStatus === 'msgServer'
          ? msg.value.msgStatus
          : msg.value.msgStatus[index.value].msgStatus === 'msgDead'
          ? msg.value.msgStatus
          : (msg.value.msgStatus[index.value].msgStatus = status)
        : msg.value.msgStatus.push(new MsgStatus(nodeID, msgID, status, 0))
    }
  }

  const setStatus = (sensorID: number, msgID: number) => {
    const firstNode = msg.value.msgStatus.find(
      (msg) => msg.nodeID === sensorID && msg.msgID == msgID
    )
    msg.value.servNodeStatus = msg.value.msgStatus.filter(
      (msg) => msg.msgStatus === 'msgServer' && msg.msgID === msgID
    )

    if (msg.value.servNodeStatus.length > 0) {
      msg.value.allMsgs[msgID].status = 'server'
    } else if (firstNode?.msgStatus === 'msgOut') {
      msg.value.allMsgs[msgID].status = 'delivered'
    } else if (firstNode?.msgStatus === 'msgIn') {
      msg.value.allMsgs[msgID].status = 'sending'
    } else if (firstNode?.msgStatus === 'msgDead') {
      msg.value.allMsgs[msgID].status = 'fail'
    }

    return msg.value.allMsgs[msgID].status
  }

  const setHopCnt = (path: IAllPaths, msgID: number) => {
    if (hopCnt.value.allHopCnt.every((hopcnt) => hopcnt.msgID !== msgID)) {
      hopCnt.value.allHopCnt.push(new HopCnt(path.firstID, path.secID, 1, msgID))
    } else if (
      hopCnt.value.allHopCnt.some(
        (hopcnt) =>
          hopcnt.msgID === msgID && path.firstID === hopcnt.firstID && path.secID !== hopcnt.secID
      )
    ) {
      const sameFirstID = hopCnt.value.allHopCnt.find(
        (hopcnt) =>
          hopcnt.msgID === msgID && path.firstID === hopcnt.firstID && path.secID !== hopcnt.secID
      )
      hopCnt.value.allHopCnt.push(new HopCnt(path.firstID, path.secID, sameFirstID!.hopCnt, msgID))
    } else if (
      hopCnt.value.allHopCnt.some(
        (hopcnt) =>
          hopcnt.msgID === msgID && path.firstID !== hopcnt.firstID && path.secID === hopcnt.secID
      )
    ) {
      const sameSecID = hopCnt.value.allHopCnt.find(
        (hopcnt) =>
          hopcnt.msgID === msgID && path.firstID !== hopcnt.firstID && path.secID === hopcnt.secID
      )
      hopCnt.value.allHopCnt.push(
        new HopCnt(path.firstID, path.secID, sameSecID!.hopCnt + 1, msgID)
      )
    }

    hopCnt.value.allHopCnt.forEach((hopcnt) => {
      if (
        path.firstID === hopcnt.firstID &&
        path.secID === hopcnt.secID &&
        hopcnt.msgID === msgID
      ) {
        if (
          hopCnt.value.allHopCnt.some((hops) => {
            hops.firstID === path.secID && hops.secID === path.firstID
          })
        ) {
          hopcnt.hopCnt = hopcnt.hopCnt + 1
        }
      } else if (
        hopcnt.msgID === msgID &&
        path.firstID === hopcnt.secID &&
        path.secID !== hopcnt.firstID
      ) {
        hopcnt.firstID = path.firstID
        hopcnt.secID = path.secID
        hopcnt.hopCnt = hopcnt.hopCnt + 1
      }
    })
  }

  const setServerStatus = (msgID: number, path: IAllPaths) => {
    const index = msg.value.msgStatus.findIndex(
      (stat) => stat.msgStatus === 'msgServer' && stat.msgID === msgID && stat.nodeID === path.secID
    )
    if (index >= 0) {
      hopCnt.value.servHopCnt = hopCnt.value.allHopCnt.filter(
        (hops) =>
          hops.secID === msg.value.msgStatus[index].nodeID &&
          hops.msgID === msg.value.msgStatus[index].msgID
      )
    }

    hopCnt.value.servHopCnt.forEach((serv) => {
      const iServerStatus = msg.value.server.findIndex(
        (stat) =>
          serv.firstID === stat.firstID && serv.secID === stat.secID && serv.msgID === stat.msgID
      )

      if (
        index >= 0 &&
        iServerStatus >= 0 &&
        msg.value.msgStatus[index].msgCnt === msg.value.server[iServerStatus].msgCnt
      ) {
        return
      } else if (
        index >= 0 &&
        iServerStatus >= 0 &&
        msg.value.msgStatus[index].msgCnt !== msg.value.server[iServerStatus].msgCnt
      ) {
        msg.value.server[iServerStatus].msgCnt = msg.value.msgStatus[index].msgCnt
      } else if (iServerStatus < 0) {
        msg.value.server.push(
          new Server(
            msgID,
            serv.hopCnt,
            msg.value.msgStatus[index].msgCnt,
            serv.firstID,
            serv.secID
          )
        )
      }
    })
  }
  const chosenMsg = ref<IMsgBuilder>()
  const setPaths = (id: number) => {
    chosenMsg.value = msg.value.allMsgs.find((element) => element.msgID === id)
    paths.value.showPaths = !paths.value.showPaths
  }

  const resetSystem = () => {
    msg.value.ID = -1
    msg.value.allMsgs = []
    msg.value.msgStatus = []
    paths.value.filterPathsMsg = []
    msg.value.retryMsg = []
    paths.value.allPathsMsg = []
    msg.value.servNodeStatus = []
    msg.value.server = []
    hopCnt.value.servHopCnt = []
    hopCnt.value.allHopCnt = []
  }

  return {
    buildMsg,
    setPaths,
    chosenMsg,
    resetSystem,
    findFirstNode,
    hopCnt,
    setStatus,
    paths,
    msg
  }
})
