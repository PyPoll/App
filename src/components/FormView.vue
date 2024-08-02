<template>
    <div class="flex flex-col justify-center items-center space-y-4">
        <div class="flex justify-center items-center">
            <p class="text-xl font-semibold"> {{ title }} </p>
        </div>
        <div>
            <slot />
        </div>
        <LogZone ref="logZone" />
        <span class="flex my-2 h-1 w-full card" />
        <div class="flex h-fit w-full justify-between items-center">
            <ButtonView v-show="cancelLabel.length > 0" :bg="false" @click="callCancel"> {{ cancelLabel }} </ButtonView>
            <ButtonView @click="callValidate"> {{ validateLabel }} </ButtonView>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonView from '@/components/ButtonView.vue';
import LogZone from './LogZone.vue';

export default defineComponent({
    components: {
        ButtonView,
        LogZone
    },
    props: {
        title: {
            type: String,
            required: true
        },
        onValidate: {
            type: Function,
            required: true
        },
        onCancel: {
            type: Function,
            default: () => { }
        },
        validateLabel: {
            type: String,
            default: 'Validate'
        },
        cancelLabel: {
            type: String,
            default: 'Cancel'
        }
    },
    methods: {
        callCancel() {
            this.onCancel?.()
        },
        callValidate() {
            this.onValidate?.()
        },
        log(...args) {
            const logZone = this.$refs['logZone'] as any;
            return logZone.log(...args);
        }
    }
});
</script>
