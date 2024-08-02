<template>
    <div class="show-right flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">Search</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '../components/BackButtonView.vue';

export default Vue.defineComponent({
    components: {
        BackButtonView
    },
    setup() {
        return {}
    }
});
</script>
