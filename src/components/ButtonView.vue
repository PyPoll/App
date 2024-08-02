<template>
    <button @click="handleClick" class="relative rounded-lg py-2 px-3 focus:outline outline-indigo-600"
        :class="bg ? 'bg-indigo-500 text-slate-50' : ''">
        <div v-show="loading"
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-lg overflow-hidden"
            :class="bg ? 'bg-indigo-500' : ''">
            <div class="flex grow h-full w-full justify-center items-center">
                <LoadingIcon class="w-6 h-6" />
            </div>
        </div>
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingIcon from './LoadingIcon.vue';

export default defineComponent({
    components: {
        LoadingIcon
    },
    props: {
        bg: {
            type: Boolean,
            default: true
        },
        click: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        handleClick(ev) {
            if (this.click) {
                const res = this.click(ev);
                if (res instanceof Promise) {
                    this.loading = true;
                    res.finally(() => {
                        this.loading = false;
                    });
                }
            }
        }
    }
});
</script>