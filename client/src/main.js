import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
const pinia = createPinia();

app
  .use(router)
  .use(pinia)
  .mount('#app')
