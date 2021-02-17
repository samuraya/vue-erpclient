import Vue from 'vue'
import VueQrcodeReader from "vue-qrcode-reader";
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'


import vuetify from '@/plugins/vuetify.js'
import Vuelidate from 'vuelidate';

import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(VueQrcodeReader);
Vue.use(Vuelidate);

new Vue({
	vuetify,
	render: h => h(App),
}).$mount('#app')


