import { PWD } from '../types'
import type { MENU } from '../types'

export function pushPwd(menu: MENU) {
  return {
    type: PWD.PUSH_PWD,
    data: menu,
  }
}
export function popPwd() {
  return {
    type: PWD.POP_PWD,
    data: {},
  }
}
