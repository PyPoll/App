<template>
    <div class="flex w-0 h-0">
        <div @click="hide"
            class="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center transition-all bg-slate-900/[0.1] dark:bg-slate-950/[0.4] p-4"
            :class="(catchingEvents ? 'pointer-events-auto' : 'pointer-events-none') + ' ' + (showing ? 'opacity-1' : 'opacity-0')">
            <div @click="ev => ev.stopPropagation()"
                class="flex flex-col min-w-0 max-w-full min-h-0 max-h-full p-4 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md shadow-lg rounded-md border border-slate-200 dark:border-slate-800/[0.5]"
                :class="animation">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            catchingEvents: false,
            showing: false,
            animation: '',
            div: null as HTMLDivElement | null,
            id: Math.random().toString(36).substring(7)
        }
    },
    mounted() {
        const mainDiv = document.body.appendChild(this.$el.firstElementChild as HTMLDivElement);

        const basePath = this.$route.fullPath;
        const interval = setInterval(() => {
            if (this.$route.fullPath !== basePath) {
                clearInterval(interval);
                this.$el.remove();
                mainDiv.remove();
            }
        }, 500);
    },
    methods: {
        show() {
            this.catchingEvents = true;
            this.showing = true;
            this.animation = 'show-up';
        },
        hide() {
            this.catchingEvents = false;
            this.showing = false;
            this.animation = 'hide-down';
        }
    }
});
</script>
