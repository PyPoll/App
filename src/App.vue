<template>
    <div ref="content"
        class="flex flex-col w-full h-full bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-50 overflow-hidden">
        <RouterView />
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { RouterView } from 'vue-router';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import { Toast } from '@capacitor/toast';
import { App as CapacitorApp } from '@capacitor/app';
import { API } from './scripts/API';
import User from './scripts/User';
import ROUTES from './scripts/routes';

export default Vue.defineComponent({
    components: {
        RouterView
    },
    methods: {

    },
    computed: {
        page() {
            return this.$route.path.split('/')[1] || '';
        }
    },
    setup() {
        return {}
    },
    mounted() {
        // change color bar to match background color
        const content = this.$refs["content"] as HTMLElement;
        const backgroundColor = getComputedStyle(content).backgroundColor;
        const rgb = backgroundColor.match(/\d+/g);
        if (!rgb || rgb.length < 2) return;
        const hex = `#${parseInt(rgb[0]).toString(16)}${parseInt(rgb[1]).toString(16)}${parseInt(rgb[2]).toString(16)}`;
        const lightMode = rgb.reduce((acc, val) => acc + parseInt(val), 0) / 3 > 128;
        StatusBar.setBackgroundColor({ color: hex }).catch(() => { });
        StatusBar.setStyle({ style: lightMode ? StatusBarStyle.Light : StatusBarStyle.Dark }).catch(() => { });

        // handle back button
        let lastBack = 0;
        CapacitorApp.addListener('backButton', () => {
            if (this.$route.path !== '/') {
                this.$router.push('/');
            } else {
                const now = Date.now();
                if (now - lastBack < 3000) { // 3 seconds
                    CapacitorApp.exitApp();
                } else {
                    lastBack = now;
                    Toast.show({ text: 'Press back again to exit' });
                }
            }
        });

        // setup api
        API.Setup(import.meta.env.VITE_API_URL);

        // Check if user is still valid
        if (User.CurrentUser) {
            API.RequestLogged(ROUTES.USERS.ME.GET()).then(res => {
                if (res.error) {
                    console.error(res.message);
                    User.Forget();
                } else {
                    User.CurrentUser?.update(res.data);
                }
            }).catch(console.error);
        }
    }
});
</script>
