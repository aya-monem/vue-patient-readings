import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import store from './store';
import axios from 'axios';

Vue.use(Vuetify);
window.axios = axios

Vue.config.productionTip = false

new Vue({
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app')
