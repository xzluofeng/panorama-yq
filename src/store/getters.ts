const getters = {
  homeFontSize: (state: any) => {
    return state.fontSize > 24 ? 24 : state.fontSize
  }
}
export default getters
