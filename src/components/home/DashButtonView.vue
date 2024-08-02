<template>
    <div class="flex p-2 m-auto rounded-md transition-colors cursor-pointer">
        <slot />
    </div>
</template>

<script>
import * as Vue from 'vue';

export default Vue.defineComponent({
    setup() {
        return {}
    }
});
</script>
