<template>
    <button class="rounded-lg p-1 w-8 h-8 transition-all overflow-hidden" @click="toggle"
        :class="checked ? 'bg-indigo-500 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'">
        <CheckIcon v-show="checked" class="show-right w-full h-full text-slate-200" />
    </button>
    <input ref="input" type="checkbox" class="hidden" :name="name" :checked="checked" @change="inputChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    CheckIcon
} from '@heroicons/vue/24/outline';

export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        name: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        },
        onChange: {
            type: Function,
            default: () => { }
        }
    },
    setup() {
        return {
            checked: false
        }
    },
    mounted() {
        this.checked = this.selected;
        this.$forceUpdate();
    },
    methods: {
        inputChange() {
            this.checked = (this.$refs.input as any)?.checked;
            this.$forceUpdate();
        },
        toggle() {
            this.checked = !this.checked;
            (this.$refs.input as any).checked = this.checked;
            this.$forceUpdate();
            this.onChange(this.checked);
        }
    }
});
</script>
