/*
 * @Descripttion: vue入口配置文件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 17:32:21
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

import './style/element.scss'
import './style/reset.scss'
import './style/common.scss'
import './assets/font/iconfont/iconfont.css'
// import './style/index.scss'

Vue.prototype.$config = window.CONFIG

import 'amfe-flexible/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'medium', zIndex: 3000 })

Vue.config.productionTip = false

// 实际打包时应该不引入mock
// if (process.env.NODE_ENV !== 'production') {
//   require('@/mock')
// }

import API from './api/index'
Vue.prototype.$api = API

// 日期处理插件
import moment from 'moment'
import 'moment/locale/zh-cn'
Vue.prototype.$moment = moment

import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
