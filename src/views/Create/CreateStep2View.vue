<template>
    <div class="flex flex-col grow h-full w-full space-y-8">
        <!-- MEDIA SECTION -->
        <div class="flex flex-col h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">Medias</p>
                </div>
            </div>
            <div class="flex flex-col p-2 space-y-4">
                <div class="flex flex-col space-y-4 min-h-0 max-h-full w-full">
                    <div v-for="(file, index) in files" :key="index" class="flex bordered p-2 h-min w-full space-x-2">
                        <div class="min-w-0 min-h-0 max-w-full max-h-full w-8 h-8 rounded-md overflow-hidden">
                            <div class="h-full w-full bg-cover bg-center"
                                :style="`background-image: url(${file.url})`" />
                        </div>
                        <div class="flex justiy-center items-center min-w-0 max-w-full">
                            <p class="min-w-0 max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
                                {{ file.name }}
                            </p>
                        </div>
                        <div class="flex grow justify-end items-center">
                            <button @click="removeFile(index)">
                                <XMarkIcon class="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
                <div v-show="files && files.length < 4" class="flex w-full h-fit justify-center items-center">
                    <ButtonView @click="askForFile">Add</ButtonView>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ButtonView from '@/components/ButtonView.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        ButtonView,
        XMarkIcon
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            files: [] as any[]
        }
    },
    methods: {
        askForFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*'; // , video/*, audio/*
            input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length) {
                    for (let i = 0; i < files.length; i++) {
                        this.files.push(files[i]);
                        this.updatePollMedias();
                        if (this.files.length >= 4) {
                            break;
                        }
                    }
                }
            };
            input.click();
        },
        removeFile(index) {
            this.files.splice(index, 1);
            this.updatePollMedias();
        },
        updatePollMedias() {
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.medias = this.files;
            for (let i = 0; i < this.poll.medias.length; i++) {
                const media = this.poll.medias[i];
                media.url = URL.createObjectURL(media);
            }
        }
    }
});
</script>
