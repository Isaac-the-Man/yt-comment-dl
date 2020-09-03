import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from "vue-axios";
import { VueReCaptcha } from "vue-recaptcha-v3";

Vue.config.productionTip = false

Vue.use(VueAxios, axios);
Vue.use(VueReCaptcha, { siteKey: '6Le2_sYZAAAAAOeR64sqL_QBBzFDELxY5WZoMXx5' });

new Vue({
  render: h => h(App),
}).$mount('#app')
