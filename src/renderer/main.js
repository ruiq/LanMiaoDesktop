// TODO：如果不用，记得注释掉，否则travis 和 appveyor 构建会失败
// import devtools from '@vue/devtools'
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
// import Vuetify from 'vuetify' // 引入Vuetify
import vuetify from '../plugins/vuetify' // path to vuetify export

import 'vuetify/dist/vuetify.min.css' // 引入Vuetify的css文件
import 'material-design-icons-iconfont/dist/material-design-icons.css' // 引入Material Desgin Icon的css文件
import {
  Upload,
  Button
} from 'element-ui'
import moment from 'moment'; //导入模块

moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn'); 


console.log('moment : ', moment());
Vue.prototype.$moment = moment; //赋值使用

// Vue.use(vuetify)
Vue.use(Button)
Vue.use(Upload)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  vuetify,
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// if (process.env.NODE_ENV === 'development') {
//     devtools.connect('localhost', '9080')
// }