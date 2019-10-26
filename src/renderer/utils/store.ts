import Store from 'electron-store'
import { Source } from '../domains/source'

type Scheme = {
  config: {
    appearance: {
      width: number
      height: number
    }
  }
  sources: Source[]
}

export const store = new Store<Scheme>({
  // schema: {
  //   config: {
  //     type: 'object',
  //     properties: {
  //       appearance: {
  //         type: 'object',
  //         properties: {
  //           width: {
  //             type: 'number',
  //             default: 1024
  //           },
  //           height: {
  //             type: 'number',
  //             default: 728
  //           }
  //         }
  //       }
  //     }
  //   },
  //   items: {
  //     type: 'array',
  //     default: []
  //   }
  // }
})
