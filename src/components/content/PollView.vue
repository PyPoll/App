<template>
    <div class="flex h-full w-full snap-start justify-center items-center my-4">
        <div
            class="flex flex-col h-fit min-h-0 max-h-full w-full p-4 md:p-5 lg:p-6 space-y-8 md:space-y-10 lg:space-y-12 justify-between rounded-xl my-2 shadow-lg border-2 border-slate-200 dark:border-slate-600">
            <div class="flex space-x-4">
                <div class="flex justify-center items-center">
                    <div class="rounded-md bg-slate-200 dark:bg-slate-600 w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div class="flex justify-center items-center">
                    <p class="text-2xl md:text-3xl lg:text-4xl font-bold"> {{ poll.author.pseudo }} </p>
                </div>
                <div class="flex flex-col grow justify-center items-end">
                    <button class="rounded-lg px-1 py-2" @click="toggleMenu">
                        <div class="flex space-x-1 md:space-x-2">
                            <span v-for="i in [1, 2, 3]" :key="i"
                                class="h-1 w-1 md:h-2 md:w-2 rounded-full bg-slate-700 dark:bg-slate-200" />
                        </div>
                    </button>
                    <div v-if="menuOpen" class="show-zoom relative h-0 w-0">
                        <div class="absolute top-0 right-0 h-fit w-fit">
                            <div
                                class="flex flex-col bordered p-3 shadow-xl justify-left items-center space-y-4 bg-slate-700">
                                <button v-for="option in menuOptions" :key="option.label" @click="option.action"
                                    class="flex justify-start items-center w-full space-x-2">
                                    <component :is="option.icon" class="h-6 w-6" />
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        {{ option.label }}
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col grow space-y-2">
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
                <div v-if="poll.medias && poll.medias.length"
                    class="flex flex-wrap rounded-md min-h-48 max-h-[40vh] h-full w-full overflow-hidden bg-slate-200 dark:bg-slate-600 p-[0.05em]">
                    <div v-for="(img, index) in imgs" :key="index"
                        class="flex grow min-w-[30vw] max-w-full min-h-0 max-h-full p-[0.05em]">
                        <PollimgView :img="img" class="rounded overflow-hidden" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-4 overflow-y-auto overflow-x-hidden">
                <button v-for="(answer, index) in poll.answers.filter(a => a)" :key="answer"
                    class="flex w-full rounded-lg p-2 px-3 space-x-2 border-2 bordered transition-all"
                    :class="selectedAnswers.indexOf(index) >= 0 ? 'bg-indigo-500 border-indigo-500 text-white' : ''"
                    @click="selectOption(index)">
                    <div class="flex font-semibold justify-center items-center h-full">
                        <p> {{ answer.emoji }} </p>
                    </div>
                    <div
                        class="flex min-w-0 max-w-full text-base md:text-xl lg:text-2xl font-semibold justify-center items-center h-full">
                        <p class="min-w-0 max-w-full whitespace-nowrap text-ellipsis overflow-hidden">
                            {{ answer.label }}
                        </p>
                    </div>
                </button>
            </div>
        </div>
        <ModalView ref="reportModal">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex space-x-4 justify-center items-center pb-4">
                    <ShieldExclamationIcon class="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                    <p class="text-xl font-bold">
                        <GetText :context="Lang.CreateTranslationContext('poll', 'Report')" />
                    </p>
                </div>
                <div class="flex flex-col justify-start items-start space-y-2 w-full">
                    <button v-for="type in reportTypes" :key="type" @click="() => reportPoll(type)"
                        class="flex justify-center items-center space-x-2 p-2" :bg="false">
                        <ChevronRightIcon class="w-6 h-6" />
                        <p>
                            <GetText :context="Lang.CreateTranslationContext('poll', type)" />
                        </p>
                    </button>
                </div>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import PollimgView from '@/components/content/PollimgView.vue';
import {
    ChevronRightIcon,
    UserIcon,
    ShieldExclamationIcon,
    ShareIcon
} from '@heroicons/vue/24/outline';
import { API } from '@/scripts/API';
import Lang from '@/scripts/Lang';
import ROUTES from '@/scripts/routes';
import { Share } from '@capacitor/share';
import ModalView from '../ModalView.vue';
import GetText from '@/components/GetText.vue';
import ButtonView from '../ButtonView.vue';

export default Vue.defineComponent({
    components: {
        ChevronRightIcon,
        PollimgView,
        ModalView,
        GetText,
        ButtonView,
        ShieldExclamationIcon
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    setup() {
        return {}
    },
    data() {
        return {
            API,
            Lang,
            imgs: [] as { url: string, loading: boolean }[],
            selectedAnswers: [] as number[],
            menuOpen: false,
            menuOptions: [
                {
                    label: 'Voir le profil',
                    icon: UserIcon,
                    action: () => {
                        this.$router.push(`/account?id=${this.poll.author.id}`)
                    }
                },
                {
                    label: 'Signaler',
                    icon: ShieldExclamationIcon,
                    action: () => { (this.$refs['reportModal'] as any)?.show(); }
                },
                {
                    label: 'Partager',
                    icon: ShareIcon,
                    action: async () => {
                        const pollPath = window.location.href.substring(window.location.hostname.length + window.location.protocol.length + 2);
                        const pollUrl = 'https://app.pypoll.com' + pollPath;
                        if ((await Share.canShare()).value) {
                            try {
                                await Share.share({
                                    title: this.poll.title,
                                    url: pollUrl
                                });
                            } catch (err) { console.error(err); }
                        } else {
                            await navigator.clipboard.writeText(pollUrl);
                        }
                    }
                }
            ],
            reportTypes: [
                'SexualContent',
                'Harassment',
                'Violence',
                'Hate',
                'FakeNews',
                'Spam',
                'Other'
            ]
        }
    },
    mounted() {
        if (this.poll.medias && this.poll.medias.length) {
            this.loadMedia()
        }

        window.addEventListener('mousedown', ev => {
            if (this.menuOpen) {
                setTimeout(() => {
                    if (this.menuOpen) {
                        this.menuOpen = false;
                    }
                }, 100);
            }
        });
    },
    watch: {
        poll: {
            handler() {
                if (this.poll.medias && this.poll.medias.length) {
                    this.loadMedia()
                }
            },
            deep: true
        }
    },
    methods: {
        selectOption(index) {
            if (this.poll.type === 'unique') {
                this.selectedAnswers = [index]
            } else {
                if (this.selectedAnswers.indexOf(index) !== -1) {
                    this.selectedAnswers = this.selectedAnswers.filter(i => i !== index)
                } else {
                    this.selectedAnswers.push(index)
                }
            }
        },
        async loadMedia() {
            this.imgs = new Array(this.poll.medias.length).fill({
                url: '',
                loading: true
            });

            // for preview, it's file objects not media objects
            // check the first item to see, and if it's a file, handle it and return 
            if (this.poll.medias[0] instanceof File) {
                for (let index = 0; index < this.poll.medias.length; index++) {
                    const media = this.poll.medias[index];
                    const previewUrl = URL.createObjectURL(media);
                    this.imgs[index] = {
                        loading: false,
                        url: previewUrl
                    };
                }
                return;
            }

            // load all images preview from server
            for (let index = 0; index < this.poll.medias.length; index++) {
                const media = this.poll.medias[index];
                const previewRes = await API.RequestLogged(ROUTES.MEDIAS.PREVIEW(media.id));
                const previewUrl = URL.createObjectURL(previewRes.blob);
                this.imgs[index] = {
                    loading: true,
                    url: previewUrl
                };
            }

            // load all images full size from server
            for (let index = 0; index < this.poll.medias.length; index++) {
                const media = this.poll.medias[index];
                const imgRes = await API.RequestLogged(ROUTES.MEDIAS.VIEW(media.id));
                const imgUrl = URL.createObjectURL(imgRes.blob);
                this.imgs[index] = {
                    loading: false,
                    url: imgUrl
                };
            }
        },
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        reportPoll(type) {
            (this.$refs['reportModal'] as any)?.hide();
            alert("TODO : Report poll (report type is " + type + ")");
        }
    }
});
</script>

<style>
.preview-img {
    filter: blur(8px);
    transform: scale(1.2)
}
</style>
