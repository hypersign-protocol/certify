import Vue from 'vue'
import App from './App.vue'
import store from './store';
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';
import { BootstrapVue, BootstrapVueIcons, IconsPlugin} from 'bootstrap-vue'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false
Vue.component('vue-loader', Loading)
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(IconsPlugin)
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

