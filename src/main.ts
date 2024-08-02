import './style.css';

import { createApp } from 'vue';
import VueApp from './App.vue';
import router from './router';
import { App, type URLOpenListenerEvent } from '@capacitor/app';

const app = createApp(VueApp);
app.use(router);
app.mount('#app');

App.addListener('appUrlOpen', function (event: URLOpenListenerEvent) {
    const url = event.url;
    const hostRegex = /(http(s)?:\/\/)?.*\.(fr|com)(\/)?/
    const slug = url.match(hostRegex)?.input?.replace(hostRegex, '');
    if (slug) router.push('/' + slug);
});
