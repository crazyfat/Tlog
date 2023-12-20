const initState = {
  num: 0
}
export default (state = initState, action) => {
  const { type, data } = action
  switch (type) {
    case 'add':
      return {
        num: state.num + 2
      }
    case 'sub':
      return {
        num: state.num - 2
      }
    default:
      return state
  }
}
