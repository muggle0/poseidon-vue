import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import axios from './axios'
import global from './globalFun'
import SIdentify from './views/Identify.vue'


Vue.component("SIdentify",SIdentify);

Vue.prototype.$axios = axios //
Vue.config.productionTip = false

// require("./mock.js")

Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
