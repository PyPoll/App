<template>
    <div class="flex flex-col grow h-full w-full space-y-8">
        <PollView :poll="poll" />
    </div>
</template>

<script lang="ts">
import PollView from '@/components/content/PollView.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        PollView
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {

    }
});
</script>
