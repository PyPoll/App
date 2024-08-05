<template>
    <div class="show-left flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">Account</p>
            </div>
        </div>
        <div class="flex flex-col grow h-full w-full">
            <div class="flex flex-col grow h-full w-full p-4">
                <div class="flex flex-col justify-center w-full h-fit">
                    <div class="flex justify-center">
                        <div class="h-32 w-32 rounded-full bg-white dark:bg-slate-800">

                        </div>
                    </div>
                    <div class="flex justify-center pt-2">
                        <p class="text-2xl font-semibold"> {{ user?.pseudo ?? '- - - - -' }} </p>
                    </div>
                    <div class="flex justify-center text-slate-500 dark:text-slate-400">
                        <p class="italic whitespace-nowrap text-ellipsis overflow-hidden"> {{ user?.bio }} </p>
                    </div>
                    <div class="flex justify-center p-2">
                        <div class="flex space-x-2">
                            <p> {{ user?.nbFollowers ?? '--' }} </p>
                            <p> Followers </p>
                        </div>
                        <span class="h-full w-0.5 bg-slate-600 dark:bg-slate-400 mx-4 rounded-full" />
                        <div class="flex space-x-2">
                            <p> {{ user?.nbFollowing ?? '--' }} </p>
                            <p> Following </p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full h-full">
                    <div class="flex overflow-x-hidden overflow-y-auto p-4">
                        <div v-if="ownUser && !viewMode" class="flex flex-col space-y-4 w-full">
                            <button v-for="menu in menus" :key="menu.label" @click="menu.onclick()"
                                class="flex bordered p-2 w-full max-w-[14em] mx-auto">
                                <div class="flex justify-center items-center h-full w-fit">
                                    <component :is="menu.icon" class="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div class="flex justify-center items-center h-full w-full">
                                    <p> {{ menu.label }} </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '../components/BackButtonView.vue';
import ButtonView from '@/components/ButtonView.vue';
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline';
import User from '@/scripts/User';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ButtonView
    },
    setup() {
        return {}
    },
    data() {
        return {
            user: undefined as User | undefined,
            urlID: parseInt(new URLSearchParams(window.location.search).get('id') ?? '' + User.CurrentUser?.id),
            viewMode: window.location.search.includes('id='),
            menus: [
                {
                    label: 'Settings',
                    icon: Cog6ToothIcon,
                    onclick: () => this.$router.push({ name: 'settings' })
                },
                {
                    label: 'Polls',
                    icon: DocumentChartBarIcon,
                    onclick: () => this.$router.push({ name: 'polls' })
                },
                {
                    label: 'Logout',
                    icon: ArrowLeftStartOnRectangleIcon,
                    onclick: () => this.logout()
                }
            ]
        }
    },
    mounted() {
        this.loadUser();
    },
    computed: {
        ownUser() {
            return this.user?.id === this.urlID || !this.viewMode;
        }
    },
    methods: {
        async loadUser() {
            const res = await API.RequestLogged(ROUTES.USERS.GET(this.urlID));
            if (res.error) {
                console.error(res.error);
            } else {
                this.user = res.data;
            }
        },
        logout() {
            User.Forget();
        }
    }
});
</script>
