<template>
    <RouterLink :to="`/account?id=${user.id}`" class="flex flex-col bordered p-2 min-w-0 max-w-full">
        <div class="flex justify-center items-center w-full space-x-2">
            <div class="flex justify-center">
                <div class="h-16 w-16 rounded-full bg-white dark:bg-slate-800">

                </div>
            </div>
            <div class="flex flex-col min-w-0 w-full justify-center items-start px-2 space-y-1">
                <p class="text-xl font-semibold"> {{ user?.pseudo ?? '- - - - -' }} </p>
                <p
                    class="italic text-left text-sm opacity-70 whitespace-nowrap text-ellipsis overflow-hidden line-clamp-2 min-w-0 max-w-full">
                    <FormatText :text="user?.bio ?? ''" />
                </p>
            </div>
        </div>
    </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Lang from '@/scripts/Lang';
import FormatText from '../content/FormatText.vue';

export default defineComponent({
    components: {
        FormatText
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup() {
        return {
            Lang
        }
    }
});
</script>