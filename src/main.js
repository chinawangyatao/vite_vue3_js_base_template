import { createApp } from 'vue';
import App from './App.vue';

//  css
import 'normalize.css';
import '@/styles/index.scss';

// 注册指令
import plugins from './plugins'; // plugins
import store from '@/store/index.js';
import router from '@/router/index.js';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(plugins);
app.mount('#app');
