<template>
    <div class="show-left flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
                    <GetText :context="Lang.CreateTranslationContext('account', 'Account')" />
                </p>
            </div>
            <div v-if="urlID >= 0" class="absolute right-0 flex h-full justify-center items-center p-2">
                <button class="p-2 md:p-3 lg:p-4" @click="$router.push({ name: 'settings' })">
                    <Cog6ToothIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </button>
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
                    <div class="flex justify-center p-2">
                        <div class="flex space-x-2">
                            <p> {{ user?.nbFollowers ?? '--' }} </p>
                            <p>
                                <GetText :context="Lang.CreateTranslationContext('account', 'Followers')" />
                            </p>
                        </div>
                        <span class="h-full w-0.5 bg-slate-600 dark:bg-slate-400 mx-4 rounded-full" />
                        <div class="flex space-x-2">
                            <p> {{ user?.nbFollowing ?? '--' }} </p>
                            <p>
                                <GetText :context="Lang.CreateTranslationContext('account', 'Following')" />
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-center opacity-70">
                        <p class="italic text-center text-ellipsis overflow-hidden line-clamp-3"> {{ user?.bio }}
                        </p>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full h-full">

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '../components/BackButtonView.vue';
import ButtonView from '@/components/ButtonView.vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import User from '@/scripts/User';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ButtonView,
        GetText,
        Cog6ToothIcon
    },
    setup() {
        return {
            Lang
        }
    },
    data() {
        return {
            user: undefined as User | undefined,
            urlID: parseInt(new URLSearchParams(window.location.search).get('id') ?? '-1')
        }
    },
    mounted() {
        this.loadUser();
    },
    computed: {
        ownUser() {
            return this.urlID < 0 || this.user?.id === this.urlID;
        }
    },
    methods: {
        async loadUser() {
            const res = await API.RequestLogged(this.ownUser ? ROUTES.USERS.ME.GET() : ROUTES.USERS.GET(this.urlID));
            if (res.error) {
                console.error(res.message);
                if (res.status === 404) {
                    User.Forget();
                }
            } else {
                this.user = res.data;
                if (this.ownUser) {
                    User.CurrentUser?.update(res.data);
                }
            }
        },
        logout() {
            User.Forget();
        }
    }
});
</script>
