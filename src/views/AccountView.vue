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
            <div v-if="urlID < 0" class="absolute right-0 flex h-full justify-center items-center p-2">
                <button class="p-2 md:p-3 lg:p-4" @click="$router.push({ name: 'settings' })">
                    <Cog6ToothIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </button>
            </div>
        </div>
        <div class="flex flex-col grow h-full w-full">
            <div class="flex flex-col grow h-full w-full p-4 space-y-4">
                <div class="flex flex-col justify-center w-full h-fit p-2 space-y-2">
                    <div class="flex justify-center items-center w-full">
                        <div class="flex justify-center">
                            <div class="h-24 w-24 rounded-full bg-white dark:bg-slate-800">

                            </div>
                        </div>
                        <div class="flex flex-col w-full justify-center items-start p-4 space-y-2">
                            <p class="text-2xl font-semibold"> {{ user?.pseudo ?? '- - - - -' }} </p>
                            <div v-if="!ownUser"
                                class="flex w-fit max-w-full h-fit max-h-full justify-center items-center">
                                <button class="flex bordered w-fit h-fit p-1" @click="toggleFollow">
                                    <CheckIcon v-if="followed" class="w-6 h-6 mx-0.5" />
                                    <UserPlusIcon v-else class="w-6 h-6 mx-0.5" />
                                    <p class="mx-2">
                                        <GetText
                                            :context="Lang.CreateTranslationContext('account', followed ? 'Followed' : 'Follow')" />
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center opacity-70">
                        <p class="italic text-center text-sm text-ellipsis overflow-hidden line-clamp-2"> {{ user?.bio
                            }}
                        </p>
                    </div>
                </div>
                <div class="flex justify-center p-2 w-full h-fit">
                    <div class="flex flex-col space-y-1 justify-center items-center w-1/2 h-fit">
                        <p class="text-xl font-bold"> {{ user?.nbFollowers ?? '--' }} </p>
                        <p class="text-base">
                            <GetText :context="Lang.CreateTranslationContext('account', 'Followers')" />
                        </p>
                    </div>
                    <span class="flex h-full w-0.5 bg-slate-600 dark:bg-slate-400 mx-4 rounded-full" />
                    <div class="flex flex-col space-y-1 justify-center items-center w-1/2 h-fit">
                        <p class="text-xl font-bold"> {{ user?.nbFollowing ?? '--' }} </p>
                        <p class="text-base">
                            <GetText :context="Lang.CreateTranslationContext('account', 'Following')" />
                        </p>
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
import { CheckIcon, Cog6ToothIcon, UserPlusIcon } from '@heroicons/vue/24/outline';
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
        Cog6ToothIcon,
        UserPlusIcon,
        CheckIcon
    },
    setup() {
        return {
            Lang
        }
    },
    data() {
        return {
            user: undefined as User | undefined,
            urlID: parseInt(new URLSearchParams(window.location.search).get('id') ?? '-1'),
            followed: false
        }
    },
    mounted() {
        this.loadUser();
    },
    computed: {
        ownUser() {
            return this.urlID < 0 || this.urlID === User.CurrentUser?.id;
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
                this.followed = res.data.followed;
                if (this.ownUser) {
                    User.CurrentUser?.update(res.data);
                }
            }
        },
        logout() {
            User.Forget();
        },
        async toggleFollow() {
            if (!this.user) return;

            this.followed = !this.followed;
            if (this.followed) {
                await API.RequestLogged(ROUTES.USERS.FOLLOW(this.user.id));
            } else {
                await API.RequestLogged(ROUTES.USERS.UNFOLLOW(this.user.id));
            }

            this.loadUser();
        }
    }
});
</script>
