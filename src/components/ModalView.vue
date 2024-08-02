<template>
    <div @click="hide"
        class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center transition-all bg-slate-900/[0.1] dark:bg-slate-900/[0.6] p-4"
        :class="(catchingEvents ? 'pointer-events-auto' : 'pointer-events-none') + ' ' + (showing ? 'opacity-1' : 'opacity-0')">
        <div @click="ev => ev.stopPropagation()"
            class="flex flex-col p-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md shadow-lg bordered"
            :class="animation">
            <slot />
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
            animation: ''
        }
    },
    mounted() {
        document.body.appendChild(this.$el);
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