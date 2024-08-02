<template>
    <div class="relative flex grow">
        <div class="flex absolute h-full w-full justify-center items-center z-10 transition-all"
            :class="img.loading ? 'opacity-100' : 'opacity-0'">
            <LoadingIcon class="w-1/6 h-1/6" />
        </div>
        <div ref="preview" class="absolute w-full h-full image-div blurme transition-all"
            :class="img.loading ? 'opacity-100' : 'opacity-0'" />
        <div ref="view" class="absolute w-full h-full image-div" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingIcon from '../LoadingIcon.vue';

export default defineComponent({
    components: {
        LoadingIcon
    },
    props: {
        img: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.applyImage();
    },
    watch: {
        img: {
            handler() {
                this.applyImage()
            },
            deep: true
        }
    },
    methods: {
        applyImage() {
            if (!this.img.url) return;

            if (this.img.loading) {
                const imgDiv = this.$refs.preview as HTMLDivElement;
                imgDiv.style.backgroundImage = `url(${this.img.url})`;
            } else {
                const imgDiv = this.$refs.view as HTMLDivElement;
                imgDiv.style.backgroundImage = `url(${this.img.url})`;
            }
        }
    }
});
</script>

<style>
.blurme {
    filter: blur(8px);
    transform: scale(1.2);
}

.image-div {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>