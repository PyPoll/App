<template>
    <div class="flex flex-col w-full h-full space-y-2 p-2 md:p-3 lg:p-4">
        <div ref="contentView" class="show-down h-full w-full overflow-scroll snap-mandatory snap-y no-scrollbar">
            <PollView v-for="(poll, index) in polls" :key="index" :poll="poll" />
        </div>
        <div class="show-up flex h-fit w-full min-h-0 max-h-full pb-1 md:pb-2 lg:pb-3">
            <div class="flex h-fit w-full justify-between items-center px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-3">
                <DashButtonView @click="$router.push({ name: 'search' })">
                    <MagnifyingGlassIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </DashButtonView>
                <button @click="$router.push({ name: 'create' })" class="mx-auto">
                    <div
                        class="bg-indigo-500 dark:bg-indigo-500 p-2 rounded-lg shadow-indigo-500/[0.5] dark:shadow-indigo-500/[0.5] text-white glow-2">
                        <PlusIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    </div>
                </button>
                <DashButtonView @click="$router.push({ name: 'account' })">
                    <UserIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </DashButtonView>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import PollView from '../components/content/PollView.vue';

import DashButtonView from '../components/home/DashButtonView.vue';
import {
    UserIcon,
    MagnifyingGlassIcon,
    PlusIcon
} from '@heroicons/vue/24/outline';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';

export default Vue.defineComponent({
    components: {
        PollView,
        DashButtonView,
        UserIcon,
        MagnifyingGlassIcon,
        PlusIcon
    },
    setup() {
        return {}
    },
    data() {
        return {
            polls: [] as any[]
        }
    },
    mounted() {
        const contentView = this.$refs['contentView'] as HTMLElement;

        // Prevent the user from scrolling past the next poll
        let scrolling = false;
        let scrollingTimeout: any = null;
        contentView.addEventListener("scroll", () => {
            if (!scrolling) {
                scrolling = true;
                this.onScrollStart();
            }

            if (scrollingTimeout) clearTimeout(scrollingTimeout);
            scrollingTimeout = setTimeout(() => {
                scrolling = false;
                this.onScrollEnd();
            }, 100);
        });

        this.addPoll();
        this.addPoll();
    },
    methods: {
        onScrollStart() {

        },
        onScrollEnd() {
            const contentView = this.$refs['contentView'] as HTMLElement;
            const contentViewHeight = contentView.clientHeight;
            const contentScroll = contentView.scrollTop;
            const pollIndex = Math.round(contentScroll / contentViewHeight);

            if (this.polls.length - pollIndex < 2) {
                this.addPoll();
            }
        },
        nextPoll() {
            const contentView = this.$refs['contentView'] as HTMLElement;
            const contentViewHeight = contentView.clientHeight;
            contentView.scrollBy({
                top: contentViewHeight,
                behavior: 'smooth'
            });
        },
        async addPoll() {
            const res = await API.RequestLogged(ROUTES.POLLS.GET());
            if (res.error) {
                console.error(res.message);
                return;
            }

            const poll = res.data;
            this.polls.push(poll);
        }
    }
});
</script>
