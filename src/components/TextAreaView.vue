<template>
    <textarea :type="type" :name="name"
        class="flex w-full max-w-full rounded-md bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 border-2 border-slate-300 dark:border-slate-500 focus:outline outline-indigo-600" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    components: {},
    props: {
        type: {
            type: String,
            default: 'text'
        },
        name: {
            type: String,
            required: true
        }
    },
    setup() {
        return {}
    },
    methods: {}
});
</script>