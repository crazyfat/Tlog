import { MENU } from '../types'

const initState = {}
export default (state = initState, action) => {
  const { type, data } = action
  switch (type) {
    case MENU.ADD_CUR_MENU:
      return {
        ...state,
        [data.mid]: { ...data },
      }
    default:
      return state
  }
}
