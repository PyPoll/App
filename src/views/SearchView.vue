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
            <div class="flex justify-center items-center">
                <button class="flex w-fit h-fit px-4" @click="openFilters">
                    <FunnelIcon class="w-6 h-6" />
                </button>
                <div class="flex space-x-2 bordered justify-center items-center">
                    <InputView type="text" name="search" class="border-none focus:outline-none" />
                    <button class="flex w-fit h-fit p-2" @click="search">
                        <MagnifyingGlassIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div class="flex flex-col min-h-0 max-h-full h-full w-full space-y-4">
                <div v-if="results?.users && results.users.length" class="show-up">
                    <p class="text-xl font-bold text-left py-2">
                        <GetText :context="Lang.CreateTranslationContext('search', 'Users')" />
                    </p>
                    <div class="flex flex-col space-y-2 px-2">
                        <UserCard v-for="user in results.users" :key="user.id" :user="user" />
                    </div>
                </div>
                <div v-if="results?.polls && results.polls.length" class="show-up">
                    <p class="text-xl font-bold text-left py-2">
                        <GetText :context="Lang.CreateTranslationContext('search', 'Polls')" />
                    </p>
                    <div class="flex flex-col space-y-2 px-2">
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
        <ModalView ref="modal-filters">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex flex-col justify-center items-center">
                    <p class="flex text-xl font-semibold whitespace-nowrap space-x-2">
                        <GetText :context="Lang.CreateTranslationContext('search', 'Filters')" />
                    </p>
                </div>
                <div class="flex flex-col space-y-4">
                    <div class="flex space-x-4 justify-start items-center w-full">
                        <CheckboxView name="displayUsers" :selected="filter.users"
                            :onChange="value => filter.users = value" />
                        <p class="text-lg whitespace-nowrap">
                            <GetText :context="Lang.CreateTranslationContext('search', 'DisplayUsers')" />
                        </p>
                    </div>
                    <div class="flex space-x-4 justify-start items-center w-full">
                        <CheckboxView name="displayPolls" :selected="filter.polls"
                            :onChange="value => filter.polls = value" />
                        <p class="text-lg whitespace-nowrap">
                            <GetText :context="Lang.CreateTranslationContext('search', 'DisplayPolls')" />
                        </p>
                    </div>
                </div>
                <div class="flex justify-end w-full pt-2">
                    <ButtonView @click="hideFilters">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Validate')" />
                    </ButtonView>
                </div>
            </div>
        </ModalView>
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
    FunnelIcon
} from '@heroicons/vue/24/outline';

import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import ModalView from '@/components/ModalView.vue';
import CheckboxView from '@/components/CheckboxView.vue';
import ButtonView from '@/components/ButtonView.vue';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        GetText,
        InputView,
        UserCard,
        PollCard,
        MagnifyingGlassIcon,
        FunnelIcon,
        ModalView,
        CheckboxView,
        ButtonView
    },
    setup() {
        return {
            Lang,
            input: null as HTMLInputElement | null,
            filter: {
                users: true,
                polls: true
            },
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
            if (!query || query.length < 3) return;

            const res = await API.RequestLogged(ROUTES.SEARCH(query, this.filter.users, this.filter.polls));
            if (res.error) {
                console.error(res.message);
                return;
            }

            this.results = res.data;
            this.$forceUpdate();
        },
        openFilters() {
            const modal = this.$refs['modal-filters'] as typeof ModalView;
            if (!modal) return;

            modal.show();
        },
        hideFilters() {
            const modal = this.$refs['modal-filters'] as typeof ModalView;
            if (!modal) return;

            modal.hide();
            this.search();
        }
    }
});
</script>
