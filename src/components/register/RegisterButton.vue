<template>
    <div ref="parent" class="h-fit overflow-hidden transition-all ease-out-expo duration-500">
        <div class="p-3">
            <button class="flex flex-col w-full h-fit p-2 bg-indigo-500 rounded-lg shadow-md">
                <div class="flex space-x-1 whitespace-nowrap p-2 text-slate-50">
                    <ChevronRightIcon class="w-6 h-6 transition-all" :class="selected ? 'rotate-90' : ''" />
                    <p class="whitespace-nowrap">
                        <GetText :context="Lang.CreateTranslationContext('register', 'RegisterWith')" />
                    </p>
                    <b> {{ data.name }} </b>
                </div>
                <div ref="content" class="h-fit overflow-hidden transition-all" style="max-height: 0px;">
                    <div class="h-fit w-full p-2 pt-2 bg-slate-50 dark:bg-slate-700 rounded"
                        @click="ev => ev.stopPropagation()">
                        <slot />
                    </div>
                </div>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GetText from '../GetText.vue';
import {
    ChevronRightIcon
} from '@heroicons/vue/24/outline';
import Lang from '@/scripts/Lang';

export default defineComponent({
    components: {
        GetText,
        ChevronRightIcon
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        display: {
            type: Boolean,
            default: true,
        },
        selected: {
            type: Boolean,
            default: false,
        }
    },
    setup() {
        return {
            Lang
        }
    },
    watch: {
        display() {
            if (this.display)
                this.show();
            else this.hide();
        },
        selected() {
            if (this.selected)
                this.select();
            else this.unselect();
        }
    },
    mounted() {
        if (this.display)
            this.show();
        else this.hide();
        if (this.selected)
            this.select();
        else this.unselect();
    },
    methods: {
        hide() {
            const parent = this.$refs.parent as HTMLElement;
            parent.style.maxHeight = '0px';
        },
        show() {
            const parent = this.$refs.parent as HTMLElement;
            const button = parent.firstElementChild as HTMLElement;
            const height = button.getBoundingClientRect().height;
            parent.style.maxHeight = height + 'px';
        },
        select() {
            const content = this.$refs.content as HTMLElement;
            const div = content.firstElementChild as HTMLElement;
            const height = div.getBoundingClientRect().height;
            content.style.maxHeight = height + 'px';

            const parent = this.$refs.parent as HTMLElement;
            const button = parent.firstElementChild as HTMLElement;
            parent.style.maxHeight = 'fit-content';
            setTimeout(() => {
                const height = button.getBoundingClientRect().height;
                parent.style.maxHeight = height + 'px';
            }, 500);
        },
        unselect() {
            const content = this.$refs.content as HTMLElement;
            content.style.maxHeight = '0px';
        }
    }
})
</script>
