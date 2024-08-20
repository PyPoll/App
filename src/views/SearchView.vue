<template>
    <div class="show-right flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
                    <GetText :context="Lang.CreateTranslationContext('search', 'Search')" />
                </p>
            </div>
        </div>
        <div class="flex flex-col p-2 min-h-0 max-h-full h-full w-full space-y-4">
            <div class="flex space-x-4 justify-center items-center">
                <button class="flex w-fit h-fit">
                    <AdjustmentsHorizontalIcon class="w-6 h-6" />
                </button>
                <div class="flex space-x-2 bordered justify-center items-center">
                    <InputView type="text" name="search" class="border-none focus:outline-none" />
                    <button class="flex w-fit h-fit p-2" @click="search">
                        <MagnifyingGlassIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div class="flex flex-col min-h-0 max-h-full h-full w-full">
                <div v-if="results?.users && results.users.length" class="show-up">
                    <p class="text-xl font-bold text-left">
                        <GetText :context="Lang.CreateTranslationContext('search', 'Users')" />
                    </p>
                    <div class="flex flex-col space-y-2">
                        <UserCard v-for="user in results.users" :key="user.id" :user="user" />
                    </div>
                </div>
                <div v-if="results?.polls && results.polls.length" class="show-up">
                    <p class="text-xl font-bold text-left">
                        <GetText :context="Lang.CreateTranslationContext('search', 'Polls')" />
                    </p>
                    <div class="flex flex-col space-y-2">
                        <PollCard v-for="poll in results.polls" :key="poll.id" :poll="poll" />
                    </div>
                </div>
                <div v-if="results && ((!results.users) || (!results.users.length)) && ((!results.polls) || (!results.polls.length))"
                    class="show-up flex flex-col justify-center items-center py-20">
                    <p class="text-xl font-bold text-center">
                        <GetText :context="Lang.CreateTranslationContext('search', 'NoResults')" />
                    </p>
                    <p class="text-lg text-center">
                        <GetText :context="Lang.CreateTranslationContext('search', 'NoResultsDesc')" />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '../components/BackButtonView.vue';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';
import InputView from '@/components/InputView.vue';
import UserCard from '@/components/search/UserCard.vue';
import PollCard from '@/components/search/PollCard.vue';

import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        GetText,
        InputView,
        UserCard,
        PollCard,
        MagnifyingGlassIcon,
        AdjustmentsHorizontalIcon
    },
    setup() {
        return {
            Lang,
            input: null as HTMLInputElement | null,
            results: null as any // {users:[],polls:[]}
        }
    },
    mounted() {
        this.input = this.$el.querySelector('input[name=search]');
        this.input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.search();
        });
    },
    methods: {
        async search() {
            if (!this.input) return;
            const query = this.input.value;

            const res = await API.RequestLogged(ROUTES.SEARCH(query));
            if (res.error) {
                console.error(res.message);
                return;
            }

            this.results = res.data;
            this.$forceUpdate();
        }
    }
});
</script>
