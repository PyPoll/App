<template>
    <component :is="part.type" v-for="(part, index) in content" :key="index" :text="part.text">
        {{ part.text }}
    </component>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import AccountMention from './AccountMention.vue';

export default defineComponent({
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            content: [] as any[]
        }
    },
    watch: {
        text() {
            this.updateFormattedText();
        }
    },
    mounted() {
        this.updateFormattedText();
    },
    methods: {
        updateFormattedText() {
            const parted = this.text.split(/(\s)/);
            this.content = [];

            for (let i = 0; i < parted.length; i++) {
                const part = parted[i];
                if (part.startsWith('http')) {
                    this.content.push({
                        type: 'link',
                        text: part
                    });
                } else if (part.startsWith('@')) {
                    this.content.push({
                        type: markRaw(AccountMention),
                        text: part.substring(1)
                    });
                } else {
                    this.content.push({
                        type: 'span',
                        text: part
                    });
                }
            }
        }
    }
});
</script>
