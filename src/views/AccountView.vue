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
            <div v-if="editMode" class="absolute right-0 flex h-full justify-center items-center p-2">
                <button class="p-2 md:p-3 lg:p-4" @click="$router.push({ name: 'settings' })">
                    <Cog6ToothIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </button>
            </div>
        </div>
        <div class="flex flex-col grow min-h-0 max-h-full h-full w-full space-y-8 overflow-auto">
            <div class="flex flex-col grow h-fit w-full p-4 space-y-4">
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
                        <p class="italic text-center text-sm text-ellipsis overflow-hidden line-clamp-2">
                            <FormatText :text="user?.bio ?? ''" />
                        </p>
                    </div>
                </div>
                <div class="flex justify-center p-2 w-full h-fit">
                    <button class="flex flex-col space-y-1 justify-center items-center w-1/2 h-fit"
                        @click="displayFollowers">
                        <p class="text-xl font-bold"> {{ user?.nbFollowers ?? '--' }} </p>
                        <p class="text-base">
                            <GetText :context="Lang.CreateTranslationContext('account', 'Followers')" />
                        </p>
                    </button>
                    <span class="flex h-full w-0.5 bg-slate-600 dark:bg-slate-400 mx-4 rounded-full" />
                    <button class="flex flex-col space-y-1 justify-center items-center w-1/2 h-fit"
                        @click="displayFollowing">
                        <p class="text-xl font-bold"> {{ user?.nbFollowing ?? '--' }} </p>
                        <p class="text-base">
                            <GetText :context="Lang.CreateTranslationContext('account', 'Following')" />
                        </p>
                    </button>
                </div>
            </div>
            <div class="flex flex-col h-full w-full sticky top-0">
                <div>
                    <p class="text-xl font-bold text-center p-2">
                        <GetText :context="Lang.CreateTranslationContext('account', 'Polls')" />
                    </p>
                </div>
                <div class="flex px-2"><span class="flex bg-slate-500 h-0.5 w-full rounded-full" /></div>
                <div class="flex flex-col px-4 min-h-0 max-h-full h-full overflow-auto">
                    <div class="h-full w-full overflow-scroll snap-mandatory snap-y no-scrollbar">
                        <PollView v-for="poll in accountPolls" :key="poll.id" :poll="poll" />
                    </div>
                </div>
            </div>
        </div>
        <ModalView ref="users-popup">
            <div class="flex flex-col justify-center items-center space-y-4 min-h-0 max-h-full">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-semibold">
                        {{ popupTitle }}
                    </p>
                </div>
                <div class="flex overflow-y-auto h-full w-full">
                    <div class="flex flex-col space-y-4 min-w-0 max-w-full">
                        <UserCard :user="user" v-for="user in popupUsers" :key="user.pseudo" />
                    </div>
                    <div v-show="!popupUsers.length">
                        <p class="text-center text-md font-base">
                            <GetText :context="Lang.CreateTranslationContext('account', 'NoUsers')" />
                        </p>
                    </div>
                </div>
            </div>
        </ModalView>
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
import PollView from '@/components/content/PollView.vue';
import FormatText from '@/components/content/FormatText.vue';
import ModalView from '@/components/ModalView.vue';
import UserCard from '@/components/search/UserCard.vue';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ButtonView,
        GetText,
        Cog6ToothIcon,
        UserPlusIcon,
        CheckIcon,
        PollView,
        ModalView,
        UserCard,
        FormatText
    },
    data() {
        return {
            Lang,
            user: undefined as User | undefined,
            urlID: parseInt(new URLSearchParams(window.location.search).get('id') ?? '-1'),
            followed: false,
            accountPolls: [] as any[],
            popupTitle: '',
            popupUsers: [] as User[]
        }
    },
    mounted() {
        this.loadUser();
        this.loadAccountPolls();
    },
    computed: {
        ownUser() {
            return this.editMode || this.urlID === User.CurrentUser?.id;
        },
        editMode() {
            return this.urlID < 0;
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
        async loadAccountPolls() {
            if (!User.CurrentUser) return;

            const res = await API.RequestLogged(ROUTES.USERS.POLLS((this.urlID >= 0) ? this.urlID : User.CurrentUser.id));
            if (res.error) {
                console.error(res.message);
            } else {
                this.accountPolls = res.data;
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
        },
        async displayFollowers() {
            if (!this.user) return;

            this.popupTitle = await Lang.GetTextAsync(Lang.CreateTranslationContext('account', 'Followers'));

            const res = await API.RequestLogged(ROUTES.USERS.FOLLOWERS(this.user.id));
            if (res.error) {
                console.error(res.message);
            }

            this.popupUsers = res.data;
            (this.$refs['users-popup'] as any).show();
        },
        async displayFollowing() {
            if (!this.user) return;

            this.popupTitle = await Lang.GetTextAsync(Lang.CreateTranslationContext('account', 'Following'));

            const res = await API.RequestLogged(ROUTES.USERS.FOLLOWING(this.user.id));
            if (res.error) {
                console.error(res.message);
                return;
            }

            this.popupUsers = res.data;
            (this.$refs['users-popup'] as any).show();
        }
    }
});
</script>
