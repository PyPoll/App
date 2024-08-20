<template>
    <RouterLink :to="`/?pollId=${poll.id}`" class="flex flex-col bordered p-2">
        <div class="flex space-x-4">
            <div class="flex justify-center items-center">
                <div class="rounded-md bg-slate-200 dark:bg-slate-600 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div class="flex justify-center items-center">
                <p class="text-xl md:text-2xl lg:text-3xl font-bold"> {{ poll.author.pseudo }} </p>
            </div>
        </div>
        <div class="flex flex-col grow space-y-2 p-2 pb-0">
            <div>
                <p
                    class="text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 dark:text-slate-300 line-clamp-3 overflow-ellipsis">
                    {{ poll.title }}
                </p>
                <p
                    class="text-base md:text-xl lg:text-2xl font-semibold text-slate-500 dark:text-slate-400 line-clamp-3 overflow-ellipsis">
                    {{ poll.description }}
                </p>
            </div>
        </div>
    </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        poll: {
            type: Object,
            required: true
        }
    }
});
</script>