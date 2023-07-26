import { reactive } from 'vue'
import type { ImapSetting } from './interface'
import type { Iprojection } from './interface'

const mapSetting: ImapSetting = {
  zoom: 2,
  rotation: 0,
  size: [7001, 4001],
  get centerImg() {
    return [this.size[0] / 2, this.size[1] / 2]
  },
  get extent() {
    return [0, 0, ...this.size]
  }
}

const projection: Iprojection = reactive({
  code: 'xkcd-image',
  units: 'pixels',
  extent: mapSetting.extent
})

export { mapSetting, projection }
