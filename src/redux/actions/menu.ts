import { MENU } from '../types'

export function addMenu(menu) {
  return {
    type: MENU.ADD_CUR_MENU,
    data: menu,
  }
}
