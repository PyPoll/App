<template>
    <button class="p-2 md:p-3 lg:p-4 rounded-xl bg-slate-200 dark:bg-slate-600" @click="$router.go(-1)">
        <ChevronLeftIcon class="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
    </button>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

export default Vue.defineComponent({
    components: {
        ChevronLeftIcon
    },
    setup() {
        return {}
    }
});
</script>
