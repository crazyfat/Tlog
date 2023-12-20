import { PWD } from '../types'
import { PwdType } from '../../interface'

const initState: PwdType = {
  ids: [0],
  path: ['~'],
}
export default (state: PwdType = initState, action) => {
  const { type, data } = action
  switch (type) {
    case PWD.POP_PWD:
      const newIds = state.ids
      const newPath = state.path
      newIds.pop()
      newPath.pop()
      return {
        ids: [...newIds],
        path: [...newPath],
      }
    case PWD.PUSH_PWD:
      return {
        ids: [...state.ids, data.ids],
        path: [...state.path, data.path],
      }
    default:
      return state
  }
}
