<template>
    <select class="px-2 py-1 rounded-md bg-slate-600" :value="value" @change="onChange(($event as any).target.value)">
        <option v-for="(option, index) in options" :key="index" :value="(option as any).value">
            <GetText v-if="(option as any).context" :context="(option as any).context" />
            <span v-else>{{ (option as any).name }}</span>
        </option>
    </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GetText from './GetText.vue';

export default defineComponent({
    components: {
        GetText
    },
    props: {
        options: {
            type: Array,
            required: true
        },
        onChange: {
            type: Function,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    setup() {
        return {

        }
    }
});
</script>