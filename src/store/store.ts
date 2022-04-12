import Vue from 'vue'
import Vuex from 'vuex'
import vuexPersistedstate from 'vuex-persistedstate'
import getters from './getters'
import actions from './actions'
import state from './state'
import mutations from './mutations'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexPersistedstate()]
})
