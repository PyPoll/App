<template>
    <div class="relative flex flex-col w-full h-full space-y-2 p-2 md:p-3 lg:p-4">
        <div class="absolute top-0 left-0 w-full h-full">
            <canvas ref="bubblesCanvas" class="w-full h-full" />
        </div>
        <div ref="contentView" class="show-down h-full w-full overflow-scroll snap-mandatory snap-y no-scrollbar">
            <PollView v-for="(poll, index) in polls" :key="index" :poll="poll" />
            <div v-if="polls.length <= 0 && !error"
                class="show-up flex flex-col h-full w-full space-y-4 justify-center items-center">
                <p class="text-center text-2xl font-semibold">
                    <GetText :context="Lang.CreateTranslationContext('poll', 'LoadingPolls')" />
                </p>
                <div>
                    <LoadingIcon class="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                </div>
            </div>
            <div v-if="polls.length <= 0 && error"
                class="show-up flex flex-col h-full w-full space-y-4 justify-center items-center">
                <p class="text-center text-2xl font-semibold">
                    <GetText :context="Lang.CreateTranslationContext('poll', 'NoPolls')" />
                </p>
                <p class="text-center">
                    <GetText :context="Lang.CreateTranslationContext('poll', 'NoPollsDesc')" />
                </p>
            </div>
        </div>
        <div
            class="show-up flex h-fit w-full min-h-0 max-h-full pb-2 p-1 shadow-lg md:pb-2 lg:pb-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-800/[0.5]">
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
import GetText from '@/components/GetText.vue';
import Lang from '@/scripts/Lang';
import LoadingIcon from '@/components/LoadingIcon.vue';
import BubbleIcon from '@/components/BubbleIcon.vue';
import * as bubblesBg from '@/scripts/bubblesBackground';

export default Vue.defineComponent({
    components: {
        PollView,
        DashButtonView,
        UserIcon,
        MagnifyingGlassIcon,
        PlusIcon,
        GetText,
        LoadingIcon,
        BubbleIcon
    },
    setup() {
        return {}
    },
    data() {
        return {
            Lang,
            error: false,
            polls: [] as any[],
            currentPollIndex: 0,
            lastPollIndex: 0,
            lastPollviewTimeMS: new Date().getTime(),
            bubbles: [] as { x: number, y: number, s: number }[]
        }
    },
    mounted() {
        const contentView = this.$refs['contentView'] as HTMLElement;

        // Prevent the user from scrolling past the next poll
        let scrolling = false;
        let scrollingTimeout: any = null;
        contentView.addEventListener("scroll", ev => {
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

        this.addPoll(this.$route.query.pollId ? parseInt(this.$route.query.pollId as string) : undefined).then(() => {
            if (this.polls.length <= 0 || this.polls[0] === null)
                return;
            this.addPoll();
        });

        this.checkorBubbles();
    },
    methods: {
        onScrollStart() {

        },
        onScrollEnd() {
            bubblesBg.onScrollEnd();

            const contentView = this.$refs['contentView'] as HTMLElement;
            const contentViewHeight = contentView.clientHeight;
            const contentScroll = contentView.scrollTop;
            this.currentPollIndex = Math.round(contentScroll / contentViewHeight);

            if (this.currentPollIndex !== this.lastPollIndex) {
                this.lastPollIndex = this.currentPollIndex;

                // check if skipped
                const currentTimeMS = new Date().getTime();
                const deltaMS = currentTimeMS - this.lastPollviewTimeMS;
                this.lastPollviewTimeMS = currentTimeMS;

                if (deltaMS < 2000 && this.polls[this.currentPollIndex]) { // skipped if less than 2 seconds
                    API.RequestLogged(ROUTES.STATS.SKIPPED_POLL(this.polls[this.currentPollIndex].id));
                }
            }

            if (this.polls.length - this.currentPollIndex < 2) {
                this.addPoll();
            }

            // set route ?pollId={id} for sharing
            this.$router.push({ query: { pollId: this.polls[this.currentPollIndex]?.id } });
        },
        nextPoll() {
            const contentView = this.$refs['contentView'] as HTMLElement;
            const contentViewHeight = contentView.clientHeight;
            contentView.scrollBy({
                top: contentViewHeight,
                behavior: 'smooth'
            });
        },
        async addPoll(id?: number) {
            try {
                const res = await API.RequestLogged(ROUTES.POLLS.GET(id));
                if (res.error) {
                    if (res.status === 404) {
                        this.polls.push(null);
                        return;
                    }

                    console.error(res.message);
                    this.error = true;
                    return;
                }

                const poll = res.data;
                if (poll) {
                    this.polls.push(poll);
                    this.error = false;
                } else {
                    this.error = true;
                }
            } catch (err) {
                console.error(err);
                this.error = true;
                return;
            }
        },
        checkorBubbles() {
            const canvas = this.$refs['bubblesCanvas'] as HTMLCanvasElement;
            bubblesBg.setup(canvas);

            const container = this.$refs['contentView'] as HTMLElement;
            let lastScroll = container.scrollTop;
            container.addEventListener('scroll', () => {
                const scroll = container.scrollTop;
                const delta = scroll - lastScroll;
                lastScroll = scroll;
                bubblesBg.onScroll(delta);
            });
        }
    }
});
</script>
