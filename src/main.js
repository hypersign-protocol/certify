import Vue from 'vue'
import App from './App.vue'
import store from './store';
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';
import { BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.component('vue-loader', Loading)
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

