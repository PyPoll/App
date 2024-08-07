<template>
    <div class="show-up flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
                    <GetText
                        :context="Lang.CreateTranslationContext('create', (nbStep < nbStepsTotal) ? 'CreatePoll' : 'AllGood')" />
                </p>
            </div>
        </div>
        <div class="flex flex-col grow min-h-0 max-h-full h-fit w-full">
            <div class="flex flex-col grow min-h-0 max-h-full h-full w-full p-4">
                <CreateStep1View ref="step-1" v-show="nbStep === 1" :class="movement > 0 ? 'show-left' : 'show-right'"
                    :poll="poll" />
                <CreateStep2View ref="step-2" v-show="nbStep === 2" :class="movement > 0 ? 'show-left' : 'show-right'"
                    :poll="poll" />
                <CreateStep3View ref="step-3" v-show="nbStep === 3" :class="movement > 0 ? 'show-left' : 'show-right'"
                    :poll="poll" />
                <CreateStep4View ref="step-4" v-show="nbStep === 4" :class="movement > 0 ? 'show-left' : 'show-right'"
                    :poll="poll" />
            </div>
            <div class="flex justify-between items-center p-2">
                <ButtonView @click="prevStep()" :class="nbStep > 1 ? '' : 'opacity-0'">
                    <ArrowLeftIcon class="w-5 h-5" />
                </ButtonView>
                <div class="flex space-x-2">
                    <p> {{ nbStep }} </p>
                    <p> / </p>
                    <p> {{ nbStepsTotal }} </p>
                </div>
                <ButtonView ref="next-button" @click="() => { if (canGoNext()) nextStep(); }" class="transition-all"
                    :class="nextValidated ? '' : 'opacity-50 pointer-events-none'">
                    <ArrowRightIcon v-if="nbStep < nbStepsTotal" class="w-5 h-5" />
                    <CheckIcon v-else class="w-5 h-5" />
                </ButtonView>
            </div>
        </div>
        <ModalView ref="uploadModal">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex flex-col justify-center items-center">
                    <p class="flex text-xl font-semibold whitespace-nowrap space-x-2">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Uploading')" />
                        <span>🫡</span>
                    </p>
                    <p class="italic">
                        <GetText :context="Lang.CreateTranslationContext('create', messageKey, messageFormat)" />
                    </p>
                </div>
                <div class="flex grow h-full w-full justify-center items-center py-12 px-20">
                    <LoadingIcon />
                </div>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CreateStep1View from '@/views/Create/CreateStep1View.vue';
import CreateStep2View from '@/views/Create/CreateStep2View.vue';
import CreateStep3View from '@/views/Create/CreateStep3View.vue';
import CreateStep4View from '@/views/Create/CreateStep4View.vue';
import BackButtonView from '../components/BackButtonView.vue';
import ButtonView from '@/components/ButtonView.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/vue/24/outline';
import ModalView from '@/components/ModalView.vue';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import User from '@/scripts/User';

export default defineComponent({
    components: {
        BackButtonView,
        ButtonView,
        ArrowLeftIcon,
        ArrowRightIcon,
        CheckIcon,
        CreateStep1View,
        CreateStep2View,
        CreateStep3View,
        CreateStep4View,
        ModalView,
        LoadingIcon,
        GetText
    },
    setup() {
        return {}
    },
    data() {
        return {
            nbStep: 1,
            nbStepsTotal: 4,
            movement: 0,
            Lang,
            poll: {
                title: '',
                description: '',
                tags: [],
                author: { pseudo: User.CurrentUser?.pseudo ?? 'Anonymous' },
                type: 'unique',
                answers: [],
                medias: []
            },
            uploadModal: null as typeof ModalView | null,
            nextValidated: false,
            messageKey: 'UploadingPoll',
            messageFormat: {} as any,
        }
    },
    mounted() {
        this.uploadModal = this.$refs['uploadModal'] as typeof ModalView;
        setInterval(() => {
            this.nextValidated = this.canGoNext();
        }, 500);
    },
    methods: {
        nextStep() {
            this.movement = 1;
            if (this.nbStep < this.nbStepsTotal) {
                this.nbStep += 1;
            } else {
                this.uploadPoll();
            }
        },
        prevStep() {
            this.movement = -1;
            if (this.nbStep > 1) {
                this.nbStep -= 1;
            }
        },
        async uploadPoll() {
            this.uploadModal?.show();
            this.messageKey = 'UploadingPoll';
            const pollres = await API.RequestLogged(ROUTES.POLLS.CREATE(
                this.poll.title, // title
                this.poll.description, // description
                this.poll.type, // type
                this.poll.answers.map((a: any) => ({ emoji: a.emoji, label: a.label })), // answers
                this.poll.tags.map((t: string) => t.trim().toLowerCase()) // tags
            ));
            if (pollres.error) {
                console.error(pollres.message);
                return;
            }
            const poll = pollres.data;

            let index = 0;
            this.messageKey = 'CompressingMedia';
            for (const media of await this.createCompressedMedias()) {
                this.messageKey = 'UploadingMedia';
                this.messageFormat = { index, total: this.poll.medias.length };
                const res = await API.SendFileLogged(ROUTES.POLLS.MEDIA(poll.id), media);
                if (res.error) {
                    console.log(res.message);
                    await API.RequestLogged(ROUTES.POLLS.DELETE(poll.id));
                    return;
                }
                index++;
            }

            this.done();
        },
        done() {
            this.uploadModal?.hide();
            setTimeout(() => {
                this.$router.push({ name: 'content' });
            }, 250);
        },
        async createCompressedMedias() {
            const medias: any[] = [];
            for (const media of this.poll.medias) {
                const compressed = await this.compressMedia(media);
                medias.push(compressed);
            }
            return medias;
        },
        async compressMedia(media: any) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            reject('Could not compress media');
                            return;
                        }
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        canvas.toBlob((blob) => {
                            const newFile = new File([blob as Blob], media.name, { type: 'image/jpeg' });
                            resolve(newFile);
                        }, 'image/jpeg', 0.7);
                    };
                    img.src = e.target?.result as string;
                };
                reader.readAsDataURL(media);
            });
        },
        canGoNext() {
            const el = this.$refs[`step-${this.nbStep}`] as any;
            if (!el) return false;
            if (!el.validate) return true;
            return el.validate();
        }
    }
});
</script>
